import { logout } from "../utils/auth";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
