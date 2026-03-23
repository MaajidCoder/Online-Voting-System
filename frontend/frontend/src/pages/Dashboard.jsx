import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchElections = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/elections`,
          config,
        );
        setElections(data);
      } catch (error) {
        console.error("Error fetching elections", error);
      }
    };

    fetchElections();
  }, [user, navigate]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/elections/${id}`,
        { isActive: !currentStatus },
        config
      );
      // Refresh list
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections`,
        config
      );
      setElections(data);
    } catch (error) {
      console.error("Error toggling status", error);
      alert("Failed to update election status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p style={{ color: "var(--text-muted)" }}>{user?.role === 'admin' ? 'Administrator' : 'Student Voter'}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {user?.role === "admin" && (
        <section className="admin-panel">
          <h3>Admin Dashboard</h3>
          <p style={{ marginBottom: "15px" }}>You have administrative privileges to manage elections and candidates.</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              className="btn-primary" 
              style={{ padding: "10px 20px" }}
              onClick={() => navigate("/admin/create-election")}
            >
              Create New Election
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: "10px 20px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid var(--glass-border)" }}
              onClick={() => navigate("/admin/manage-candidates")}
            >
              Manage Candidates
            </button>
          </div>
        </section>
      )}

      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Active Elections</h3>
        <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>{elections.length} Total</span>
      </div>

      {elections.length === 0 ? (
        <div className="election-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No elections are currently active.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {elections.map((election) => (
            <div key={election._id} className="election-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{election.title}</h4>
                <span className={`status-badge ${election.isActive ? 'status-open' : 'status-closed'}`}>
                  {election.isActive ? "Open" : "Closed"}
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem", minHeight: '3rem' }}>
                {election.description}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 2, padding: '10px' }}
                  onClick={() => navigate(`/election/${election._id}`)}
                >
                  {election.isActive && user?.role !== 'admin' ? "View Candidates" : "View Results"}
                </button>
                {user?.role === 'admin' && (
                  <button
                   onClick={() => handleToggleStatus(election._id, election.isActive)}
                   className="logout-btn"
                   style={{ 
                     flex: 1, 
                     padding: '10px', 
                     background: election.isActive ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 200, 83, 0.1)',
                     color: election.isActive ? '#ff4444' : '#00c853',
                     borderColor: election.isActive ? '#ff4444' : '#00c853',
                     fontSize: '0.8rem'
                   }}
                  >
                    {election.isActive ? "Close" : "Open"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
