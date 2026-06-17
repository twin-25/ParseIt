import React from 'react'
import { useState, useEffect } from 'react'

const ChatPanel = ({sessionId}) => {
  const[messages, setMessages] = useState([])
  const[isStreaming, setIsStreaming] = useState(false)
  const[currentMessage, setCurrentMessage] = useState('')

  const handleSend = async () =>{
    setMessages(prev=>[...prev, {role:'user', content:currentMessage}])
    setCurrentMessage('')
    setMessages(prev=>[...prev, {role:'assistant', content:''}])
    setIsStreaming(true)
    try{
      const response = await fetch('http://localhost:8000/chat',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message: currentMessage })
    })
    const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  const lines = chunk.split('\n')

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const token = line.replace('data: ', '').replace(/\\n/g, '\n')

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].content += token
        return updated
      })
    }
  }
}

setIsStreaming(false)
    }catch(error){
      console.log(error)
    }


  }
  return (
    <div className="h-screen bg-surface flex flex-col">
      <div className="bg-primary p-6">
        <h2 className="text-xl font-bold text-white">Chat With Your content</h2>
        
      </div>
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index}
          className={`p-3 rounded-lg max-w-[70%] ${
            msg.role === 'assistant'
            ? 'bg-primary text-white self-start'
            : 'bg-primary-light text-text self-end'

          }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className='p-4 border-t border-border flex items-center gap-2 '>
        <textarea
        value={currentMessage}
        onChange={(e)=>setCurrentMessage(e.target.value)}
        className='flex-1 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2
        focus:ring-primary
        '
        placeholder='Ask something about your content...'
        />
        <button
        onClick={handleSend}
        disabled={isStreaming}
        className='bg-primary hover:bg-primary-dark text-white px-6 rounded-lg font-semibold transition-colors'>
          Send
        </button>
        

      </div>
      </div>
  )
}



export default ChatPanel