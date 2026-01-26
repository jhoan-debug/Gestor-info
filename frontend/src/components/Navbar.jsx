// src/components/Navbar.jsx
import React from "react";

// Navbar: componente lateral que muestra botones de navegación.
export default function Navbar({ page, onNavigate, onLogout }) {
  // Helper: genera un botón de navegación con estilo según la vista.
  const btn = (label, id) => (
    <button
      onClick={() => onNavigate(id)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 8,
        border: page === id ? "1px solid #FFD700" : "1px solid rgba(255,215,0,0.06)",
        background: page === id ? "#0b0b0b" : "transparent",
        color: "#FFD700",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <aside style={{ width: 220, padding: 20, background: "#060606", minHeight: "100vh" }}>
      <div style={{ color: "#FFD700", fontWeight: 700, marginBottom: 16 }} className="glow-gold">
        Mundo óptico
      </div>
      {btn("Inicio", "dashboard")}
      {btn("Clientes", "clientes")}
      {btn("Reportes", "reportes")}
      {btn("Configuración", "configuracion")}
      <div style={{ flex: 1 }} />
      <button
        onClick={onLogout}
        style={{
          marginTop: 18,
          padding: "8px 10px",
          width: "100%",
          borderRadius: 8,
          border: "1px solid rgba(255,215,0,0.08)",
          background: "transparent",
          color: "#FFD700",
        }}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
