from llama_index.core import Document, VectorStoreIndex, StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from decouple import config



async def ingest_documents(documents, session_id):
  db = chromadb.HttpClient(host="db", port=8000)
  chroma_collection = db.get_or_create_collection(session_id)
  vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
  embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    
)

  pipeline = IngestionPipeline(
    transformations=[
      SentenceSplitter(chunk_size=512, chunk_overlap=50),
      embed_model,
    ],
    vector_store=vector_store
  )

  await pipeline.arun(documents=documents)

  index = VectorStoreIndex.from_vector_store(vector_store, embed_model=embed_model)

  return index

def delete_collection(session_id):
  client = chromadb.HttpClient(host="db", port=8000)
  try:
    client.delete_collection(name=session_id)
  except Exception as e:
    print(f"Could not delete collection {session_id}: {e}")



