export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  preferredCurrency?: string;
  upiId?: string;
  profileImage?: {
    url: string | null;
    publicId: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
