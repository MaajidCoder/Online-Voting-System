import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Register the user
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      // Auto-login after successful registration
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
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>College Voting System</h2>
      <h3>Student Registration</h3>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
