import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FaBirthdayCake, FaChartBar, FaDownload, FaFilter } from "react-icons/fa";
import Papa from "papaparse";
import api from "../api";

// Página Reportes: gráficos y exportación de datos derivados de los clientes.
function parseFecha(raw) {
  if (!raw) return null;
  if (raw.includes("/")) {
    const [d, m, y] = raw.split("/");
    return `${y}-${m}-${d}`;
  }
  return raw;
}

function calcularEdad(fechaNac) {
  if (!fechaNac) return null;
  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function ChartContainer({ title, children }) {
  return (
    <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function BirthdayList({ birthdays }) {
  if (birthdays.length === 0) {
    return (
      <p className="text-brand-dark text-center">¡No hay cumpleaños cercanos! Todos los clientes están celebrando en otro momento.</p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {birthdays.map((u, index) => {
        // Verifica si u.cliente existe, sino usa u directamente
        const cliente = u.cliente || u;
        return (
          <div key={cliente.id || index} className="p-4 bg-brand/10 rounded-lg border border-brand/20 shadow-inner">
            <div className="flex items-center gap-3">
              <FaBirthdayCake className="text-2xl text-brand" />
              <div>
                <strong className="text-brand">{cliente.nombre} {cliente.apellido}</strong>
                <p className="text-brand-dark text-sm">Cumple en {u.dias} día(s)</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Reportes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAnio, setFiltroAnio] = useState("todos");

  const [stats, setStats] = useState({
    total_clientes: 0,
    cumpleanos_mes: 0,
    ultimas_consultas: 0
  });
  const [chartData, setChartData] = useState([]);  // Para registros por mes
  const [cumpleanos, setCumpleanos] = useState([]);

  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#ef4444"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Carga clientes (para fórmulas, lentes, etc.)
      const res = await api.get("/clientes/");
      setClientes(res.data);
      console.log("Clientes cargados:", res.data);

      // Carga estadísticas del Dashboard
      const statsRes = await api.get("/stats/dashboard");
      setStats(statsRes.data);
      console.log("Estadísticas cargadas:", statsRes.data);

      // Carga registros por mes (de la API)
      const chartRes = await api.get("/stats/registros-por-mes");
      setChartData(chartRes.data);
      console.log("Registros por mes cargados:", chartRes.data);

      // Carga cumpleaños próximos
      const birthdayRes = await api.get("/clientes/cumpleanos-proximos");
      setCumpleanos(birthdayRes.data || []);
      console.log("Cumpleaños cargados:", birthdayRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = useMemo(() => {
    if (filtroAnio === "todos") return clientes;
    return clientes.filter(c => {
      const fecha = c.fecha_creacion || c.created_at || c.createdAt;
      if (!fecha) {
        console.warn("Cliente sin fecha de creación:", c.id);
        return false;
      }
      const anio = new Date(fecha).getFullYear();
      return anio === Number(filtroAnio);
    });
  }, [clientes, filtroAnio]);

  const formulaStats = useMemo(() => {
    const counter = {};

    clientesFiltrados.forEach(c => {
      const esfera = c.od_esfera || c.oi_esfera;
      if (!esfera) return;
      let rango = "Otro";
      if (esfera < -2) rango = "Miopía alta";
      else if (esfera >= -2 && esfera < 0) rango = "Miopía leve";
      else if (esfera > 2) rango = "Hipermetropía alta";
      else if (esfera > 0) rango = "Hipermetropía leve";
      counter[rango] = (counter[rango] || 0) + 1;
    });

    return Object.entries(counter)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key, value]) => ({
        name: key,
        value
      }));
  }, [clientesFiltrados]);

  const ageStats = useMemo(() => {
    const ranges = { "0-18": 0, "19-35": 0, "36-50": 0, "51-65": 0, "66+": 0 };
    let hasValidAges = false;
    console.log("Datos de clientesFiltrados para edades:", clientesFiltrados);
    console.log("Datos de cumpleanos para edades:", cumpleanos);

    try {
      // Primero intenta con clientes
      clientesFiltrados.forEach(c => {
        const edad = calcularEdad(parseFecha(c.fecha_cumpleanos));
        if (edad !== null) {
          hasValidAges = true;
          if (edad <= 18) ranges["0-18"]++;
          else if (edad <= 35) ranges["19-35"]++;
          else if (edad <= 50) ranges["36-50"]++;
          else if (edad <= 65) ranges["51-65"]++;
          else ranges["66+"]++;
          console.log(`Edad calculada para ${c.nombre}: ${edad}`);
        } else {
          console.warn("Edad no calculable para cliente:", c.id, c.fecha_cumpleanos);
        }
      });

      // Si no hay edades, calcula con cumpleanos
      if (!hasValidAges && cumpleanos.length > 0) {
        cumpleanos.forEach(u => {
          const cliente = u.cliente || u;
          const edad = calcularEdad(parseFecha(cliente.fecha_cumpleanos));
          if (edad !== null) {
            hasValidAges = true;
            if (edad <= 18) ranges["0-18"]++;
            else if (edad <= 35) ranges["19-35"]++;
            else if (edad <= 50) ranges["36-50"]++;
            else if (edad <= 65) ranges["51-65"]++;
            else ranges["66+"]++;
            console.log(`Edad calculada desde cumpleaños para ${cliente.nombre}: ${edad}`);
          }
        });
      }
    } catch (err) {
      console.error("Error calculando edades:", err);
    }

    const result = Object.entries(ranges).map(([key, value]) => ({ name: key, value }));
    console.log("Resultado de ageStats:", result);
    return result;
  }, [clientesFiltrados, cumpleanos]);

  const lenteStats = useMemo(() => {
    const counter = {};
    clientesFiltrados.forEach(c => {
      if (c.tipo_lente) {
        counter[c.tipo_lente] = (counter[c.tipo_lente] || 0) + 1;
      }
    });
    return Object.entries(counter)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key, value]) => ({ name: key, value }));
  }, [clientesFiltrados]);

  const extremeGraduations = useMemo(() => {
    return clientesFiltrados.filter(c => {
      const esfera = Math.abs(c.od_esfera || 0) > 6 || Math.abs(c.oi_esfera || 0) > 6;
      const cilindro = Math.abs(c.od_cilindro || 0) > 2 || Math.abs(c.oi_cilindro || 0) > 2;
      return esfera || cilindro;
    });
  }, [clientesFiltrados]);

  const totalClientes = filtroAnio === "todos" ? stats.total_clientes : clientesFiltrados.length;

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
      <div className="p-10 text-brand text-center animate-pulse">
        Cargando reportes...
      </div>
    );
  }

  return (
    <div className="p-6 text-brand animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaChartBar /> Reportes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg flex items-center gap-2"><FaChartBar /> Total de Clientes</h3>
          <p className="text-3xl font-bold">{totalClientes}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg flex items-center gap-2"><FaBirthdayCake /> Cumpleaños en 7 días</h3>
          <p className="text-3xl font-bold">{cumpleanos.length}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Registros Este Mes</h3>
          <p className="text-3xl font-bold">{stats.cumpleanos_mes}</p>
        </div>

        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber">
          <h3 className="text-brand-dark text-lg">Graduaciones Extremas</h3>
          <p className="text-3xl font-bold">{extremeGraduations.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <ChartContainer title="Registros de Clientes por Mes">
          {chartData.every(m => m.nuevos === 0) ? (
            <p className="text-brand-dark text-center">
              No hay datos disponibles. Verifica que haya clientes registrados en el año actual en la API.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="mes" stroke="#facc15" />
                <YAxis stroke="#facc15" />
                <Tooltip
                  labelFormatter={(label) => `Mes: ${label}`}
                  formatter={(value) => [`${value} clientes`, "Nuevos clientes"]}
                />
                <Bar dataKey="nuevos" fill="#facc15" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="Fórmulas Más Usadas ">
          {formulaStats.length === 0 ? (
            <p className="text-brand-dark text-center">No hay fórmulas registradas para el filtro seleccionado.</p>
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
        </ChartContainer>

        <ChartContainer title="Distribución de Edades">
          {ageStats.every(stat => stat.value === 0) ? (
            <p className="text-brand-dark text-center">No hay fechas de nacimiento disponibles para calcular edades. Verifica que los clientes tengan 'fecha_cumpleanos' en la API.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageStats}>
                <XAxis dataKey="name" stroke="#facc15" />
                <YAxis stroke="#facc15" />
                <Tooltip formatter={(value) => [`${value} clientes`, "Cantidad"]} />
                <Bar dataKey="value" fill="#60a5fa" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="Tipos de Lentes Más Usados ">
          {lenteStats.length === 0 ? (
            <p className="text-brand-dark text-center">No hay tipos de lentes registrados para el filtro seleccionado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lenteStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, value }) => `${name}: ${value}`}
                  animationDuration={1000}
                >
                  {lenteStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} usos`, name]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaBirthdayCake /> Cumpleaños Próximos (7 días)</h2>
        <button onClick={exportBirthdays} className="bg-brand text-white px-4 py-2 rounded flex items-center gap-2">
          <FaDownload /> Exportar CSV
        </button>
      </div>
      <BirthdayList birthdays={cumpleanos} />

      <div className="mt-10 bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Clientes con Graduaciones Extremas</h2>
        {extremeGraduations.length === 0 ? (
          <p className="text-brand-dark text-center">No hay clientes con graduaciones extremas para el filtro seleccionado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extremeGraduations.map((c) => (
              <div key={c.id} className="p-4 bg-red-100 rounded-lg border border-red-200 shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-red-500">⚠️</span>
                  <div>
                    <strong className="text-red-800">{c.nombre} {c.apellido}</strong>
                    <p className="text-red-600 text-sm">
                      OD: {c.od_esfera || 'N/A'} / {c.od_cilindro || 'N/A'}, OI: {c.oi_esfera || 'N/A'} / {c.oi_cilindro || 'N/A'}
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