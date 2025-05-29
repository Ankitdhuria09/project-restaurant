// src/components/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./compcss/loginform.css"; // create this CSS file

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo">🍴</div>
        <h1>RestaurantPro</h1>
        <p>Sign in to your account</p>

        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />
        <button type="submit">Sign In</button>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <p>Admin: admin / admin123</p>
          <p>Staff: staff / staff123</p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
