import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const parsitApi = createApi({
  reducerPath: 'parsitApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (build) => ({
    createSession: build.mutation({
      query: () => ({
        url: '/sessions',
        method: 'POST'
      }),
    }),
    deleteSession: build.mutation({
      query: (session_id) => ({
        url: `/sessions/${session_id}`,
        method: 'DELETE'
      }),
    }),
    ingestData: build.mutation({
      query: (data) => {
        const formData = new FormData()
        formData.append('session_id', data.session_id)
        if (data.text) formData.append('text', data.text)
        if (data.url) formData.append('url', data.url)
        if (data.files) data.files.forEach(f => formData.append('files', f))
        return {
          url: '/ingest',
          method: 'POST',
          body: formData
        }
      },
    }),
  })
})

export const { useCreateSessionMutation, useDeleteSessionMutation, useIngestDataMutation } = parsitApi