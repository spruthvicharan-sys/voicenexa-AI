from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
import base64
import json
import uuid

from config import settings
from services.memory_service import memory
from services.stt_service import stt_service
from services.llm_service import llm_service
from services.tts_service import tts_service
from services.websocket_manager import ws_manager

app = FastAPI(title="Voicenexa AI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Voicenexa AI"}

# ─── REST Endpoints ────────────────────────────────────────────────────────────

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Transcribe uploaded audio file using Whisper."""
    try:
        audio_bytes = await file.read()
        text = stt_service.transcribe(audio_bytes)
        wake_word = stt_service.check_wake_word(text)
        return {"transcript": text, "wake_word_detected": wake_word}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Send a message and get Claude's response."""
    try:
        messages = memory.get_messages(req.session_id)
        response = llm_service.generate_response(messages, req.message)
        memory.add_message(req.session_id, "user", req.message)
        memory.add_message(req.session_id, "assistant", response)
        return {"response": response, "session_id": req.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TTSRequest(BaseModel):
    text: str
    voice_id: str = None
    speed: float = 1.0


@app.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech audio."""
    try:
        audio = tts_service.synthesize(req.text, req.voice_id, req.speed)
        audio_b64 = base64.b64encode(audio).decode("utf-8")
        return {"audio_base64": audio_b64, "format": "mp3"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sessions")
async def get_sessions():
    """Get all conversation sessions."""
    return {"sessions": memory.get_all_sessions()}


@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Get a specific session's messages."""
    session = memory.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.post("/api/sessions")
async def create_session():
    """Create a new conversation session."""
    session_id = memory.create_session()
    return {"session_id": session_id}


@app.delete("/api/sessions/{session_id}")
async def clear_session(session_id: str):
    memory.clear_session(session_id)
    return {"message": "Session cleared"}


@app.get("/api/voices")
async def get_voices():
    """Get available ElevenLabs voices."""
    voices = tts_service.get_voices()
    return {"voices": voices}

# ─── WebSocket Voice Session ──────────────────────────────────────────────────

@app.websocket("/ws/voice/{session_id}")
async def voice_websocket(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time voice session.
    Receives binary audio chunks, processes through STT → LLM → TTS pipeline,
    and sends back JSON status updates + binary audio response.
    """
    await ws_manager.connect(websocket, session_id)
    memory.create_session_with_id(session_id)

    try:
        while True:
            data = await websocket.receive()

            if "bytes" in data and data["bytes"]:
                audio_bytes = data["bytes"]

                # Status: transcribing
                await ws_manager.send_json(session_id, {"type": "status", "state": "thinking"})

                try:
                    # Step 1: STT
                    transcript = stt_service.transcribe(audio_bytes)
                    wake_word = stt_service.check_wake_word(transcript)

                    await ws_manager.send_json(session_id, {
                        "type": "transcript",
                        "text": transcript,
                        "wake_word": wake_word,
                    })

                    if not transcript.strip():
                        await ws_manager.send_json(session_id, {"type": "status", "state": "idle"})
                        continue

                    # Step 2: LLM
                    messages = memory.get_messages(session_id)
                    response_text = llm_service.generate_response(messages, transcript)

                    memory.add_message(session_id, "user", transcript)
                    memory.add_message(session_id, "assistant", response_text)

                    await ws_manager.send_json(session_id, {
                        "type": "response",
                        "text": response_text,
                    })

                    # Step 3: TTS
                    await ws_manager.send_json(session_id, {"type": "status", "state": "speaking"})
                    audio_response = tts_service.synthesize(response_text)
                    audio_b64 = base64.b64encode(audio_response).decode("utf-8")

                    await ws_manager.send_json(session_id, {
                        "type": "audio",
                        "audio_base64": audio_b64,
                        "format": "mp3",
                    })

                    await ws_manager.send_json(session_id, {"type": "status", "state": "idle"})

                except Exception as e:
                    await ws_manager.send_json(session_id, {
                        "type": "error",
                        "message": str(e),
                    })
                    await ws_manager.send_json(session_id, {"type": "status", "state": "idle"})

            elif "text" in data:
                # Handle control messages
                try:
                    msg = json.loads(data["text"])
                    if msg.get("type") == "ping":
                        await ws_manager.send_json(session_id, {"type": "pong"})
                except Exception:
                    pass

    except WebSocketDisconnect:
        ws_manager.disconnect(session_id)
    except Exception as e:
        print(f"WebSocket error for {session_id}: {e}")
        ws_manager.disconnect(session_id)
