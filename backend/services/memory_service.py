from typing import List, Dict, Optional
from datetime import datetime
import uuid

class ConversationMemory:
    """Manages per-session conversation memory."""

    def __init__(self, max_turns: int = 10):
        self.max_turns = max_turns
        self.sessions: Dict[str, Dict] = {}

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "id": session_id,
            "messages": [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        return session_id

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.sessions:
            self.create_session_with_id(session_id)
        session = self.sessions[session_id]
        session["messages"].append({"role": role, "content": content})
        session["updated_at"] = datetime.utcnow().isoformat()
        # Keep only last max_turns pairs (user+assistant = 2 messages per turn)
        if len(session["messages"]) > self.max_turns * 2:
            session["messages"] = session["messages"][-(self.max_turns * 2):]

    def get_messages(self, session_id: str) -> List[Dict]:
        if session_id not in self.sessions:
            return []
        return self.sessions[session_id]["messages"]

    def get_session(self, session_id: str) -> Optional[Dict]:
        return self.sessions.get(session_id)

    def get_all_sessions(self) -> List[Dict]:
        return [
            {
                "id": s["id"],
                "created_at": s["created_at"],
                "updated_at": s["updated_at"],
                "message_count": len(s["messages"]),
                "preview": s["messages"][0]["content"][:80] + "..." if s["messages"] else "Empty session",
            }
            for s in self.sessions.values()
        ]

    def create_session_with_id(self, session_id: str):
        self.sessions[session_id] = {
            "id": session_id,
            "messages": [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

    def clear_session(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id]["messages"] = []

# Global instance
memory = ConversationMemory()
