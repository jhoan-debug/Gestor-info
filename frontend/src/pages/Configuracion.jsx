// src/pages/Configuracion.jsx
import React from "react";

export default function Configuracion() {
  return (
    <div>
      <h2 style={{ color: "#FFD700" }}>Configuración</h2>
      <div style={{ marginTop: 12, background: "#070707", padding: 12, borderRadius: 8 }}>
        <p style={{ color: "#c9b24a" }}>Opciones (placeholders): exportar CSV/PDF, conectar Supabase, notificaciones.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => alert("Exportar CSV - pendiente")} style={{ padding: 8, borderRadius: 8, background: "#FFD700", color: "#000" }}>Exportar CSV</button>
          <button onClick={() => alert("Exportar PDF - pendiente")} style={{ padding: 8, borderRadius: 8, border: "1px solid rgba(255,215,0,0.06)", color: "#FFD700" }}>Exportar PDF</button>
        </div>
      </div>
    </div>
  );
}