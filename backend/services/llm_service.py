from groq import Groq
from typing import List, Dict
from config import settings


class LLMService:
    """
    Groq-based LLM service — ultra-fast inference, free tier available.
    Models: llama-3.3-70b-versatile, llama3-8b-8192, mixtral-8x7b-32768, gemma2-9b-it
    Get your free API key at: https://console.groq.com
    """

    SYSTEM_PROMPT = """You are Nexa, a helpful and intelligent voice AI assistant created by Voicenexa AI.
You respond concisely and naturally since your responses are converted to speech.
Keep replies short and conversational unless detailed information is specifically requested.
Be friendly, warm, and helpful. Do not use markdown formatting in your responses."""

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model  = settings.GROQ_MODEL

    def generate_response(self, messages: List[Dict], user_message: str) -> str:
        """Generate a response using Groq's fast inference API."""
        conversation = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        conversation.extend(messages)
        conversation.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=conversation,
                max_tokens=512,
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq LLM error: {e}")
            raise


llm_service = LLMService()
