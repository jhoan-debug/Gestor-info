import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FaBirthdayCake, FaChartBar, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import api from "../api";

function ChartContainer({ title, children }) {
  return (
    <div className="bg-panel border border-brand/10 p-4 rounded-xl shadow-lg">
      <h2 className="text-xs font-semibold text-brand border-l-2 border-brand pl-2 mb-3 uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

function KpiCard({ icon, label, value }) {
  return (
    <div className="bg-panel border border-brand/10 p-4 rounded-xl shadow-glow-amber">
      <h3 className="text-brand-dark text-xs flex items-center gap-1.5 uppercase tracking-wide">
        {icon} {label}
      </h3>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function BirthdayList({ birthdays }) {
  if (birthdays.length === 0) {
    return (
      <p className="text-brand-dark text-xs text-center py-4">¡No hay cumpleaños cercanos!</p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {birthdays.map((u, index) => {
        const cliente = u.cliente || u;
        return (
          <div key={cliente.id || index} className="p-3 bg-brand/10 rounded-lg border border-brand/20 shadow-inner">
            <div className="flex items-center gap-2.5">
              <FaBirthdayCake className="text-base text-brand shrink-0" />
              <div className="min-w-0">
                <strong className="text-brand text-sm truncate block">{cliente.nombre} {cliente.apellido}</strong>
                <p className="text-brand-dark text-xs">Cumple en {u.dias} día(s)</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Reportes() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_clientes: 0, cumpleanos_mes: 0 });
  const [chartData, setChartData] = useState([]);
  const [cumpleanos, setCumpleanos] = useState([]);
  const [formulaStats, setFormulaStats] = useState([]);
  const [ageStats, setAgeStats] = useState([]);
  const [lenteStats, setLenteStats] = useState([]);
  const [extremeGraduations, setExtremeGraduations] = useState([]);

  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#ef4444"];
  const tickStyle = { fill: '#9ca3af', fontSize: 10 };
  const tooltipStyle = { backgroundColor: '#18181b', border: '1px solid #FFD700', borderRadius: '8px', fontSize: '11px' };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        chartRes,
        birthdayRes,
        ageRes,
        lenteRes,
        formulaRes,
        extremeRes
      ] = await Promise.all([
        api.get("/stats/dashboard"),
        api.get("/stats/registros-por-mes"),
        api.get("/clientes/cumpleanos-proximos"),
        api.get("/reportes/edades"),
        api.get("/reportes/lentes"),
        api.get("/reportes/formulas"),
        api.get("/reportes/graduaciones-extremas")
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setCumpleanos(birthdayRes.data || []);
      setAgeStats(ageRes.data || []);
      setLenteStats(lenteRes.data || []);
      setFormulaStats(formulaRes.data || []);
      setExtremeGraduations(extremeRes.data || []);
    } catch (err) {
      console.error("Error cargando reportes:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportBirthdays = () => {
    const data = cumpleanos.map(u => {
      const cliente = u.cliente || u;
      return {
        Nombre: `${cliente.nombre} ${cliente.apellido}`,
        Dias: u.dias
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cumpleanos_proximos.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="p-6 text-brand text-center animate-pulse text-xs">
        Cargando reportes...
      </div>
    );
  }

  return (
    <div className="p-4 text-brand animate-fade-in-up">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaChartBar className="text-base" /> Reportes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<FaChartBar />} label="Total Clientes" value={stats.total_clientes} />
        <KpiCard icon={<FaBirthdayCake />} label="Próximos 7 días" value={cumpleanos.length} />
        <KpiCard label="Registros Este Mes" value={stats.cumpleanos_mes} />
        <KpiCard label="Graduaciones Extremas" value={extremeGraduations.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartContainer title="Registros de clientes por mes">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="mes" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} clientes`, "Nuevos clientes"]} />
              <Bar dataKey="nuevos" fill="#facc15" animationDuration={1000} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Fórmulas más frecuentes">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={formulaStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
                style={{ fontSize: '10px' }}
              >
                {formulaStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`${value} casos`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Distribución de edades">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageStats}>
              <XAxis dataKey="name" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} clientes`, "Cantidad"]} />
              <Bar dataKey="value" fill="#60a5fa" animationDuration={1000} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Tipos de lentes más usados">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={lenteStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
                style={{ fontSize: '10px' }}
              >
                {lenteStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`${value} usos`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-semibold text-brand border-l-2 border-brand pl-2 uppercase tracking-wide flex items-center gap-1.5">
          <FaBirthdayCake /> Cumpleaños próximos (7 días)
        </h2>
        <button onClick={exportBirthdays} className="bg-brand text-black px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-dark transition">
          <FaDownload /> Exportar CSV
        </button>
      </div>
      <BirthdayList birthdays={cumpleanos} />

      <div className="mt-6 bg-panel border border-brand/10 p-4 rounded-xl shadow-lg">
        <h2 className="text-xs font-semibold text-brand border-l-2 border-brand pl-2 mb-3 uppercase tracking-wide">
          Clientes con graduaciones extremas
        </h2>
        {extremeGraduations.length === 0 ? (
          <p className="text-brand-dark text-xs text-center py-4">No hay clientes con graduaciones extremas registradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {extremeGraduations.map((c) => (
              <div key={c.id} className="p-3 bg-red-950/40 rounded-lg border border-red-500/20 shadow-inner">
                <div className="flex items-center gap-2.5">
                  <span className="text-base text-red-400 shrink-0">⚠️</span>
                  <div className="min-w-0">
                    <strong className="text-red-300 text-sm truncate block">{c.nombre} {c.apellido}</strong>
                    <p className="text-red-400/80 text-xs">
                      OD: {c.od_esfera ?? 'N/A'} / {c.od_cilindro ?? 'N/A'}, OI: {c.oi_esfera ?? 'N/A'} / {c.oi_cilindro ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}