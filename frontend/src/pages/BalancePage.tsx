import { useEffect, useState } from "react";

import {
  depositBalance,
  getMe,
  type CurrentUser,
} from "../services/userService";

import "./BalancePage.css";

function BalancePage() {
  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [amount, setAmount] = useState(1000);

  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMe();

      setUser(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Не вдалося отримати дані користувача"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleDeposit = async () => {
    setError("");
    setSuccess("");

    if (amount <= 0) {
      setError(
        "Сума поповнення повинна бути більшою за 0"
      );
      return;
    }

    try {
      setDepositing(true);

      const updatedUser =
        await depositBalance(amount);

      setUser(updatedUser);

      setSuccess(
        `Баланс успішно поповнено на ${amount.toLocaleString(
          "uk-UA"
        )} ₴`
      );

      setAmount(1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Не вдалося поповнити баланс"
        );
      }
    } finally {
      setDepositing(false);
    }
  };

  if (loading) {
    return (
      <main className="balance-page">
        <p className="balance-message">
          Завантаження...
        </p>
      </main>
    );
  }

  return (
    <main className="balance-page">
      <section className="balance-wrapper">
        <div className="balance-info">
          <span className="balance-badge">
            ФІНАНСОВИЙ РАХУНОК
          </span>

          <h1>
            Ваш <span>баланс</span>
          </h1>

          <p>
            Поповнюйте баланс для інвестування,
            погашення кредитів та інших фінансових операцій.
          </p>
        </div>

        <div className="balance-card">
          <span className="balance-label">
            Поточний баланс
          </span>

          <div className="balance-value">
            {Number(user?.balance ?? 0).toLocaleString(
              "uk-UA",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}{" "}
            ₴
          </div>

          <div className="balance-user-info">
            <div>
              <span>Користувач</span>
              <strong>{user?.email}</strong>
            </div>

            <div>
              <span>Роль</span>
              <strong>{user?.role}</strong>
            </div>

            {user?.role === "BORROWER" && (
              <div>
                <span>Credit Score</span>
                <strong>{user.credit_score}</strong>
              </div>
            )}
          </div>

          <div className="deposit-section">
            <label>
              Сума поповнення
            </label>

            <div className="deposit-input">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    Number(event.target.value)
                  )
                }
              />

              <span>₴</span>
            </div>

            <div className="quick-deposit-buttons">
              <button
                type="button"
                onClick={() => setAmount(1000)}
              >
                +1 000 ₴
              </button>

              <button
                type="button"
                onClick={() => setAmount(5000)}
              >
                +5 000 ₴
              </button>

              <button
                type="button"
                onClick={() => setAmount(10000)}
              >
                +10 000 ₴
              </button>
            </div>

            {error && (
              <p className="balance-error">
                {error}
              </p>
            )}

            {success && (
              <p className="balance-success">
                {success}
              </p>
            )}

            <button
              className="deposit-button"
              onClick={handleDeposit}
              disabled={depositing}
            >
              {depositing
                ? "Поповнення..."
                : "Поповнити баланс"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BalancePage;