import { useEffect, useState } from "react";

import {
  getMyTransactions,
  type Transaction,
} from "../services/transactionService";

import "./TransactionHistoryPage.css";

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyTransactions();

        setTransactions(
          [...data].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Не вдалося завантажити транзакції");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "Поповнення балансу";

      case "INVESTMENT":
        return "Інвестиція";

      case "LOAN_RECEIVED":
        return "Отримання кредиту";

      case "LOAN_REPAYMENT":
        return "Погашення кредиту";

      case "INVESTMENT_RETURN":
        return "Повернення інвестиції";

      case "PROFIT":
        return "Прибуток";

      default:
        return type;
    }
  };

  const isPositiveTransaction = (type: string) => {
    return [
      "DEPOSIT",
      "LOAN_RECEIVED",
      "INVESTMENT_RETURN",
      "PROFIT",
    ].includes(type);
  };

  return (
    <main className="transactions-page">
      <div className="transactions-header">
        <div>
          <span className="transactions-badge">
            ФІНАНСОВА ІСТОРІЯ
          </span>

          <h1>Історія транзакцій</h1>

          <p>
            Усі фінансові операції вашого акаунта.
          </p>
        </div>

        <div className="transactions-count">
          Операцій:{" "}
          <strong>{transactions.length}</strong>
        </div>
      </div>

      {loading && (
        <p className="transactions-message">
          Завантаження транзакцій...
        </p>
      )}

      {error && (
        <p className="transactions-error">
          {error}
        </p>
      )}

      {!loading && transactions.length === 0 && (
        <div className="transactions-empty">
          <h2>Історія поки порожня</h2>

          <p>
            Після фінансових операцій вони з&apos;являться тут.
          </p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="transactions-card">
          {transactions.map((transaction) => {
            const positive =
              isPositiveTransaction(transaction.type);

            return (
              <div
                className="transaction-row"
                key={transaction.id}
              >
                <div className="transaction-icon">
                  {positive ? "+" : "−"}
                </div>

                <div className="transaction-info">
                  <strong>
                    {getTypeLabel(transaction.type)}
                  </strong>

                  <span>
                    {new Date(
                      transaction.created_at
                    ).toLocaleString("uk-UA")}
                  </span>
                </div>

                <div
                  className={
                    positive
                      ? "transaction-amount positive"
                      : "transaction-amount negative"
                  }
                >
                  {positive ? "+" : "−"}
                  {Math.abs(
                    Number(transaction.amount)
                  ).toLocaleString("uk-UA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₴
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default TransactionHistoryPage;