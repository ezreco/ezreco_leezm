import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api";

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  [key: string]: any;
}

interface LoginState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoadingUser: boolean;
  userError: string | null;
}

const initialState: LoginState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
  isLoadingUser: false,
  userError: null,
};

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "login/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authApi.getCurrentUser();
      return userData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      // Store token in localStorage for persistence
      localStorage.setItem("accessToken", action.payload);
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.userError = null;
      localStorage.removeItem("accessToken");
    },
    restoreAccessToken: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data pending
      .addCase(fetchUserData.pending, (state) => {
        state.isLoadingUser = true;
        state.userError = null;
      })
      // Fetch user data fulfilled
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.user = action.payload;
        state.userError = null;
        // If user data is successfully fetched, user is authenticated
        if (action.payload && action.payload.id) {
          state.isAuthenticated = true;
        }
      })
      // Fetch user data rejected
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.userError = action.payload as string;
        // If fetching user data failed, clear auth state
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setAccessToken, clearAccessToken, restoreAccessToken } =
  loginSlice.actions;

export default loginSlice.reducer;
