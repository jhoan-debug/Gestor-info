import React, { useState } from "react";
import PageTransition from "./PageTransition.jsx";
import { FaUser, FaLock } from "react-icons/fa"; // Íconos para usuario y contraseña (opcional)

// Componente Login: formulario de acceso (credenciales demo).
export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario === "admin" && clave === "1234") {
      onLogin();
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Fondo animado sutil (opcional) */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.1)_0%,_transparent_70%)]"></div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md p-8 bg-gray-900 border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 backdrop-blur-sm animate-fade-in-up"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center drop-shadow-lg">
            Acceso al Gestor
          </h2>

          {/* Campo Usuario */}
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-yellow-400 border border-yellow-500/30 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 placeholder-yellow-600"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-yellow-400 border border-yellow-500/30 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 placeholder-yellow-600"
            />
          </div>

          {error && (
            <div className="text-red-400 mb-4 text-center bg-red-900/20 p-2 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105"
          >
            Entrar
          </button>

          <div className="mt-4 text-xs text-yellow-600 text-center">
            Sistema de Gestión Óptica
          </div>
        </form>
      </div>
    </PageTransition>
  );
}