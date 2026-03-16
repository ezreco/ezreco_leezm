import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import smartCompareReducer from './slices/smartCompareSlice'
import loginReducer from './slices/loginSlice'
import personaDiscussionReducer from './slices/personaDiscussionSlice'
import tournamentReducer from './slices/tournamentSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    smartCompare: smartCompareReducer,
    login: loginReducer,
    personaDiscussion: personaDiscussionReducer,
    tournament: tournamentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch