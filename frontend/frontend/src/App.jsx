import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateElection from "./pages/CreateElection.jsx";
import ManageCandidates from "./pages/ManageCandidates.jsx";
import ElectionDetails from "./pages/ElectionDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-election" element={<CreateElection />} />
        <Route path="/admin/manage-candidates" element={<ManageCandidates />} />
        <Route path="/election/:id" element={<ElectionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
