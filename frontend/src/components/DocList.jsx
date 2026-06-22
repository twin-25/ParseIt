import React from 'react'
import { useGetDocumentsQuery } from '../api/parsitApi'

const DocList = ({session_id}) => {
  const{data: names, isLoading, error} = useGetDocumentsQuery(session_id)
  return (
  <div className='flex flex-col flex-1 overflow-y-auto relative bg-background'> 
<h2 className="mb-2 text-lg font-medium text-text">List of documents Ingested:</h2>
<ul className="max-w-md space-y-1 text-text list-disc list-inside">
  {names?.documents.map((name, index)=>(
    <li key={index}>
        {name}
    </li>
  ))}
</ul>
</div> 

  )
}

export default DocList