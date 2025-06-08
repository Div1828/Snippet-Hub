
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/auth";

export const registerUser = async (data: { username: string; password: string }) => {
  try {
    const res = await axios.post(`${API}/register`, data);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Registration failed";
  }
};

export const loginUser = async (data: { username: string; password: string }) => {
  try {
    const res = await axios.post(`${API}/login`, data);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return { token, user: { username: res.data.username } };
  } catch (err: any) {
    throw err.response?.data?.message || "Login failed";
  }
};

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
