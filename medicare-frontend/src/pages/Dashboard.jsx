import "../styles/dashboard.css";
import { logout } from "../utils/auth";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p>Welcome to MediCare System</p>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
