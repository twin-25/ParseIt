from llama_index.llms.anthropic import Anthropic
from decouple import config
from llama_index.core.memory import ChatMemoryBuffer



def build_chat_engine(index):
  
  llm = Anthropic(
    model="claude-haiku-4-5",
    api_key=config("ANTHROPIC_API_KEY")
  )

  memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

  chat_engine = index.as_chat_engine(
    llm=llm,
    memory=memory,
    chat_mode="context",
    system_prompt="""You are Parsit, an AI assistant that answers questions 
    strictly based on the provided documents. If the answer is not in the 
    documents, say 'I cannot find that information in the provided documents.'
    Do not use any outside knowledge.""",
    streaming=True
    
  )

  return chat_engine