import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import DashboardPage from "./pages/DashboardPage";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { LogOut, Utensils, ShoppingCart, BarChart3 } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';
import './pages/css/app.css';

function App() {
  const { user, logout } = useAuth();

  if (!user) return <LoginForm />;

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed h-8 w-8" data-lov-id="src/components/Header.tsx:14:12" data-lov-name="UtensilsCrossed" data-component-path="src/components/Header.tsx" data-component-line="14" data-component-file="Header.tsx" data-component-name="UtensilsCrossed" data-component-content="%7B%22className%22%3A%22h-8%20w-8%22%7D"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path><path d="m2.1 21.8 6.4-6.3"></path><path d="m19 5-7 7"></path></svg>
            <h1>RestaurantPro</h1>
          </div>
          <div className="header-user">
            <span>Hi, <strong>{user.username} ({user.role})</strong></span>
            <button onClick={logout} className="logout-button">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <nav className="nav">
          <Link to="/">
            <Utensils size={18} /> Menu
          </Link>
          <Link to="/order">
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link to="/dashboard">
            <BarChart3 size={18} /> Analytics
          </Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
