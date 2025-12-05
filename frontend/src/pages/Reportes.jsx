// src/pages/Reportes.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Reportes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    api.get("/clientes/")
      .then(res => setClientes(res.data || []))
      .catch(() => setClientes([]));
  }, []);

  // ❖ Cumpleaños próximos (7 días)
  const getUpcoming = () => {
    const hoy = new Date();
    const ms = 24 * 3600 * 1000;
    const out = [];

    clientes.forEach(c => {
      const raw = c.fecha_cumpleanos || c.fechaNacimiento;
      if (!raw) return;

      const d = new Date(raw);
      if (isNaN(d)) return;

      let fecha = new Date(hoy.getFullYear(), d.getMonth(), d.getDate());
      let diff = Math.round((fecha - hoy) / ms);

      // Si ya pasó este año → se calcula para el próximo
      if (diff < 0) {
        fecha = new Date(hoy.getFullYear() + 1, d.getMonth(), d.getDate());
        diff = Math.round((fecha - hoy) / ms);
      }

      if (diff >= 0 && diff <= 7) out.push({ cliente: c, dias: diff });
    });

    out.sort((a, b) => a.dias - b.dias);
    return out;
  };

  // ❖ Conteo mensual
  const getMonthlyStats = () => {
    const months = Array(12).fill(0);

    clientes.forEach(c => {
      const raw = c.fecha_registro || c.createdAt;
      if (!raw) return;

      const d = new Date(raw);
      if (!isNaN(d)) months[d.getMonth()] += 1;
    });

    return months.map((count, i) => ({
      mes: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][i],
      cantidad: count
    }));
  };

  const upcoming = getUpcoming();
  const monthly = getMonthlyStats();

  return (
    <div className="p-6 text-brand animate-fade-in-up">

      <h1 className="text-3xl font-bold mb-6">Reportes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ░░ Tarjeta Cumpleaños ░░ */}
        <div className="bg-panel p-6 rounded-xl border border-brand/10 shadow-glow-amber animate-slide-left">
          <h2 className="text-xl font-semibold mb-3 text-brand">🎂 Cumpleaños próximos</h2>

          {upcoming.length ? (
            upcoming.map(u => (
              <div key={u.cliente.id} className="mb-3 p-3 bg-black/40 rounded-lg border border-brand/10">
                <div className="font-semibold">{u.cliente.nombre} {u.cliente.apellido}</div>
                <div className="text-brand-dark text-sm">En {u.dias} día(s)</div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 mt-3">No hay cumpleaños próximos</div>
          )}
        </div>

        {/* ░░ Gráfica mensual ░░ */}
        <div className="lg:col-span-2 bg-panel p-6 rounded-xl border border-brand/10 shadow-glow-amber animate-slide-left">
          <h2 className="text-xl font-semibold mb-4 text-brand">📊 Clientes registrados por mes</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#c9b24a" />
              <YAxis stroke="#c9b24a" />
              <Tooltip contentStyle={{ background: "#000", border: "1px solid #c9b24a" }} />
              <Bar dataKey="cantidad" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
