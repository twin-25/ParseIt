import { useState } from 'react'
import IngestPannel from './components/IngestPanel'
import ChatPannel from './components/ChatPanel'
import Navbar from './components/Navbar'
import { useCreateSessionMutation, useDeleteSessionMutation } from './api/parsitApi'
import DocList from './components/DocList'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [createSession, { isLoading }] = useCreateSessionMutation()
  const[deleteSession] = useDeleteSessionMutation()


  const handleEndSession = async ()=>{

    await deleteSession(sessionId)
    setSessionId(null)
      
    }

  const handleStartSession = async () => {
    const result = await createSession().unwrap()
    setSessionId(result.session_id)
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Parsit</h1>
          <p className="text-text-muted mb-8">Paste. Ingest. Chat.</p>
          <button
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            onClick={handleStartSession}
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Session'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar sessionId={sessionId} onEndSession={handleEndSession} />
      <div className="flex flex-1">
        <div className="w-1/2 border-r border-border bg-surface">
          <IngestPannel sessionId={sessionId} />
        </div>
        <div className="w-1/2 bg-background">
          <ChatPannel sessionId={sessionId} />
        </div>
        
        
        
      </div>
    </div>
  )
}

export default App