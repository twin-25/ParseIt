from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from services.ingestion import ingest_documents
from llama_index.core import Document
from llama_index.readers.web import SimpleWebPageReader
from llama_index.core import SimpleDirectoryReader
from services.session_stores import update_session_index, update_documents

router = APIRouter()

@router.post("/ingest", status_code=200)
async def ingest(
  session_id: str = Form(...),
  text: Optional[str] = Form(None),
  url: Optional[str] = Form(None),
  files: Optional[list[UploadFile]] = File(None)
):
  documents = []
  names = []
  if text:
    documents.append(Document(text=text))
    preview = text[:50] + "...." if len(text) >50 else text
    names.append(preview)

  if url:
    reader = SimpleWebPageReader(html_to_text=True)
    url_docs = reader.load_data([url])
    print(f"URL DOCS: {[doc.text[:200] for doc in url_docs]}", flush=True)
    documents.extend(url_docs)
    names.append(url)

  if files:
    for file in files:
      contents = await file.read()
      with open(f'/tmp/{file.filename}', "wb") as f:
        f.write(contents)
        names.append(file.filename)
        

    file_docs= SimpleDirectoryReader(
      input_files=[f"/tmp/{f.filename}" for f in files]
    ).load_data()
    documents.extend(file_docs)

  if not documents:
    raise HTTPException(status_code=400, detail="No content provided")
  
  index = await ingest_documents(documents, session_id)

  update_session_index(session_id, index)
  update_documents(session_id, names)

  return {"message":"Documents ready to chat"}
  


