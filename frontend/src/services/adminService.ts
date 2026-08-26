import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface AdminUser {
  id: number;
  email: string;
  role: "ADMIN" | "INVESTOR" | "BORROWER";
  balance: number;
  credit_score: number;
  created_at: string;
}

export interface AdminLoan {
  id: number;
  borrower_id: number;
  amount: number;
  funded_amount: number;
  interest_rate: number;
  term_days: number;
  description: string;
  status: string;
  created_at: string;
}

export interface AdminInvestment {
  id: number;
  investor_id: number;
  loan_id: number;
  amount: number;
  created_at: string;
}

export interface AdminTransaction {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  created_at: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch(
    `${API_URL}/admin/users`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити користувачів"
    );
  }

  return result;
}

export async function getAdminLoans(): Promise<AdminLoan[]> {
  const response = await fetch(
    `${API_URL}/admin/loans`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити кредити"
    );
  }

  return result;
}

export async function getAdminInvestments(): Promise<AdminInvestment[]> {
  const response = await fetch(
    `${API_URL}/admin/investments`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити інвестиції"
    );
  }

  return result;
}

export async function getAdminTransactions(): Promise<AdminTransaction[]> {
  const response = await fetch(
    `${API_URL}/admin/transactions`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити транзакції"
    );
  }

  return result;
}