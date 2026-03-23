import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if unauthenticated
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h2>Welcome, {user?.name}</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
            background: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}>
          Logout
        </button>
      </div>
      <hr style={{ margin: "20px 0" }} />

      <h3>Active Elections</h3>
      {elections.length === 0 ? (
        <p>No elections are currently active.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {elections.map((election) => (
            <div
              key={election._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}>
              <h4>{election.title}</h4>
              <p>{election.description}</p>
              <p>
                <strong>Status:</strong>{" "}
                {election.isActive ? "🟢 Open for voting" : "🔴 Closed"}
              </p>
              <button
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                disabled={!election.isActive}>
                {election.isActive ? "View Candidates" : "View Results"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
