import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000";

export interface Transaction {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  created_at: string;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyTransactions(): Promise<Transaction[]> {
  const response = await fetch(
    `${API_URL}/users/me/transactions`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося завантажити історію транзакцій"
    );
  }

  return result;
}