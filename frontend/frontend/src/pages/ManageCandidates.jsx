import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ManageCandidates = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]); // New state for candidates
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchElections = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/elections`, config);
      setElections(data);
      if (data.length > 0 && !selectedElection) setSelectedElection(data[0]._id);
    } catch (err) {
      console.error("Failed to fetch elections", err);
    }
  };

  const fetchCandidates = async (electionId) => {
    if (!electionId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/candidates/election/${electionId}`, config);
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [user.token]);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
    }
  }, [selectedElection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!selectedElection) {
      setError("Please select an election");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/candidates`,
        { name, department, manifesto, image, electionId: selectedElection },
        config
      );
      setSuccess("Candidate added successfully!");
      setName("");
      setDepartment("");
      setManifesto("");
      setImage("");
      fetchCandidates(selectedElection); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1100px' }}>
      <div className="glass-card" style={{ margin: 0, maxWidth: 'none' }}>
        <h2>Manage Candidates</h2>
        <h3>Add New Contender</h3>
        
        {error && <p className="text-error">{error}</p>}
        {success && <p style={{ color: "var(--success)", fontWeight: 600, textAlign: "center", marginBottom: "1rem" }}>{success}</p>}

        <form onSubmit={handleSubmit} className="form-group">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="election">Select Election</label>
            <select
              id="election"
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              required
            >
              {elections.length === 0 && <option value="">No elections available</option>}
              {elections.map((el) => (
                <option key={el._id} value={el._id}>{el.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="name">Candidate Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="dept">Department</label>
            <input
              id="dept"
              type="text"
              placeholder="e.g. Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="manifesto">Manifesto</label>
            <input
              id="manifesto"
              type="text"
              placeholder="Brief vision statement"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Candidate"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/dashboard" className="text-link">Back to Dashboard</Link>
        </div>
      </div>

      <div className="glass-card" style={{ margin: 0, maxWidth: 'none' }}>
        <h2>Current Candidates</h2>
        <h3>For Selected Election</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1.5rem' }}>
          {candidates.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No candidates added yet.</p>
          ) : (
            candidates.map((can) => (
              <div key={can._id} style={{ padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                <div style={{ fontWeight: 600 }}>{can.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{can.department}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>{can.manifesto}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;
