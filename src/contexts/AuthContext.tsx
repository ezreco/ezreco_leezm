import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { clearAccessToken, fetchUserData, restoreAccessToken } from "../store/slices/loginSlice";
import { authApi } from "../api";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface User {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
}

// =============================================================================
// AUTH CONTEXT
// =============================================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// AUTH PROVIDER COMPONENT
// =============================================================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux store
  const { isAuthenticated, user } = useSelector((state: RootState) => state.login);

  // Login with email
  const login = async (email: string) => {
    try {
      // TODO: Implement email/password login
      // const response = await authApi.login({ email, password });
      // dispatch(setAccessToken(response.accessToken));
      // dispatch(fetchUserData());
      console.log("Email login not yet implemented:", email);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Login with Google - redirect to OAuth URL
  const loginWithGoogle = () => {
    authApi.googleLogin();
  };

  // Logout
  const logout = () => {
    dispatch(clearAccessToken());
  };

  // Check for existing auth token on mount and fetch user data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Restore token to Redux state
      dispatch(restoreAccessToken());
      // Fetch user data to verify token is still valid
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
