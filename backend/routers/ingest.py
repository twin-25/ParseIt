from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from services.ingestion import ingest_documents
from llama_index.core import Document
from llama_index.readers.web import SimpleWebPageReader
from llama_index.core import SimpleDirectoryReader
from services.session_stores import update_session_index

router = APIRouter()

@router.post("/ingest", status_code=200)
async def ingest(
  session_id: str = Form(...),
  text: Optional[str] = Form(None),
  url: Optional[str] = Form(None),
  files: Optional[list[UploadFile]] = File(None)
):
  documents = []
  if text:
    documents.append(Document(text=text))

  if url:
    url_docs = SimpleWebPageReader().load_data([url])
    documents.extend(url_docs)

  if files:
    for file in files:
      contents = await file.read()
      with open(f'/tmp/{file.filename}', "wb") as f:
        f.write(contents)

    file_docs= SimpleDirectoryReader(
      input_files=[f"/tmp/{f.filename}" for f in files]
    ).load_data()
    documents.extend(file_docs)

  if not documents:
    raise HTTPException(status_code=400, detail="No content provided")
  
  index = ingest_documents(documents, session_id)

  update_session_index(session_id, index)

  return {"message":"Documents ready to chat"}
  


