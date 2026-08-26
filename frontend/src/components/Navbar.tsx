import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/marketplace");
  };

  return (
    <header className="navbar">

      <Link
  to="/"
  className="navbar-logo"
>
  Головна
</Link>

      <nav className="navbar-links">

        <Link to="/marketplace">
          Маркетплейс
        </Link>

        {/* ПОЗИЧАЛЬНИК */}
        {user?.role === "BORROWER" && (
          <>
            <Link to="/create-loan">
              Створити заявку
            </Link>

            <Link to="/my-loans">
              Мої кредити
            </Link>
          </>
        )}

        {/* ІНВЕСТОР */}
        {user?.role === "INVESTOR" && (
          <Link to="/my-investments">
            Мої інвестиції
          </Link>
        )}

        {/* АДМІН */}
        {user?.role === "ADMIN" && (
          <Link to="/admin">
            Адмін-панель
          </Link>
        )}

        {/*  ДЛЯ АВТОРИЗОВАНИХ */}
        {user && user.role !== "ADMIN" && (
  <Link to="/balance">
    Баланс
  </Link>
)}

{user && user.role !== "ADMIN" && (
  <Link to="/transactions">
    Історія
  </Link>
)}

      </nav>

      <div className="navbar-auth">

        {!user ? (
          <>
            <Link to="/login">
              Увійти
            </Link>

            <Link to="/register">
              Реєстрація
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              {user.email}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Вийти
            </button>
          </>
        )}

      </div>

    </header>
  );
}

export default Navbar;