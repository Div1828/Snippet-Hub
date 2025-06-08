import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { loginUser } from "./auth";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axiosInstance.get("/auth/me");
          setUser(res.data.username);
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
      }
      setLoading(false); 
    };

    checkAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    const { token, user } = await loginUser({ username, password });
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user.username);
  };

  const register = async (username: string, password: string) => {
    await axiosInstance.post("/auth/register", { username, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export { axiosInstance };
