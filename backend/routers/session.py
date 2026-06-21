from fastapi import APIRouter, HTTPException
import uuid
from services.session_stores  import create_session as store_session, delete_session as remove_session, get_session
from services.ingestion import delete_collection
router = APIRouter()

@router.post("/sessions", status_code=201)
def create_session():
  session_id = str(uuid.uuid4())
  store_session(session_id, None, None)
  return {"session_id":session_id}

@router.delete('/sessions/{session_id}', status_code=200)
def delete_session(session_id: str):
  session = get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")
  delete_collection(session_id)
  remove_session(session_id)
  return {"message":"session deleted"}

