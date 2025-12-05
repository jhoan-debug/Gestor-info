import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../api";

function parseFecha(raw) {
  if (!raw) return null;
  if (raw.includes("/")) {
    const [d, m, y] = raw.split("/");
    return `${y}-${m}-${d}`;
  }
  return raw;
}

export default function Reportes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#ef4444"];

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes/");
      setClientes(res.data);
    } catch (err) {
      console.error("Error obteniendo clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // CUMPLEAÑOS PRÓXIMOS
  const upcomingBirthdays = useMemo(() => {
    const today = new Date();
    const oneDay = 86400000;

    return clientes
      .map(c => {
        const raw = parseFecha(c.fecha_cumpleanos);
        if (!raw) return null;

        const birth = new Date(raw);
        if (isNaN(birth)) return null;

        let compare = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        let diff = Math.round((compare - today) / oneDay);

        if (diff < 0) {
          compare = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
          diff = Math.round((compare - today) / oneDay);
        }

        return { cliente: c, dias: diff };
      })
      .filter(Boolean)
      .filter(x => x.dias <= 7)
      .sort((a, b) => a.dias - b.dias);
  }, [clientes]);

  // REGISTROS POR MES
  const monthlyStats = useMemo(() => {
    const months = Array(12).fill(0);

    clientes.forEach(c => {
      let raw = c.fecha_creacion || c.created_at || c.createdAt || null;
      if (!raw) {
        // Si no hay fecha, usa una dummy (ej. fecha actual) para simular datos
        raw = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
      }
      const d = new Date(raw);
      if (!isNaN(d)) months[d.getMonth()]++;
    });

    return months.map((count, idx) => ({
      mes: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][idx],
      cantidad: count
    }));
  }, [clientes]);

  // FORMULAS MÁS USADAS (Top 10)
  const formulaStats = useMemo(() => {
    const counter = {};

    clientes.forEach(c => {
      const formulas = [
        c.od_esfera, c.od_cilindro, c.od_eje, c.od_add,
        c.oi_esfera, c.oi_cilindro, c.oi_eje, c.oi_add
      ];

      formulas.forEach(f => {
        if (!f) return;
        counter[f] = (counter[f] || 0) + 1;
      });
    });

    // Ordenar por frecuencia y tomar top 10
    return Object.entries(counter)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key, value]) => ({
        name: key,
        value
      }));
  }, [clientes]);

  const totalClientes = clientes.length;

  if (loading) {
    return (
      <div className="p-10 text-brand text-center animate-pulse">
        Cargando reportes...
      </div>
    );
  }

  return (
    <div className="p-6 text-brand animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Total de Clientes</h3>
          <p className="text-3xl font-bold">{totalClientes}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Cumpleaños en 7 días</h3>
          <p className="text-3xl font-bold">{upcomingBirthdays.length}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Fórmulas Distintas (Top 10)</h3>
          <p className="text-3xl font-bold">{formulaStats.length}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Registros Este Mes</h3>
          <p className="text-3xl font-bold">
            {monthlyStats[new Date().getMonth()].cantidad}
          </p>
        </div>
      </div>

      {/* GRAFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Barras */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Registros de Clientes por Mes</h2>
          {monthlyStats.every(m => m.cantidad === 0) ? (
            <p className="text-brand-dark text-center">No hay datos de registros por mes disponibles.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats}>
                <XAxis dataKey="mes" stroke="#facc15" />
                <YAxis stroke="#facc15" />
                <Tooltip
                  labelFormatter={(label) => `Mes: ${label}`}
                  formatter={(value) => [`${value} clientes`, "Cantidad"]}
                />
                <Bar dataKey="cantidad" fill="#facc15" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Fórmulas Más Usadas (Top 10)</h2>
          {formulaStats.length === 0 ? (
            <p className="text-brand-dark text-center">No hay fórmulas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formulaStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, value }) => `${name}: ${value}`}
                  animationDuration={1000}
                >
                  {formulaStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} usos`, name]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Cumpleaños próximos */}
      <div className="mt-10 bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4">Cumpleaños Próximos (7 días)</h2>
        {upcomingBirthdays.length === 0 ? (
          <p className="text-brand-dark text-center">¡No hay cumpleaños cercanos! Todos los clientes están celebrando en otro momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBirthdays.map((u) => (
              <div key={u.cliente.id} className="p-4 bg-brand/10 rounded-lg border border-brand/20 shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-2xl"></span>
                  <div>
                    <strong className="text-brand">{u.cliente.nombre} {u.cliente.apellido}</strong>
                    <p className="text-brand-dark text-sm">Cumple en {u.dias} día(s)</p>
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