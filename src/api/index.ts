import axiosInstance from "./axiosInstance";
import type { AxiosRequestConfig } from "axios";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  description?: string;
  price?: number;
  [key: string]: unknown;
}

export interface SearchParams {
  q: string;
  limit?: number;
  offset?: number;
}

export interface CompareRequest {
  productIds: string[];
}

export interface RecommendRequest {
  preferences?: Record<string, unknown>;
  category?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface ChatMessageRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  // Google OAuth login - redirect URL
  googleLogin: (): void => {
    window.location.href = "http://43.200.32.71:3001/api/auth/google/login";
  },

  // Email/Password login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/signout");
    localStorage.removeItem("accessToken");
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/user");
    return response.data;
  },
};

// =============================================================================
// PRODUCT API
// =============================================================================

export const productApi = {
  // Search products
  search: async (params: SearchParams): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>("/products/search", {
      params,
    });
    return response.data;
  },

  // Get product details
  getById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Compare products
  compare: async (request: CompareRequest): Promise<Product[]> => {
    const response = await axiosInstance.post<Product[]>(
      "/products/compare",
      request
    );
    return response.data;
  },

  // Get product recommendations
  recommend: async (request: RecommendRequest): Promise<Product[]> => {
    const response = await axiosInstance.post<Product[]>(
      "/products/recommend",
      request
    );
    return response.data;
  },
};

// =============================================================================
// CHAT/AI API
// =============================================================================

export interface ChatMessage {
  id: string;
  message: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  messageId: string;
}

export const chatApi = {
  // Send message to AI
  sendMessage: async (request: ChatMessageRequest): Promise<ChatResponse> => {
    const response = await axiosInstance.post<ChatResponse>(
      "/chat/message",
      request
    );
    return response.data;
  },

  // Get chat history
  getHistory: async (): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get<ChatMessage[]>("/chat/history");
    return response.data;
  },
};

// =============================================================================
// USER API
// =============================================================================

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/user/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateRequest): Promise<User> => {
    const response = await axiosInstance.put<User>("/user/profile", data);
    return response.data;
  },

  // Get user favorites
  getFavorites: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>("/user/favorites");
    return response.data;
  },

  // Add to favorites
  addFavorite: async (productId: string): Promise<void> => {
    await axiosInstance.post("/user/favorites", { productId });
  },

  // Remove from favorites
  removeFavorite: async (productId: string): Promise<void> => {
    await axiosInstance.delete(`/user/favorites/${productId}`);
  },
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  auth: authApi,
  product: productApi,
  chat: chatApi,
  user: userApi,
};
