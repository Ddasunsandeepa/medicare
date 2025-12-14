import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" onChange={handleChange} /><br/>
        <input name="email" placeholder="Email" onChange={handleChange} /><br/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br/>

        <select name="role" onChange={handleChange}>
          <option value="PATIENT">Patient</option>
          <option value="STAFF">Staff</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select><br/>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
