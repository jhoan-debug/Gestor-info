import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // demo credentials
    if (usuario === "admin" && clave === "1234") {
      onLogin("demo-session-token");
    } else {
      setError("Credenciales inválidas — demo: admin / 1234");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
      <form onSubmit={handleSubmit} style={{ width: 420, padding: 20, background: "#0b0b0b", border: "1px solid #c9b24a", borderRadius: 10 }}>
        <h2 style={{ color: "#FFD700", marginBottom: 12, textAlign: "center" }}>Acceso al Gestor</h2>
        <input value={usuario} onChange={(e)=>setUsuario(e.target.value)} placeholder="Usuario" style={inputStyle} />
        <input value={clave} onChange={(e)=>setClave(e.target.value)} placeholder="Contraseña" type="password" style={inputStyle} />
        {error && <div style={{ color: "#ff8a8a", marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={primaryBtn}>Entrar</button>
        <div style={{ marginTop: 8, fontSize: 12, color: "#c9b24a" }}>Demo: admin / 1234</div>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "8px 10px", marginBottom: 10, borderRadius: 8, border: "1px solid rgba(255,215,0,0.06)", background: "#0b0b0b", color: "#FFD700" };
const primaryBtn = { width: "100%", padding: "10px", borderRadius: 8, background: "#FFD700", border: "none", color: "#000", fontWeight: 700 };
