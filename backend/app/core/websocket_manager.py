from typing import List
from fastapi import WebSocket
import json


class ConnectionManager:
    """Manages WebSocket connections and broadcasts messages"""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Broadcast a message to all connected clients"""
        message_json = json.dumps(message)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception:
                disconnected.append(connection)

        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)


# Global WebSocket manager instance
websocket_manager = ConnectionManager()
