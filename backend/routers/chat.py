from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.session_stores import get_session, update_chat_engine
from  services.chat_engine import build_chat_engine
from fastapi.responses import StreamingResponse

router = APIRouter()

class ChatRequest(BaseModel):
  session_id: str
  message: str

@router.post('/chat')
async def chat(request: ChatRequest):
  session = get_session(request.session_id)
  if not session:
    raise HTTPException(status_code=404, detail="No session found" )
  if session.get("chat_engine") != None:
    chat_engine = session.get("chat_engine")

  else:
    index = session.get("index")
    chat_engine = build_chat_engine(index)
    update_chat_engine(request.session_id,chat_engine)

  async def event_stream():
    response = await chat_engine.astream_chat(request.message)
    async for token in response.async_response_gen():
      yield f"data: {token}\n\n"
  
  return StreamingResponse(event_stream(), media_type="text/event-stream", headers={
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no"
  })
