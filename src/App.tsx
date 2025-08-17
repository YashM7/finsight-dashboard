import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./components/UserProfile/UserProfiles";
import Blank from "./pages/OtherPage/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AddIncome from "./pages/Add Income/AddIncome";
import AddExpense from "./pages/Add Expense/AddExpense";
import Transactions from "./pages/Transactions/Transactions";
import AIchat from "./pages/AI Chat/AIchat";
import Report from "./pages/Report/Report";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route index path="/add-income" element={<AddIncome />} />
            <Route index path="/add-expense" element={<AddExpense />} />
            <Route index path="/transactions" element={<Transactions />} />
            <Route index path="/AI-chatbot" element={<AIchat />} />
            <Route index path="/report" element={<Report />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />
            
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
