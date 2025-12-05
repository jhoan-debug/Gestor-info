import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_clientes: 0,
    cumpleanos_mes: 0,
    ultimas_consultas: 0
  });

  const [loading, setLoading] = useState(true);

  // Popup cumpleaños
  const [cumpleanos, setCumpleanos] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCumpleanos();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener próximos cumpleaños
  const fetchCumpleanos = async () => {
  try {
    const res = await api.get("/clientes/cumpleanos-proximos");
    if (res.data && res.data.length > 0) {
      setCumpleanos(res.data);
      setPopupVisible(true);

      // sonido
      new Audio("/sounds/notify.mp3").play().catch(()=>{});
    }
  } catch (err) {
    console.log("Error cumpleaños:", err);
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

      {/* TITULAR */}
      <h1 className="text-3xl font-bold mb-1 animate-slide-left">
        Bienvenido
      </h1>

      <p className="text-sm text-brand-dark mb-6 animate-slide-left animation-delay-150">
        Resumen general del sistema de gestión para Mundo Optico
      </p>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up">
          <h3 className="text-lg text-brand-dark">Clientes registrados</h3>
          <p className="text-4xl font-bold mt-2 animate-pulse-amber">
            {stats.total_clientes}
          </p>
        </div>

        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up animation-delay-100">
          <h3 className="text-lg text-brand-dark">Cumpleaños del mes</h3>
          <p className="text-4xl font-bold mt-2 text-brand animate-pulse-amber">
            {stats.cumpleanos_mes}
          </p>
        </div>

        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber animate-fade-in-up animation-delay-200">
          <h3 className="text-lg text-brand-dark">Últimas consultas</h3>
          <p className="text-4xl font-bold mt-2 text-brand animate-pulse-amber">
            {stats.ultimas_consultas}
          </p>
        </div>

        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 animate-fade-in-up animation-delay-300">
          <h3 className="text-lg text-brand-dark mb-4">Actividad reciente</h3>

          <div className="h-40 bg-brand/10 rounded-lg flex items-center justify-center text-brand-dark">
            Gráfica próximamente
          </div>
        </div>
      </div>



      {/* Cumpleaños */}
      {popupVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[999] animate-fade-in">
          <div className="bg-panel border border-brand p-8 rounded-2xl shadow-2xl animate-scale-in w-full max-w-xl">

            <h2 className="text-2xl font-bold text-brand mb-5 text-center">
              Cumpleaños próximos
            </h2>

            <div className="max-h-80 overflow-y-auto pr-2">
              {cumpleanos.map(c => (
                <div
                  key={c.id}
                  className="p-4 bg-brand/10 rounded-lg mb-3 shadow-inner border border-brand/20"
                >
                  <p className="text-lg font-semibold text-brand">
                    {c.nombre} {c.apellido}
                  </p>
                  <p className="text-brand-dark text-sm">
                    En {c.dias} día(s)
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPopupVisible(false)}
              className="w-full mt-6 px-4 py-2 bg-brand text-black rounded-lg font-semibold hover:bg-brand-dark transition shadow-glow-amber"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
