import React, { createContext, useState, useEffect } from 'react';

// Contexto simple de autenticación.
// NOTAS IMPORTANTES:
// - Actualmente guarda un flag en localStorage para persistencia mínima.
// - Para producción, usar tokens JWT y almacenarlos de forma segura (ej. httpOnly cookies o secure storage).
// - `useAuth` hook (en `hooks/useAuth.js`) probablemente consume este contexto.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay una sesión guardada (ej. en localStorage)
    // Esto es intencionalmente simple; actualiza según tu estrategia de autenticación.
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handler de login: marca sesión como iniciada
  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  // Handler de logout: elimina la sesión localmente
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};