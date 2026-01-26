import React from "react";
import { AnimatePresence } from "framer-motion"; // Importa para animaciones
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import PageTransition from "./pages/PageTransition"; // Importa el componente de transición

// Componente raíz: controla autenticación y vistas principales.
// Comentarios clave:
// - `useAuth()` es el hook que maneja estado/sesión (token). Revisa `hooks/useAuth.js` para detalles.
// - La navegación aquí es local (state `page`). En apps más grandes podrías usar react-router.
// - `AnimatePresence` + `PageTransition` envuelven cada página para animaciones suaves.
export default function App() {
  // `token` indica sesión; `login` y `logout` son handlers expuestos por el hook
  const { token, login, logout } = useAuth();
  const [page, setPage] = React.useState("dashboard");

  // Si no hay token, mostramos la pantalla de login
  if (!token) {
    return <Login onLogin={login} />; // Login sin animación, es la entrada inicial
  }

  // Layout básico: barra lateral + contenido principal
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000" }}>
      <Navbar page={page} onNavigate={setPage} onLogout={logout} />
      <main style={{ flex: 1, padding: 20, overflow: "auto" }}>
        <AnimatePresence mode="wait"> {/* Envuelve las vistas para animaciones */}
          <div key={page} className="view-animate"> {/* key basada en page para que AnimatePresence detecte cambios */}
            {page === "dashboard" && (
              <PageTransition>
                <Dashboard />
              </PageTransition>
            )}
            {page === "clientes" && (
              <PageTransition>
                <Clientes />
              </PageTransition>
            )}
            {page === "reportes" && (
              <PageTransition>
                <Reportes />
              </PageTransition>
            )}
            {page === "configuracion" && (
              <PageTransition>
                <Configuracion />
              </PageTransition>
            )}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}