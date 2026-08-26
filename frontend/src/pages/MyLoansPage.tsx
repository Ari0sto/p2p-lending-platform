import { useEffect, useState } from "react";

import {
  getMyLoans,
  repayLoan,
  type Loan,
} from "../services/loanService";

import "./MyLoansPage.css";

function MyLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repayingId, setRepayingId] =
    useState<number | null>(null);

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyLoans();
      setLoans(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не вдалося завантажити кредити");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleRepay = async (loanId: number) => {
    try {
      setRepayingId(loanId);
      setError("");

      await repayLoan(loanId);

      await loadLoans();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не вдалося погасити кредит");
      }
    } finally {
      setRepayingId(null);
    }
  };

  return (
    <main className="my-loans-page">
      <div className="my-loans-header">
        <div>
          <span className="my-loans-badge">
            ПОЗИЧАЛЬНИК
          </span>

          <h1>Мої кредити</h1>

          <p>
            Переглядайте свої кредитні заявки,
            фінансування та статус погашення.
          </p>
        </div>

        <div className="my-loans-count">
          Всього заявок:{" "}
          <strong>{loans.length}</strong>
        </div>
      </div>

      {loading && (
        <p className="my-loans-message">
          Завантаження...
        </p>
      )}

      {error && (
        <p className="my-loans-error">
          {error}
        </p>
      )}

      {!loading && loans.length === 0 && (
        <div className="my-loans-empty">
          <h2>У вас ще немає кредитних заявок</h2>

          <p>
            Створіть першу заявку через пункт
            «Створити заявку» у меню.
          </p>
        </div>
      )}

      {!loading && loans.length > 0 && (
        <div className="my-loans-grid">
          {loans.map((loan) => {
            const amount = Number(loan.amount);
            const funded = Number(loan.funded_amount);

            const progress =
              amount > 0
                ? Math.min(
                    (funded / amount) * 100,
                    100
                  )
                : 0;

            return (
              <article
                className="my-loan-card"
                key={loan.id}
              >
                <div className="my-loan-top">
                  <span>
                    Заявка #{loan.id}
                  </span>

                  <span className="my-loan-status">
                    {loan.status}
                  </span>
                </div>

                <h2>
                  {amount.toLocaleString("uk-UA")} ₴
                </h2>

                <p className="my-loan-description">
                  {loan.description}
                </p>

                <div className="my-loan-info">
                  <div>
                    <span>Ставка</span>
                    <strong>
                      {Number(loan.interest_rate)}%
                    </strong>
                  </div>

                  <div>
                    <span>Термін</span>
                    <strong>
                      {loan.term_days} днів
                    </strong>
                  </div>
                </div>

                <div className="my-loan-funding">
                  <div className="my-loan-funding-text">
                    <span>Профінансовано</span>

                    <strong>
                      {funded.toLocaleString("uk-UA")} ₴
                      {" / "}
                      {amount.toLocaleString("uk-UA")} ₴
                    </strong>
                  </div>

                  <div className="my-loan-progress">
                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <span className="progress-percent">
                    {progress.toFixed(0)}%
                  </span>
                </div>

                {loan.status === "ACTIVE" && (
                  <button
                    className="repay-button"
                    onClick={() =>
                      handleRepay(loan.id)
                    }
                    disabled={repayingId === loan.id}
                  >
                    {repayingId === loan.id
                      ? "Погашення..."
                      : "Погасити кредит"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MyLoansPage;