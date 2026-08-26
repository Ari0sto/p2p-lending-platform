import { useEffect, useState } from "react";

import {
  getAdminUsers,
  getAdminLoans,
  getAdminInvestments,
  getAdminTransactions,
  type AdminUser,
  type AdminLoan,
  type AdminInvestment,
  type AdminTransaction,
} from "../services/adminService";

import "./AdminPage.css";

type AdminTab =
  | "users"
  | "loans"
  | "investments"
  | "transactions";

function AdminPage() {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("users");

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loans, setLoans] =
    useState<AdminLoan[]>([]);

  const [investments, setInvestments] =
    useState<AdminInvestment[]>([]);

  const [transactions, setTransactions] =
    useState<AdminTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          usersData,
          loansData,
          investmentsData,
          transactionsData,
        ] = await Promise.all([
          getAdminUsers(),
          getAdminLoans(),
          getAdminInvestments(),
          getAdminTransactions(),
        ]);

        setUsers(usersData);
        setLoans(loansData);
        setInvestments(investmentsData);
        setTransactions(transactionsData);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Не вдалося завантажити дані адмін-панелі"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const getUserEmailById = (
    userId?: number
  ) => {
    if (userId === undefined) {
      return "—";
    }

    const foundUser = users.find(
      (user) => user.id === userId
    );

    return foundUser?.email ?? `#${userId}`;
  };

  const getTransactionLabel = (
    type: string
  ) => {
    switch (type) {
      case "DEPOSIT":
        return "Поповнення";

      case "INVESTMENT":
        return "Інвестиція";

      case "LOAN_RECEIVED":
        return "Отримання кредиту";

      case "LOAN_REPAYMENT":
      case "REPAYMENT":
        return "Погашення кредиту";

      case "INVESTMENT_RETURN":
        return "Повернення інвестиції";

      case "PROFIT":
        return "Прибуток";

      default:
        return type;
    }
  };

  const getBorrowerEmail = (
    loan: AdminLoan
  ) => {
    const item = loan as AdminLoan & {
      borrower_email?: string;
      borrower_id?: number;
    };

    if (item.borrower_email) {
      return item.borrower_email;
    }

    return getUserEmailById(
      item.borrower_id
    );
  };

  const getInvestorEmail = (
    investment: AdminInvestment
  ) => {
    const item =
      investment as AdminInvestment & {
        investor_email?: string;
        investor_id?: number;
      };

    if (item.investor_email) {
      return item.investor_email;
    }

    return getUserEmailById(
      item.investor_id
    );
  };

  const getTransactionUserEmail = (
    transaction: AdminTransaction
  ) => {
    const item =
      transaction as AdminTransaction & {
        user_email?: string;
        user_id?: number;
      };

    if (item.user_email) {
      return item.user_email;
    }

    return getUserEmailById(
      item.user_id
    );
  };

  if (loading) {
    return (
      <main className="admin-page">
        <p className="admin-message">
          Завантаження адмін-панелі...
        </p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-wrapper">


        <div className="admin-header">
          <div>
            <span className="admin-badge">
              ADMIN
            </span>

            <h1>
              Адмін-панель
            </h1>

            <p>
              Перегляд користувачів,
              кредитів, інвестицій та
              фінансових операцій платформи.
            </p>
          </div>

          <div className="admin-summary">

            <div>
              <span>
                Користувачів
              </span>

              <strong>
                {users.length}
              </strong>
            </div>

            <div>
              <span>
                Кредитів
              </span>

              <strong>
                {loans.length}
              </strong>
            </div>

            <div>
              <span>
                Інвестицій
              </span>

              <strong>
                {investments.length}
              </strong>
            </div>

            <div>
              <span>
                Транзакцій
              </span>

              <strong>
                {transactions.length}
              </strong>
            </div>

          </div>
        </div>


        /* ERROR */

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}


        {/* TABS */}

        <div className="admin-tabs">

          <button
            className={
              activeTab === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("users")
            }
          >
            Користувачі
          </button>

          <button
            className={
              activeTab === "loans"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("loans")
            }
          >
            Кредити
          </button>

          <button
            className={
              activeTab === "investments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "investments"
              )
            }
          >
            Інвестиції
          </button>

          <button
            className={
              activeTab === "transactions"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "transactions"
              )
            }
          >
            Транзакції
          </button>

        </div>


        <section className="admin-content">

          /* USERS */

          {activeTab === "users" && (
            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Баланс</th>
                    <th>
                      Credit Score
                    </th>
                    <th>
                      Створено
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (
                    <tr key={user.id}>

                      <td>
                        #{user.id}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span className="admin-role">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {Number(
                          user.balance
                        ).toLocaleString(
                          "uk-UA",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        ₴
                      </td>

                      <td>
                        {user.credit_score}
                      </td>

                      <td>
                        {new Date(
                          user.created_at
                        ).toLocaleString(
                          "uk-UA"
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}


          /* LOANS */

          {activeTab === "loans" && (
            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>

                    <th>
                      Позичальник
                    </th>

                    <th>
                      Сума
                    </th>

                    <th>
                      Профінансовано
                    </th>

                    <th>
                      Ставка
                    </th>

                    <th>
                      Термін
                    </th>

                    <th>
                      Статус
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {loans.map((loan) => (
                    <tr key={loan.id}>

                      <td>
                        #{loan.id}
                      </td>

                      <td>
                        {getBorrowerEmail(
                          loan
                        )}
                      </td>

                      <td>
                        {Number(
                          loan.amount
                        ).toLocaleString(
                          "uk-UA"
                        )}{" "}
                        ₴
                      </td>

                      <td>
                        {Number(
                          loan.funded_amount
                        ).toLocaleString(
                          "uk-UA"
                        )}{" "}
                        ₴
                      </td>

                      <td>
                        {loan.interest_rate}%
                      </td>

                      <td>
                        {loan.term_days}{" "}
                        днів
                      </td>

                      <td>
                        <span className="admin-status">
                          {loan.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}


          /* INVESTMENTS */

          {activeTab === "investments" && (
            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>

                    <th>
                      Інвестор
                    </th>

                    <th>
                      Кредит
                    </th>

                    <th>
                      Сума
                    </th>

                    <th>
                      Створено
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {investments.map(
                    (investment) => (
                      <tr
                        key={
                          investment.id
                        }
                      >

                        <td>
                          #
                          {investment.id}
                        </td>

                        <td>
                          {getInvestorEmail(
                            investment
                          )}
                        </td>

                        <td>
                          #
                          {
                            investment.loan_id
                          }
                        </td>

                        <td>
                          {Number(
                            investment.amount
                          ).toLocaleString(
                            "uk-UA"
                          )}{" "}
                          ₴
                        </td>

                        <td>
                          {new Date(
                            investment.created_at
                          ).toLocaleString(
                            "uk-UA"
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}


          /* TRANSACTIONS */

          {activeTab ===
            "transactions" && (
            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>

                    <th>
                      Користувач
                    </th>

                    <th>
                      Тип
                    </th>

                    <th>
                      Сума
                    </th>

                    <th>
                      Дата
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={
                          transaction.id
                        }
                      >

                        <td>
                          #
                          {transaction.id}
                        </td>

                        <td>
                          {getTransactionUserEmail(
                            transaction
                          )}
                        </td>

                        <td>
                          {getTransactionLabel(
                            transaction.type
                          )}
                        </td>

                        <td>
                          {Number(
                            transaction.amount
                          ).toLocaleString(
                            "uk-UA",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          ₴
                        </td>

                        <td>
                          {new Date(
                            transaction.created_at
                          ).toLocaleString(
                            "uk-UA"
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminPage;