// src/pages/Reportes.jsx
import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Reportes({ clientes = [] }) {

  // COLORS
  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc"];

  // 🎂 Cumpleaños próximos
  const upcomingBirthdays = useMemo(() => {
    const today = new Date();
    const oneDay = 24 * 3600 * 1000;

    return clientes
      .map(c => {
        const raw = c.fecha_cumpleanos || c.fechaNacimiento;
        if (!raw) return null;

        const birth = new Date(raw);
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

  // 📅 Clientes registrados por mes
  const monthlyStats = useMemo(() => {
    const months = Array(12).fill(0);

    clientes.forEach(c => {
      const raw = c.fecha_registro || c.createdAt;
      if (!raw) return;
      const d = new Date(raw);
      if (!isNaN(d)) months[d.getMonth()]++;
    });

    return months.map((count, idx) => ({
      mes: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][idx],
      cantidad: count
    }));
  }, [clientes]);

  // 👁 Fórmulas más usadas (pie chart)
  const formulaStats = useMemo(() => {
    const counter = {};

    clientes.forEach(c => {
      const val = c.od_esfera || c.oi_esfera;
      if (!val) return;
      counter[val] = (counter[val] || 0) + 1;
    });

    return Object.entries(counter).map(([key, value]) => ({
      name: key,
      value
    }));
  }, [clientes]);

  // 📊 KPI: Total clientes
  const totalClientes = clientes.length;

  return (
    <div className="p-6 text-brand animate-fade-in-up">

      <h1 className="text-3xl font-bold mb-6">📊 Reportes</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Clientes</h3>
          <p className="text-3xl font-bold">{totalClientes}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Cumpleaños 7 días</h3>
          <p className="text-3xl font-bold">{upcomingBirthdays.length}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Fórmulas distintas</h3>
          <p className="text-3xl font-bold">{formulaStats.length}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Registros este mes</h3>
          <p className="text-3xl font-bold">
            {monthlyStats[new Date().getMonth()].cantidad}
          </p>
        </div>

      </div>

      {/* GRAFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Barras */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Registros por mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <XAxis dataKey="mes" stroke="#facc15" />
              <YAxis stroke="#facc15" />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Fórmulas más usadas</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formulaStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {formulaStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* Cumpleaños próximos */}
      <div className="mt-10 bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4">🎂 Cumpleaños en los próximos 7 días</h2>

        {upcomingBirthdays.length === 0 ? (
          <p className="text-brand-dark">No hay cumpleaños cercanos</p>
        ) : (
          upcomingBirthdays.map((u) => (
            <div key={u.cliente.id} className="p-3 border-b border-brand/10">
              <strong>{u.cliente.nombre} {u.cliente.apellido}</strong>
              <p className="text-brand-dark">En {u.dias} día(s)</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
