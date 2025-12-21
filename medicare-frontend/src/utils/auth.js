import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
