from fastapi import WebSocket
from typing import Dict
import json

class WebSocketManager:
    """Manages active WebSocket connections."""

    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        print(f"WebSocket connected: {session_id}")

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            print(f"WebSocket disconnected: {session_id}")

    async def send_json(self, session_id: str, data: dict):
        ws = self.active_connections.get(session_id)
        if ws:
            await ws.send_text(json.dumps(data))

    async def send_bytes(self, session_id: str, data: bytes):
        ws = self.active_connections.get(session_id)
        if ws:
            await ws.send_bytes(data)

    async def broadcast_json(self, data: dict):
        for ws in self.active_connections.values():
            await ws.send_text(json.dumps(data))

ws_manager = WebSocketManager()
