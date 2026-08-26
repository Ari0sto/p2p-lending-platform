import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getLoanById,
  type Loan,
} from "../services/loanService";

import {
  createInvestment,
} from "../services/investmentService";

import "./LoanDetailsPage.css";

function LoanDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const loanId = Number(id);

  const [loan, setLoan] = useState<Loan | null>(null);

  const [investmentAmount, setInvestmentAmount] =
    useState<number>(1000);

  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadLoan = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLoanById(loanId);

      setLoan(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не вдалося завантажити кредит");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(loanId)) {
      loadLoan();
    }
  }, [loanId]);

  const remainingAmount = useMemo(() => {
    if (!loan) {
      return 0;
    }

    return Math.max(
      Number(loan.amount) -
        Number(loan.funded_amount),
      0
    );
  }, [loan]);

  const progress = useMemo(() => {
    if (!loan) {
      return 0;
    }

    const amount = Number(loan.amount);
    const funded = Number(loan.funded_amount);

    if (amount <= 0) {
      return 0;
    }

    return Math.min(
      (funded / amount) * 100,
      100
    );
  }, [loan]);

  const expectedProfit = useMemo(() => {
    if (!loan) {
      return 0;
    }

    const amount = Number(investmentAmount);
    const rate = Number(loan.interest_rate);
    const days = Number(loan.term_days);

    if (amount <= 0) {
      return 0;
    }

    return (
      amount *
      (rate / 100) *
      (days / 365)
    );
  }, [
    investmentAmount,
    loan,
  ]);

  const handleInvest = async () => {
    if (!loan) {
      return;
    }

    if (user?.role !== "INVESTOR") {
      setError(
        "Інвестувати можуть тільки користувачі з роллю INVESTOR"
      );
      return;
    }

    setError("");
    setSuccess("");

    if (investmentAmount <= 0) {
      setError(
        "Сума інвестиції повинна бути більшою за 0"
      );
      return;
    }

    if (investmentAmount > remainingAmount) {
      setError(
        "Не можна інвестувати більше, ніж залишилось зібрати"
      );
      return;
    }

    try {
      setInvesting(true);

      await createInvestment({
        loan_id: loan.id,
        amount: investmentAmount,
      });

      setSuccess(
        "Інвестицію успішно виконано"
      );

      await loadLoan();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Не вдалося виконати інвестицію"
        );
      }
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <main className="loan-details-page">
        <p className="loan-details-message">
          Завантаження кредиту...
        </p>
      </main>
    );
  }

  if (error && !loan) {
    return (
      <main className="loan-details-page">
        <p className="loan-details-error">
          {error}
        </p>
      </main>
    );
  }

  if (!loan) {
    return null;
  }

  const amount = Number(loan.amount);
  const fundedAmount = Number(
    loan.funded_amount
  );

  return (
    <main className="loan-details-page">
      <section className="loan-details-wrapper">

        <div className="loan-details-main">

          <div className="loan-details-top">
            <div>
              <span className="loan-details-badge">
                КРЕДИТНА ЗАЯВКА #{loan.id}
              </span>

              <h1>
                {amount.toLocaleString("uk-UA")} ₴
              </h1>
            </div>

            <span className="loan-details-status">
              {loan.status}
            </span>
          </div>

          <p className="loan-details-description">
            {loan.description}
          </p>

          <div className="loan-details-stats">

            <div>
              <span>
                Процентна ставка
              </span>

              <strong>
                {Number(
                  loan.interest_rate
                )}%
              </strong>
            </div>

            <div>
              <span>
                Термін
              </span>

              <strong>
                {loan.term_days} днів
              </strong>
            </div>

            <div>
              <span>
                Позичальник
              </span>

              <strong>
                {loan.borrower_email
                  ? loan.borrower_email
                  : loan.borrower_id
                    ? `#${loan.borrower_id}`
                    : "—"}
              </strong>
            </div>

          </div>

          <div className="loan-progress-section">

            <div className="loan-progress-header">
              <span>
                Профінансовано
              </span>

              <strong>
                {fundedAmount.toLocaleString("uk-UA")} ₴
                {" / "}
                {amount.toLocaleString("uk-UA")} ₴
              </strong>
            </div>

            <div className="loan-details-progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="loan-progress-bottom">

              <span>
                {progress.toFixed(0)}%
              </span>

              <span>
                Залишилось:{" "}
                <strong>
                  {remainingAmount.toLocaleString(
                    "uk-UA"
                  )} ₴
                </strong>
              </span>

            </div>

          </div>

        </div>


     

        {user?.role === "INVESTOR" && (
          <aside className="investment-panel">

            <span className="investment-badge">
              ІНВЕСТУВАННЯ
            </span>

            <h2>
              Інвестувати в заявку
            </h2>

            <p className="investment-subtitle">
              Оберіть суму, яку хочете
              інвестувати в цей кредит.
            </p>

            <div className="investment-form-group">

              <label>
                Сума інвестиції
              </label>

              <div className="investment-input">

                <input
                  type="number"
                  min="1"
                  max={remainingAmount}
                  value={investmentAmount}
                  onChange={(event) =>
                    setInvestmentAmount(
                      Number(
                        event.target.value
                      )
                    )
                  }
                />

                <span>₴</span>

              </div>

            </div>


            <div className="investment-summary">

              <div>
                <span>
                  Процентна ставка
                </span>

                <strong>
                  {Number(
                    loan.interest_rate
                  )}%
                </strong>
              </div>

              <div>
                <span>
                  Термін
                </span>

                <strong>
                  {loan.term_days} днів
                </strong>
              </div>

              <div className="profit-row">
                <span>
                  Очікуваний прибуток
                </span>

                <strong>
                  +
                  {expectedProfit.toLocaleString(
                    "uk-UA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )} ₴
                </strong>
              </div>

              <div className="return-row">
                <span>
                  Очікуване повернення
                </span>

                <strong>
                  {(
                    investmentAmount +
                    expectedProfit
                  ).toLocaleString(
                    "uk-UA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )} ₴
                </strong>
              </div>

            </div>


            {error && (
              <p className="investment-error">
                {error}
              </p>
            )}

            {success && (
              <p className="investment-success">
                {success}
              </p>
            )}


            <button
              className="investment-button"
              onClick={handleInvest}
              disabled={
                investing ||
                remainingAmount <= 0 ||
                loan.status !== "OPEN"
              }
            >
              {investing
                ? "Інвестування..."
                : "Інвестувати"}
            </button>


            {loan.status !== "OPEN" && (
              <p className="investment-note">
                Ця заявка більше не доступна
                для інвестування.
              </p>
            )}

          </aside>
        )}


       

        {user?.role === "ADMIN" && (
          <aside className="investment-panel">

            <span className="investment-badge">
              РЕЖИМ АДМІНІСТРАТОРА
            </span>

            <h2>
              Перегляд заявки
            </h2>

            <p className="investment-subtitle">
              Адміністратор не може
              виконувати фінансові операції.
            </p>

            <div className="investment-summary">

              <div>
                <span>
                  Сума кредиту
                </span>

                <strong>
                  {amount.toLocaleString(
                    "uk-UA"
                  )} ₴
                </strong>
              </div>

              <div>
                <span>
                  Профінансовано
                </span>

                <strong>
                  {fundedAmount.toLocaleString(
                    "uk-UA"
                  )} ₴
                </strong>
              </div>

              <div>
                <span>
                  Ставка
                </span>

                <strong>
                  {Number(
                    loan.interest_rate
                  )}%
                </strong>
              </div>

              <div>
                <span>
                  Термін
                </span>

                <strong>
                  {loan.term_days} днів
                </strong>
              </div>

              <div>
                <span>
                  Статус
                </span>

                <strong>
                  {loan.status}
                </strong>
              </div>

            </div>

            <p className="investment-note">
              Фінансові дії для адміністратора
              вимкнені.
            </p>

          </aside>
        )}

      </section>
    </main>
  );
}

export default LoanDetailsPage;