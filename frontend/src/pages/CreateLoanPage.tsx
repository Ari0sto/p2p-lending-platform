import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createLoan,
  type CreateLoanData,
} from "../services/loanService";

import "./CreateLoanPage.css";

function CreateLoanPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateLoanData>({
    amount: 10000,
    interest_rate: 12,
    term_days: 30,
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "description"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      await createLoan(formData);

      navigate("/my-loans");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не вдалося створити кредитну заявку");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-loan-page">
      <section className="create-loan-wrapper">
        <div className="create-loan-info">
          <span className="loan-badge">
            ДЛЯ ПОЗИЧАЛЬНИКА
          </span>

          <h1>
            Створіть кредитну
            <br />
            <span>заявку</span>
          </h1>

          <p>
            Вкажіть суму, процентну ставку, строк та коротко опишіть,
            для чого вам потрібне фінансування.
          </p>

          <div className="loan-help-card">
            <h3>Як це працює?</h3>

            <p>
              Після створення заявка потрапить у маркетплейс.
              Інвестори зможуть профінансувати її частинами або повністю.
            </p>
          </div>
        </div>

        <div className="create-loan-card">
          <h2>Нова заявка</h2>

          <p className="create-loan-subtitle">
            Заповніть основні параметри кредиту
          </p>

          <form onSubmit={handleSubmit}>
            <div className="loan-form-group">
              <label htmlFor="amount">
                Сума кредиту
              </label>

              <div className="input-with-suffix">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

                <span>₴</span>
              </div>
            </div>

            <div className="loan-form-row">
              <div className="loan-form-group">
                <label htmlFor="interest_rate">
                  Процентна ставка
                </label>

                <div className="input-with-suffix">
                  <input
                    id="interest_rate"
                    name="interest_rate"
                    type="number"
                    min="1"
                    max="100"
                    step="0.1"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    required
                  />

                  <span>%</span>
                </div>
              </div>

              <div className="loan-form-group">
                <label htmlFor="term_days">
                  Термін
                </label>

                <div className="input-with-suffix">
                  <input
                    id="term_days"
                    name="term_days"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.term_days}
                    onChange={handleChange}
                    required
                  />

                  <span>днів</span>
                </div>
              </div>
            </div>

            <div className="loan-form-group">
              <label htmlFor="description">
                Опис заявки
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Наприклад: кошти потрібні на розвиток..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="loan-preview">
              <div>
                <span>Сума</span>
                <strong>
                  {Number(formData.amount).toLocaleString("uk-UA")} ₴
                </strong>
              </div>

              <div>
                <span>Ставка</span>
                <strong>
                  {formData.interest_rate}%
                </strong>
              </div>

              <div>
                <span>Термін</span>
                <strong>
                  {formData.term_days} днів
                </strong>
              </div>
            </div>

            {error && (
              <p className="loan-form-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="create-loan-button"
              disabled={loading}
            >
              {loading
                ? "Створення..."
                : "Створити заявку"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreateLoanPage;