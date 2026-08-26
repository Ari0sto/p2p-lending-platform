import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      login(response.access_token);

      // Після входу всі потрапляють на головну
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка входу");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вхід</h1>

        <p className="auth-subtitle">
          Увійдіть до свого акаунта
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Електронна пошта</label>

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>

            <input
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Вхід..." : "Увійти"}
          </button>

          <p className="auth-footer">
            Ще немає акаунта?{" "}
            <Link to="/register">
              Зареєструватися
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;