import axios from "axios";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// Define what the signup request should look like
export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Define what you expect the backend to return
export interface SignupResponse {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

// Signup function using axios and type safety
export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await axios.post<SignupResponse>(`${BASE_URL}/user/signUp`, payload);

  const { token } = response.data;

  // Store token and user info locally
  // In a real production app, this token should be stored in HttpOnly cookies for better security.
  localStorage.setItem("authToken", token);
  return response.data;
};


// Define what the signup request should look like
export interface LoginPayload {
  email: string;
  password: string;
}

// Define what you expect the backend to return
export interface LoginResponse {
  token: string;
}

// Login function using axios and type safety
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/user/login`, payload);

  const { token } = response.data;

  // Store token and user info locally.
  // In a real production app, this token should be stored in HttpOnly cookies for better security.
  localStorage.setItem("authToken", token);
  return response.data;
};