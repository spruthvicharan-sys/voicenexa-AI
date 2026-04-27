from faster_whisper import WhisperModel
from config import settings
import io, tempfile, os, numpy as np, soundfile as sf
import subprocess


class STTService:
    def __init__(self):
        print(f"Loading Whisper model: {settings.WHISPER_MODEL}")
        self.model = WhisperModel(
            settings.WHISPER_MODEL,
            device="cpu",
            compute_type="int8"
        )
        print("Whisper model loaded.")

    def transcribe(self, audio_bytes: bytes) -> str:
        tmp_input = None
        tmp_wav = None
        try:
            # Write raw bytes to temp file
            with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
                tmp_input = f.name
                f.write(audio_bytes)

            # Convert to WAV using ffmpeg (handles any audio format)
            tmp_wav = tmp_input.replace(".webm", ".wav")
            result = subprocess.run([
                "ffmpeg", "-y",
                "-i", tmp_input,
                "-ar", "16000",
                "-ac", "1",
                "-f", "wav",
                tmp_wav
            ], capture_output=True, timeout=30)

            if result.returncode != 0:
                print(f"ffmpeg error: {result.stderr.decode()}")
                return ""

            # Transcribe with Whisper
            segments, info = self.model.transcribe(
                tmp_wav,
                language="en",
                beam_size=5,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            text = " ".join(s.text for s in segments).strip()
            print(f"Transcribed: '{text}'")
            return text

        except Exception as e:
            print(f"STT error: {e}")
            return ""
        finally:
            for f in [tmp_input, tmp_wav]:
                if f and os.path.exists(f):
                    try:
                        os.unlink(f)
                    except:
                        pass

    def check_wake_word(self, text: str) -> bool:
        return any(w in text.lower() for w in ["hey nexa", "hey, nexa"])


stt_service = STTService()
