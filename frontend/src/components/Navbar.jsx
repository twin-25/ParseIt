import React from 'react'

const Navbar = ({ sessionId, onEndSession }) => {
  return (
    <nav className="bg-surface border-b border-border px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-primary font-bold text-2xl">Parsit</span>
        <span className="text-text-muted text-sm">AI Document Chat</span>
      </div>
      
      {sessionId && (
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm bg-primary-light px-3 py-1 rounded-full">
            Session: {sessionId.slice(0, 8)}...
          </span>
          <button
            onClick={onEndSession}
            className="text-danger hover:text-red-700 text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar