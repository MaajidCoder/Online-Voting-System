import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="glass-card">
      <h2>College Voting System</h2>
      <h3>Create Account</h3>
      {error && <p className="text-error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="role">Register as:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student (Voter)</option>
            <option value="admin">Admin (Organizer)</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Register Now
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link to="/login" className="text-link">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
