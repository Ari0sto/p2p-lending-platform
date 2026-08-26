const API_URL = "http://127.0.0.1:8000";

export type RegisterRole = "INVESTOR" | "BORROWER";

export interface RegisterData {
  email: string;
  password: string;
  role: RegisterRole;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: "ADMIN" | "INVESTOR" | "BORROWER";
  balance: number;
  credit_score: number;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося зареєструватися"
    );
  }

  return result;
}

export async function loginUser(
  data: LoginData
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося увійти"
    );
  }

  return result;
}
export interface AuthUser {
  id: number;
  email: string;
  role: "ADMIN" | "INVESTOR" | "BORROWER";
}

export function saveToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function logoutUser() {
  localStorage.removeItem("access_token");
}

export function getCurrentUser(): AuthUser | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return {
      id: Number(decodedPayload.sub),
      email: decodedPayload.email,
      role: decodedPayload.role,
    };
  } catch {
    return null;
  }
}