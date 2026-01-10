import "../styles/dashboard.css";
import { logout, getUserRole } from "../utils/auth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const role = getUserRole();

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p>
          Welcome! Your role: <b>{role}</b>
        </p>

        {/* SUPER ADMIN MENU */}
        {role === "SUPER_ADMIN" && (
          <div className="menu-block">
            <h4>Super Admin Menu</h4>
            <Link to="/create-user">Create Any User</Link>
          </div>
        )}

        {/* ADMIN MENU */}
        {role === "ADMIN" && (
          <div className="menu-block">
            <h4>Admin Menu</h4>
            <Link to="/create-user">Create Staff / Doctor</Link>
            <br />
            <Link to="/billing">View Billing</Link>
          </div>
        )}

        {/* STAFF MENU */}
        {role === "STAFF" && (
          <div className="menu-block">
            <h4>Staff Menu</h4>
            <Link to="/patients">Manage Patients</Link>
            <br />
            <Link to="/appointments">Book Appointments</Link>
            <br />
            <Link to="/billing">Billing & Payments</Link>
          </div>
        )}

        {/* DOCTOR MENU */}
        {role === "DOCTOR" && (
          <div className="menu-block">
            <h4>Doctor Menu</h4>
            <Link to="/availability">Manage Availability</Link>
            <Link to="/my-appointments">My Appointments</Link>
          </div>
        )}

        <br />
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
