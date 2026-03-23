import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="glass-card">
      <h2>College Voting System</h2>
      <h3>Login</h3>
      {error && <p className="text-error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)" }}>
        Don't have an account?{" "}
        <Link to="/register" className="text-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
