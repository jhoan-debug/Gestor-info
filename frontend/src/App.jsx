// src/App.jsx
import React from "react";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

export default function App() {
  const { token, login, logout } = useAuth();
  const [page, setPage] = React.useState("dashboard");

  if (!token) {
    return <Login onLogin={login} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000" }}>
      <Navbar page={page} onNavigate={setPage} onLogout={logout} />
      <main style={{ flex: 1, padding: 20, overflow: "auto" }}>
        <div className="view-animate">
          {page === "dashboard" && <Dashboard />}
          {page === "clientes" && <Clientes />}
          {page === "reportes" && <Reportes />}
          {page === "configuracion" && <Configuracion />}
        </div>
      </main>
    </div>
  );
}
