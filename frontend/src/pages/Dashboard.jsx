import React, { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import BirthdayPopup from "../components/BirthdayPopup";

const useDashboardData = () => {
  const [stats, setStats] = useState({
    total_clientes: 0,
    cumpleanos_mes: 0,
    ultimas_consultas: 0
  });

  const [chartData, setChartData] = useState([]);
  const [cumpleanos, setCumpleanos] = useState([]);
  const [cumpleanosPorMes, setCumpleanosPorMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Error en fetchStats:", err);
      setError("Error al cargar estadísticas.");
    }
  };

  const fetchChartData = async () => {
    try {
      const chartRes = await api.get("/stats/actividad-reciente");
      setChartData(chartRes.data);
    } catch (err) {
      console.error("Error en fetchChartData:", err);
      setError("Error al cargar actividad reciente.");
    }
  };

const fetchCumpleanos = async () => {
  try {
    const res = await api.get("/clientes/cumpleanos-proximos");
    if (res.data && res.data.length > 0) {
      setCumpleanos(res.data);

      // Solo auto-mostrar si hay alguno a menos de 3 días
      const hayUrgente = res.data.some(c => c.dias <= 3);
      const lastShown = localStorage.getItem('cumpleanosShown');
      const today = new Date().toDateString();

      if (hayUrgente && lastShown !== today) {
        setShowPopup(true);
        localStorage.setItem('cumpleanosShown', today);
      }
    }
  } catch (err) {
    console.error("Error en fetchCumpleanos:", err);
    setError("Error al cargar cumpleaños.");
  }
};

  const fetchCumpleanosPorMes = async () => {
    try {
      const res = await api.get("/stats/cumpleanos-por-mes");
      setCumpleanosPorMes(res.data);
    } catch (err) {
      console.error("Error en fetchCumpleanosPorMes:", err);
      setError("Error al cargar cumpleaños por mes.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchChartData(),
        fetchCumpleanos(),
        fetchCumpleanosPorMes()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    stats,
    cumpleanos,
    chartData,
    cumpleanosPorMes,
    loading,
    error,
    showPopup,
    refetch: () => {
      fetchStats();
      fetchChartData();
      fetchCumpleanos();
      fetchCumpleanosPorMes();
    }
  };
};

function StatCard({ label, value, delay = "" }) {
  return (
    <div className={`bg-panel border border-brand/10 p-4 rounded-xl shadow-glow-amber animate-fade-in-up ${delay}`}>
      <h3 className="text-xs uppercase tracking-wide text-brand-dark">{label}</h3>
      <p className="text-2xl font-bold mt-1 text-brand">{value}</p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold text-brand border-l-2 border-brand pl-2 mb-3 uppercase tracking-wide">
      {children}
    </h3>
  );
}

export default function Dashboard() {
  const { stats, cumpleanos, chartData, cumpleanosPorMes, loading, error, showPopup, refetch } = useDashboardData();
  const [popupVisible, setPopupVisible] = useState(showPopup);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    setPopupVisible(showPopup);
  }, [showPopup]);

  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#ef4444", "#f87171", "#fbbf24", "#a3e635"];

  const tickStyle = { fill: '#9ca3af', fontSize: 10 };

  if (loading) {
    return (
      <div className="p-6 text-brand text-center animate-pulse text-xs">
        Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center text-xs">
        {error}
        <button onClick={refetch} className="ml-3 px-3 py-1.5 bg-brand text-black rounded-lg text-xs font-semibold">
          Reintentar
        </button>
      </div>
    );
  }

 return (
  <div className="p-4 text-brand animate-fade-in-up">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-xl font-bold animate-slide-left">Bienvenido</h1>
        <p className="text-xs text-brand-dark animate-slide-left animation-delay-150">
          Resumen general — Mundo Óptico: Zona Oriente
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPopupVisible(true)}
          className="px-3 py-1.5 bg-neutral-900 text-brand border border-brand/10 rounded-lg text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1.5"
        >
          🎂 Cumpleaños
          {cumpleanos.length > 0 && (
            <span className="bg-brand text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cumpleanos.length}
            </span>
          )}
        </button>
        <button onClick={refetch} className="px-3 py-1.5 bg-brand text-black rounded-lg text-xs font-semibold hover:bg-brand-dark transition">
          ↻ Refrescar
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Clientes registrados" value={stats.total_clientes} />
        <StatCard label="Cumpleaños del mes" value={stats.cumpleanos_mes} delay="animation-delay-100" />
        <StatCard label="Últimas consultas" value={stats.ultimas_consultas} delay="animation-delay-200" />

        {/* Actividad + Ventas combinadas en un solo gráfico */}
        <div className="bg-panel border border-brand/10 p-4 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-300">
          <SectionTitle>Actividad y ventas (últimos 7 días)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="dia" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #FFD700',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                labelStyle={{ color: '#FFD700', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar
                dataKey="nuevos_clientes"
                name="Nuevos clientes"
                fill="#34d399"
                radius={[3, 3, 0, 0]}
                animationDuration={1200}
                onClick={(data) => setSelectedDay(data)}
              />
              <Bar
                dataKey="ventas"
                name="Ventas"
                fill="#facc15"
                radius={[3, 3, 0, 0]}
                animationDuration={1200}
                onClick={(data) => setSelectedDay(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumpleaños por mes */}
        <div className="bg-panel border border-brand/10 p-4 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-350">
          <SectionTitle>Cumpleaños por mes</SectionTitle>
          {cumpleanosPorMes.every(m => m.count === 0) ? (
            <p className="text-brand-dark text-xs text-center py-8">No hay cumpleaños registrados este año.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={200} className="sm:!w-1/2">
                <PieChart>
                  <Pie
                    data={cumpleanosPorMes.filter(m => m.count > 0)}
                    dataKey="count"
                    nameKey="mes"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    animationDuration={1200}
                  >
                    {cumpleanosPorMes.filter(m => m.count > 0).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #FFD700', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(value, name) => [`${value} cumpleaños`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Leyenda propia, siempre legible */}
              <div className="flex-1 w-full space-y-1.5">
                {cumpleanosPorMes.filter(m => m.count > 0).map((m, i) => (
                  <div key={m.mes} className="flex items-center justify-between text-xs bg-neutral-800/60 px-3 py-1.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-brand-dark">{m.mes}</span>
                    </div>
                    <span className="text-brand font-semibold">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del día */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4">
          <div className="bg-panel border border-brand/20 p-5 rounded-xl shadow-2xl animate-scale-in w-full max-w-sm">
            <h2 className="text-sm font-semibold text-brand mb-3 border-l-2 border-brand pl-2 uppercase tracking-wide">
              Detalles de {selectedDay.dia}
            </h2>
            <div className="space-y-1.5 text-xs">
              <p className="text-brand-dark"><strong className="text-brand">Consultas:</strong> {selectedDay.consultas}</p>
              <p className="text-brand-dark"><strong className="text-brand">Ventas:</strong> {selectedDay.ventas} clientes</p>
              <p className="text-brand-dark"><strong className="text-brand">Nuevos clientes:</strong> {selectedDay.nuevos_clientes}</p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-full mt-4 px-3 py-1.5 bg-brand text-black rounded-lg text-xs font-semibold hover:bg-brand-dark transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Popup de cumpleaños */}
      {popupVisible && (
        <BirthdayPopup
          birthdays={cumpleanos}
          onClose={() => setPopupVisible(false)}
        />
      )}
    </div>
 );
}