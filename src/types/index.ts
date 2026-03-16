export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
}