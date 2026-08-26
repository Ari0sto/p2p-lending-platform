import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  registerUser,
  type RegisterRole,
} from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] =
    useState<RegisterRole>("INVESTOR");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        email,
        password,
        role,
      });

      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка реєстрації");
      }
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="auth-page">
    <div className="auth-card">
      <h1>Створити акаунт</h1>

      <p className="auth-subtitle">
        Зареєструйтеся на P2P-платформі
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Електронна пошта</label>

          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Пароль</label>

          <input
            type="password"
            placeholder="Введіть пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Підтвердіть пароль</label>

          <input
            type="password"
            placeholder="Повторіть пароль"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Хто ви?</label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as RegisterRole)
            }
          >
            <option value="INVESTOR">Інвестор</option>
            <option value="BORROWER">Позичальник</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          className="auth-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Реєстрація..." : "Зареєструватися"}
        </button>

        <p className="auth-footer">
          Вже маєте акаунт?{" "}
          <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default RegisterPage;