
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { parsitApi } from '../api/parsitApi'

export const store = configureStore({
  reducer: {

    [parsitApi.reducerPath]: parsitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(parsitApi.middleware),
})

setupListeners(store.dispatch)