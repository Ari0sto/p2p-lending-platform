import {
  getToken,
  getCurrentUser,
} from "./authService";

const API_URL = "http://127.0.0.1:8000";

export type LoanStatus =
  | "OPEN"
  | "FUNDED"
  | "ACTIVE"
  | "PAID"
  | "DEFAULTED";

export interface Loan {
  id: number;

  borrower_id?: number;
  borrower_email?: string;

  amount: number;
  funded_amount: number;

  interest_rate: number;
  term_days: number;

  description: string;
  status: LoanStatus;

  created_at: string;
}

export interface CreateLoanData {
  amount: number;
  interest_rate: number;
  term_days: number;
  description: string;
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* МАРКЕТПЛЕЙС */

export async function getAvailableLoans(): Promise<Loan[]> {
  const user = getCurrentUser();

  
  if (user?.role === "ADMIN") {
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

    /*
      У marketplace показуємо тільки ті заявки,
      куди ще можна інвестувати.
    */
    return result.filter(
      (loan: Loan) => loan.status === "OPEN"
    );
  }

  /*
    Для інвестора залишаємо звичайний endpoint.
  */
  const response = await fetch(
    `${API_URL}/loans/available`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити доступні кредити"
    );
  }

  return result;
}

/*ДЕТАЛІ КРЕДИТУ */

export async function getLoanById(
  loanId: number
): Promise<Loan> {
  const user = getCurrentUser();

  /*
    ADMIN:
    беремо всі кредити через /admin/loans
    і знаходимо потрібний.
  */
  if (user?.role === "ADMIN") {
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
          "Не вдалося завантажити кредит"
      );
    }

    const loan = result.find(
      (item: Loan) => item.id === loanId
    );

    if (!loan) {
      throw new Error(
        "Кредит не знайдено"
      );
    }

    return loan;
  }

  /* INVESTOR / інші дозволені ролі*/
  const response = await fetch(
    `${API_URL}/loans/${loanId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити кредит"
    );
  }

  return result;
}

/* СТВОРЕННЯ КРЕДИТУ */

export async function createLoan(
  data: CreateLoanData
): Promise<Loan> {
  const response = await fetch(
    `${API_URL}/loans/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося створити кредитну заявку"
    );
  }

  return result;
}

/* ПОГАШЕННЯ КРЕДИТУ */

export async function repayLoan(
  loanId: number
): Promise<Loan> {
  const response = await fetch(
    `${API_URL}/loans/${loanId}/repay`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося погасити кредит"
    );
  }

  return result;
}

/* МОЇ КРЕДИТИ*/

export async function getMyLoans(): Promise<Loan[]> {
  const response = await fetch(
    `${API_URL}/users/me/loans`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Не вдалося завантажити ваші кредити"
    );
  }

  return result;
}