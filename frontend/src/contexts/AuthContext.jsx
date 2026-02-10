import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data?.user || res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      setUser(res.data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Register failed" };
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
