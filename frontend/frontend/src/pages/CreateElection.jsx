import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CreateElection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/elections`,
        { title, description, startTime, endTime, isActive: true },
        config
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2>Create New Election</h2>
      <h3>Election Details</h3>
      {error && <p className="text-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="form-group">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="title">Election Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Student Council 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Briefly describe the election"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Launch Election"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/dashboard" className="text-link">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default CreateElection;
