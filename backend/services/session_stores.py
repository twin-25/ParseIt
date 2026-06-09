sessions = {}

def create_session(session_id, vector_index, chat):
  sessions[session_id] = {
    "index": vector_index,
    "chat_engine": chat
}


def get_session(session_id):
  return sessions.get(session_id)

def delete_session(session_id):
  sessions.pop(session_id, None)


def update_session_index(session_id, index):
    if session_id in sessions:
        sessions[session_id]["index"] = index


def update_chat_engine(session_id, chat_engine):
    if session_id in sessions:
        sessions[session_id]["chat_engine"] = chat_engine

