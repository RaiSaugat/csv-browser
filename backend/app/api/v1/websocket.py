from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import websocket_manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle any incoming messages
            data = await websocket.receive_text()
            # Echo back or handle client messages if needed
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
