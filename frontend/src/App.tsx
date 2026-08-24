import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MarketplacePage from "./pages/MarketplacePage";
import LoanDetailsPage from "./pages/LoanDetailsPage";
import CreateLoanPage from "./pages/CreateLoanPage";
import MyLoansPage from "./pages/MyLoansPage";
import MyInvestmentsPage from "./pages/MyInvestmentsPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import Navbar from "./components/Navbar"; 
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<MarketplacePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/loans/:id" element={<LoanDetailsPage />} />

        <Route path="/create-loan" element={<CreateLoanPage />} />
        <Route path="/my-loans" element={<MyLoansPage />} />
        <Route path="/my-investments" element={<MyInvestmentsPage />} />

        <Route
          path="/transactions"
          element={<TransactionHistoryPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;