// src/hooks/useAuth.js
import { useState, useEffect } from "react";

const KEY = "gestor_token_demo";

export function useAuth() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem(KEY);
    if (t) setToken(t);
  }, []);

  const login = (payload) => {
    // demo: payload can be a token or user info
    localStorage.setItem(KEY, payload);
    setToken(payload);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setToken(null);
  };

  return { token, login, logout };
}
