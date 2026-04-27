import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Groq — fast free LLM inference (https://console.groq.com)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    # Best model options: llama-3.3-70b-versatile | llama3-8b-8192 | mixtral-8x7b-32768 | gemma2-9b-it
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # ElevenLabs — text-to-speech (https://elevenlabs.io)
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    # Whisper — speech-to-text (runs locally, no key needed)
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    MAX_MEMORY_TURNS: int = 10

settings = Settings()
