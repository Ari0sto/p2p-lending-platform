import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/marketplace">Головна</Link>
      </div>

      <nav className="navbar-links">
        <Link to="/marketplace">Маркетплейс</Link>
        <Link to="/create-loan">Створити заявку</Link>
        <Link to="/my-loans">Мої кредити</Link>
        <Link to="/my-investments">Мої інвестиції</Link>
        <Link to="/transactions">Історія</Link>
      </nav>

      <div className="navbar-auth">
        <Link to="/login">Увійти</Link>
        <Link to="/register">Реєстрація</Link>
      </div>
    </header>
  );
}

export default Navbar;