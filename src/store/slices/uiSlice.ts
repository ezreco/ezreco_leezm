import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  isSidebarVisible: boolean
}

const initialState: UIState = {
  isSidebarVisible: true
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible
    },
    showSidebar: (state) => {
      state.isSidebarVisible = true
    },
    hideSidebar: (state) => {
      state.isSidebarVisible = false
    },
    resetUI: (state) => {
      state.isSidebarVisible = initialState.isSidebarVisible
    }
  }
})

export const { toggleSidebar, showSidebar, hideSidebar, resetUI } = uiSlice.actions

export default uiSlice.reducer