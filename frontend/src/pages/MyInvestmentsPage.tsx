import { useEffect, useMemo, useState } from "react";

import {
  getMyInvestments,
  type Investment,
} from "../services/investmentService";

import {
  getLoanById,
  type Loan,
} from "../services/loanService";

import "./MyInvestmentsPage.css";

interface InvestmentWithLoan extends Investment {
  loan?: Loan;
}

function MyInvestmentsPage() {
  const [investments, setInvestments] =
    useState<InvestmentWithLoan[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Отримуємо інвестиції користувача
        const data = await getMyInvestments();

        
        const investmentsWithLoans =
          await Promise.all(
            data.map(async (investment) => {
              try {
                const loan = await getLoanById(
                  investment.loan_id
                );

                return {
                  ...investment,
                  loan,
                };
              } catch {
                return {
                  ...investment,
                  loan: undefined,
                };
              }
            })
          );

        setInvestments(investmentsWithLoans);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Не вдалося завантажити інвестиції"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadInvestments();
  }, []);

  const calculateProfit = (
    investment: InvestmentWithLoan
  ) => {
    if (!investment.loan) {
      return 0;
    }

    const amount = Number(investment.amount);

    const rate = Number(
      investment.loan.interest_rate
    );

    const days = Number(
      investment.loan.term_days
    );

    return (
      amount *
      (rate / 100) *
      (days / 365)
    );
  };

  const totalInvested = useMemo(() => {
    return investments.reduce(
      (sum, investment) =>
        sum + Number(investment.amount),
      0
    );
  }, [investments]);

  const totalExpectedProfit = useMemo(() => {
    return investments.reduce(
      (sum, investment) =>
        sum + calculateProfit(investment),
      0
    );
  }, [investments]);

  return (
    <main className="my-investments-page">

      <div className="my-investments-header">
        <div>
          <span className="investments-badge">
            ІНВЕСТОР
          </span>

          <h1>Мої інвестиції</h1>

          <p>
            Переглядайте свої вкладення та
            очікуваний прибуток.
          </p>
        </div>

        <div className="investment-summary-cards">

          <div>
            <span>
              Всього інвестовано
            </span>

            <strong>
              {totalInvested.toLocaleString(
                "uk-UA"
              )}{" "}
              ₴
            </strong>
          </div>

          <div>
            <span>
              Очікуваний прибуток
            </span>

            <strong className="profit-value">
              +
              {totalExpectedProfit.toLocaleString(
                "uk-UA",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{" "}
              ₴
            </strong>
          </div>

        </div>
      </div>

      {loading && (
        <p className="investments-message">
          Завантаження інвестицій...
        </p>
      )}

      {error && (
        <p className="investments-error">
          {error}
        </p>
      )}

      {!loading &&
        investments.length === 0 && (
          <div className="investments-empty">
            <h2>
              У вас ще немає інвестицій
            </h2>

            <p>
              Перейдіть у маркетплейс та
              оберіть кредитну заявку для
              інвестування.
            </p>
          </div>
        )}

      {!loading &&
        investments.length > 0 && (
          <div className="investments-grid">

            {investments.map(
              (investment) => {
                const amount = Number(
                  investment.amount
                );

                const profit =
                  calculateProfit(
                    investment
                  );

                const expectedReturn =
                  amount + profit;

                return (
                  <article
                    className="investment-card"
                    key={investment.id}
                  >

                    <div className="investment-card-top">
                      <span>
                        Інвестиція #
                        {investment.id}
                      </span>

                      <span className="investment-loan">
                        Кредит #
                        {investment.loan_id}
                      </span>
                    </div>

                    <h2>
                      {amount.toLocaleString(
                        "uk-UA"
                      )}{" "}
                      ₴
                    </h2>

                    <div className="investment-data">

                      <div>
                        <span>
                          Вкладено
                        </span>

                        <strong>
                          {amount.toLocaleString(
                            "uk-UA"
                          )}{" "}
                          ₴
                        </strong>
                      </div>

                      {investment.loan && (
                        <>
                          <div>
                            <span>
                              Ставка
                            </span>

                            <strong>
                              {
                                investment
                                  .loan
                                  .interest_rate
                              }
                              %
                            </strong>
                          </div>

                          <div>
                            <span>
                              Термін
                            </span>

                            <strong>
                              {
                                investment
                                  .loan
                                  .term_days
                              }{" "}
                              днів
                            </strong>
                          </div>
                        </>
                      )}

                      <div>
                        <span>
                          Очікуваний
                          прибуток
                        </span>

                        <strong className="investment-profit">
                          +
                          {profit.toLocaleString(
                            "uk-UA",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          ₴
                        </strong>
                      </div>

                      <div>
                        <span>
                          Очікуване
                          повернення
                        </span>

                        <strong>
                          {expectedReturn.toLocaleString(
                            "uk-UA",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          ₴
                        </strong>
                      </div>

                    </div>

                    {investment.created_at && (
                      <p className="investment-date">
                        Створено:{" "}
                        {new Date(
                          investment.created_at
                        ).toLocaleString(
                          "uk-UA"
                        )}
                      </p>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}
    </main>
  );
}

export default MyInvestmentsPage;