import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ElectionDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch election data
        const { data: electionData } = await axios.get(
          `${import.meta.env.VITE_API_URL}/elections/${id}`,
          config
        );
        setElection(electionData);

        // Fetch results if not active or if admin
        if (!electionData.isActive || user.role === 'admin') {
          const { data: resultsData } = await axios.get(
            `${import.meta.env.VITE_API_URL}/votes/results/${id}`,
            config
          );
          setResults(resultsData.results || []);
        }

        // Check if user has already voted
        if (user.role === 'student') {
          const { data: statusData } = await axios.get(
            `${import.meta.env.VITE_API_URL}/votes/status/${id}`,
            config
          );
          setVoted(statusData.voted);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load election details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user.token]);

  const handleVote = async (candidateId) => {
    if (!window.confirm("Are you sure you want to cast your vote for this candidate? This action cannot be undone.")) return;
    
    setVoteLoading(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
          `${import.meta.env.VITE_API_URL}/votes`,
          { electionId: id, candidateId },
          config
      );
      setVoted(true);
      alert("Vote cast successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Voting failed");
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) return <div className="glass-card"><p>Loading election details...</p></div>;
  if (error) return <div className="glass-card"><h2 className="text-error">Error</h2><p>{error}</p><Link to="/dashboard" className="text-link">Back to Dashboard</Link></div>;
  if (!election) return <div className="glass-card"><p>Election not found.</p></div>;

  return (
    <div className="dashboard-container" style={{ maxWidth: '900px' }}>
      <header className="dashboard-header">
        <div>
          <h2>{election.title}</h2>
          <span className={`status-badge ${election.isActive ? 'status-open' : 'status-closed'}`}>
            {election.isActive ? "Active Election" : "Election Closed"}
          </span>
        </div>
        <Link to="/dashboard" className="logout-btn" style={{ textDecoration: 'none', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)' }}>
          Back
        </Link>
      </header>

      <div className="election-card" style={{ marginBottom: '2rem' }}>
        <h3>Description</h3>
        <p style={{ color: 'var(--text-muted)' }}>{election.description}</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Starts</label>
            <span>{new Date(election.startTime).toLocaleString()}</span>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Ends</label>
            <span>{new Date(election.endTime).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {election.isActive && user.role !== 'admin' ? (
        <section>
          <div className="section-title">
            <h3>Candidates</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Select a candidate to cast your vote. You can only vote once per election.
            </p>
          </div>
          {!election.candidates || election.candidates.length === 0 ? (
            <div className="election-card" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No candidates have been added to this election yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {election.candidates.map((candidate) => (
                <div key={candidate._id} className="election-card" style={{ border: '1px solid var(--glass-border)' }}>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{candidate.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {candidate.department}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                     "{candidate.manifesto}"
                  </p>
                  {user.role === 'student' && !voted && (
                    <button 
                      onClick={() => handleVote(candidate._id)}
                      className="btn-primary" 
                      style={{ width: '100%' }}
                      disabled={voteLoading}
                    >
                      {voteLoading ? "Voting..." : "Cast Vote"}
                    </button>
                  )}
                  {voted && <p style={{ color: 'var(--success)', textAlign: 'center', fontWeight: 600 }}>Voted ✓</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="admin-panel" style={{ background: 'var(--card-bg)' }}>
          <h3>{election.isActive ? 'Live Results' : 'Final Results'}</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {!results || results.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No votes were cast in this election.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map((res, index) => {
                  const totalVotes = results.reduce((sum, r) => sum + (r.votes || 0), 0);
                  const percentage = totalVotes > 0 ? (((res.votes || 0) / totalVotes) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={res._id || index} style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>{res.name || 'Unknown Candidate'}</span>
                        <span style={{ color: 'var(--primary)' }}>{res.votes || 0} Votes ({percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ElectionDetails;
