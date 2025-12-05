// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import BirthdayPopup from "../components/BirthdayPopup";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_clientes: 0,
    cumpleanos_mes: 0,
    ultimas_consultas: 0
  });

  const [loading, setLoading] = useState(true);
  const [cumplePopup, setCumplePopup] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCumples();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCumples = async () => {
    try {
      const res = await api.get("/clientes/cumpleanos-proximos");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCumplePopup(res.data);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Error al cargar cumpleaños:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-brand text-center animate-pulse">
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div className="p-5 text-brand animate-fade-in-up">

      {/* POPUP DE CUMPLEAÑOS */}
      {showPopup && (
        <BirthdayPopup
          birthdays={cumplePopup}  // Cambié de 'birthdays' a 'cumplePopup' para que coincida con el estado
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* TITULAR */}
      <h1 className="text-3xl font-bold mb-1 animate-slide-left">
        Bienvenido
      </h1>

      <p className="text-sm text-brand-dark mb-6 animate-slide-left animation-delay-150">
        Resumen general del sistema
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* TOTAL CLIENTES */}
        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up">
          <h3 className="text-lg text-brand-dark">Clientes registrados</h3>
          <p className="text-4xl font-bold mt-2 animate-pulse-amber">
            {stats.total_clientes}
          </p>
        </div>

        {/* CUMPLEAÑOS */}
        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up animation-delay-100">
          <h3 className="text-lg text-brand-dark">Cumpleaños del mes</h3>
          <p className="text-4xl font-bold mt-2 text-brand animate-pulse-amber">
            {stats.cumpleanos_mes}
          </p>
        </div>

        {/* ÚLTIMAS CONSULTAS */}
        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up animation-delay-200">
          <h3 className="text-lg text-brand-dark">Últimas consultas</h3>
          <p className="text-4xl font-bold mt-2 text-brand animate-pulse-amber">
            {stats.ultimas_consultas}
          </p>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 animate-fade-in-up animation-delay-300">
          <h3 className="text-lg text-brand-dark mb-4">Actividad reciente</h3>

          <div className="h-40 bg-brand/10 rounded-lg flex items-center justify-center text-brand-dark">
            Gráfica próximamente
          </div>
        </div>

      </div>
    </div>
  );
}