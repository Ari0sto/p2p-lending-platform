import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MarketplacePage from "./pages/MarketplacePage";
import LoanDetailsPage from "./pages/LoanDetailsPage";
import CreateLoanPage from "./pages/CreateLoanPage";
import MyLoansPage from "./pages/MyLoansPage";
import MyInvestmentsPage from "./pages/MyInvestmentsPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import BalancePage from "./pages/BalancePage";
import AdminPage from "./pages/AdminPage";

import headerImage from "./assets/images/heder.png";

function AppContent() {
  const location = useLocation();

  const isMainPage =
    location.pathname === "/";

  return (
    <>
      {isMainPage && (
        <section className="global-header-image">
          <img
            src={headerImage}
            alt="P2P платформа"
          />
        </section>
      )}

      <Navbar />

      <Routes>

        /* PUBLIC */

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        /* MARKETPLACE INVESTOR + ADMIN */

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INVESTOR",
                "ADMIN",
              ]}
            >
              <MarketplacePage />
            </ProtectedRoute>
          }
        />


        /* LOAN DETAILS INVESTOR + ADMIN */

        <Route
          path="/loans/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INVESTOR",
                "ADMIN",
              ]}
            >
              <LoanDetailsPage />
            </ProtectedRoute>
          }
        />


        /* BORROWER */

        <Route
          path="/create-loan"
          element={
            <ProtectedRoute
              allowedRoles={[
                "BORROWER",
              ]}
            >
              <CreateLoanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-loans"
          element={
            <ProtectedRoute
              allowedRoles={[
                "BORROWER",
              ]}
            >
              <MyLoansPage />
            </ProtectedRoute>
          }
        />


        /* INVESTOR */

        <Route
          path="/my-investments"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INVESTOR",
              ]}
            >
              <MyInvestmentsPage />
            </ProtectedRoute>
          }
        />


        /* BALANCE INVESTOR + BORROWER */

        <Route
          path="/balance"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INVESTOR",
                "BORROWER",
              ]}
            >
              <BalancePage />
            </ProtectedRoute>
          }
        />


        /* TRANSACTIONS INVESTOR + BORROWER */

        <Route
          path="/transactions"
          element={
            <ProtectedRoute
              allowedRoles={[
                "INVESTOR",
                "BORROWER",
              ]}
            >
              <TransactionHistoryPage />
            </ProtectedRoute>
          }
        />


        /* ADMIN */

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
              ]}
            >
              <AdminPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;