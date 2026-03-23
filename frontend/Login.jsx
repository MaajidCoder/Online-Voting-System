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
      navigate("/dashboard"); // We'll build the dashboard next!
    } catch (err) {
      // Check if it's an express-validator array of errors or a standard backend message
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>College Voting System</h2>
      <h3>Login</h3>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
