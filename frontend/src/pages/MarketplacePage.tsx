import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAvailableLoans,
  type Loan,
} from "../services/loanService";

import "./LoanMarketplace.css";

function MarketplacePage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLoans = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAvailableLoans();

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

    loadLoans();
  }, []);

  if (loading) {
    return (
      <div className="marketplace-page">
        <p className="marketplace-message">
          Завантаження кредитів...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-page">
        <p className="marketplace-error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="marketplace-page">
      <div className="marketplace-header">
        <div>
          <h1>Маркетплейс кредитів</h1>

          <p>
            Оберіть кредитну заявку для інвестування
          </p>
        </div>

        <div className="available-count">
          Доступно заявок: <strong>{loans.length}</strong>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="empty-marketplace">
          <h2>Поки немає доступних заявок</h2>

          <p>
            Нові кредитні заявки з&apos;являться тут після їх створення
            позичальниками.
          </p>
        </div>
      ) : (
        <div className="loan-grid">
          {loans.map((loan) => {
            const amount = Number(loan.amount);
            const funded = Number(loan.funded_amount);

            const progress =
              amount > 0
                ? Math.min((funded / amount) * 100, 100)
                : 0;

            const remaining = Math.max(
              amount - funded,
              0
            );

            return (
              <article
                className="loan-card"
                key={loan.id}
              >
                <div className="loan-card-top">
                  <span className="loan-number">
                    Заявка #{loan.id}
                  </span>

                  <span className="loan-status">
                    {loan.status}
                  </span>
                </div>

                <h2>
                  {amount.toLocaleString("uk-UA")} ₴
                </h2>

                <p className="loan-description">
                  {loan.description}
                </p>

                <div className="loan-data">
                  <div>
                    <span>Ставка</span>
                    <strong>
                      {Number(
                        loan.interest_rate
                      )}%
                    </strong>
                  </div>

                  <div>
                    <span>Термін</span>
                    <strong>
                      {loan.term_days} днів
                    </strong>
                  </div>
                </div>

                <div className="funding-block">
                  <div className="funding-info">
                    <span>Профінансовано</span>

                    <strong>
                      {funded.toLocaleString("uk-UA")} ₴
                      {" / "}
                      {amount.toLocaleString("uk-UA")} ₴
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="remaining">
                    Залишилось зібрати:{" "}
                    <strong>
                      {remaining.toLocaleString("uk-UA")} ₴
                    </strong>
                  </p>
                </div>

                <Link
                  to={`/loans/${loan.id}`}
                  className="loan-details-button"
                >
                  Детальніше
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MarketplacePage;