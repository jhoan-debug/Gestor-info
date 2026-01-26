import { useState, useEffect, useRef } from 'react';

export function useAuth() {
  const [token, setToken] = useState(null);
  const timeoutRef = useRef(null); // Referencia para el temporizador
  const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos (ajusta si quieres menos, ej. 10 minutos)

  // Función para resetear el temporizador
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout(); // Cierra sesión automáticamente
    }, INACTIVITY_TIME);
  };

  // Función para detectar actividad
  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Verifica token inicial
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      resetTimer(); // Inicia el temporizador al cargar
    }

    // Agrega event listeners para actividad
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Limpia event listeners y temporizador al desmontar
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const login = (newToken = 'demo-token') => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    resetTimer(); // Inicia temporizador al loguear
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return { token, login, logout };
}