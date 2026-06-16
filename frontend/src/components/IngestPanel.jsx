import { useState } from 'react'
import { useIngestDataMutation } from '../api/parsitApi'

function IngestPanel({ sessionId }) {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [files, setFiles] = useState([])
  const [ingestData, { isLoading }] = useIngestDataMutation()

  const handleSubmit = async () => {
    await ingestData({ session_id: sessionId, text, url, files })
    setText('')
    setUrl('')
    setFiles([])
  }

  return (
    <div className="h-screen bg-surface flex flex-col">
      <div className="bg-primary p-6">
        <h2 className="text-xl font-bold text-white">Add Content</h2>
        <p className="text-primary-light text-sm mt-1">Paste text, URL or upload files</p>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1">
        <textarea
          className="w-full h-48 border border-border rounded-lg p-3 text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className="w-full border border-border rounded-lg p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          type="url"
          placeholder="Or paste a URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="w-full border border-border rounded-lg p-3 text-text"
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files)])}
        />

        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-primary-light px-3 py-2 rounded-lg">
                <span className="text-text text-sm">{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-danger text-sm hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isLoading ? 'Ingesting...' : 'Ingest'}
        </button>
      </div>
    </div>
  )
}

export default IngestPanel