import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000";

export interface CreateInvestmentData {
  loan_id: number;
  amount: number;
}

export interface Investment {
  id: number;
  investor_id: number;
  loan_id: number;
  amount: number;
  expected_profit?: number;
  created_at?: string;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createInvestment(
  data: CreateInvestmentData
): Promise<Investment> {
  const response = await fetch(
    `${API_URL}/investments/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Не вдалося виконати інвестицію"
    );
  }

  return result;
}

export async function getMyInvestments(): Promise<Investment[]> {
  const response = await fetch(
    `${API_URL}/users/me/investments`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити ваші інвестиції"
    );
  }

  return result;
}