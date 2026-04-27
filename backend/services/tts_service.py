import requests
import base64
from config import settings


class TTSService:
    """ElevenLabs Text-to-Speech service."""

    BASE_URL = "https://api.elevenlabs.io/v1"

    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.voice_id = settings.ELEVENLABS_VOICE_ID

    def synthesize(self, text: str, voice_id: str = None, speed: float = 1.0) -> bytes:
        """Convert text to speech using ElevenLabs."""
        vid = voice_id or self.voice_id
        url = f"{self.BASE_URL}/text-to-speech/{vid}"

        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }

        payload = {
            "text": text,
            "model_id": "eleven_flash_v2_5",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "speed": speed,
            },
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            return response.content
        except requests.RequestException as e:
            print(f"TTS error: {e}")
            raise

    def get_voices(self) -> list:
        """Fetch available ElevenLabs voices."""
        url = f"{self.BASE_URL}/voices"
        headers = {"xi-api-key": self.api_key}
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.json().get("voices", [])
        except Exception as e:
            print(f"Error fetching voices: {e}")
            return []


tts_service = TTSService()
