import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000";

export interface CurrentUser {
  id: number;
  email: string;
  role: "ADMIN" | "INVESTOR" | "BORROWER";
  balance: number;
  credit_score: number;
  created_at: string;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMe(): Promise<CurrentUser> {
  const response = await fetch(
    `${API_URL}/users/me`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося отримати дані користувача"
    );
  }

  return result;
}

export async function depositBalance(
  amount: number
): Promise<CurrentUser> {
  const response = await fetch(
    `${API_URL}/users/me/deposit`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося поповнити баланс"
    );
  }

  return result;
}