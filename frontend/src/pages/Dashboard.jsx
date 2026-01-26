import React, { useEffect, useState } from "react";
import api from "../api";
// Nota: este archivo usa `recharts` para visualizaciones.
// Asegúrate de instalarlo: `npm install recharts`.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

// Hook personalizado para manejar fetches y estado del Dashboard.
// - Centraliza las llamadas a la API necesarias para la vista del dashboard.
// - Retorna `stats`, `chartData`, `cumpleanos`, `clientes`, `loading`, `error` y helpers.
const useDashboardData = () => {
  const [stats, setStats] = useState({
    total_clientes: 0,
    cumpleanos_mes: 0,
    ultimas_consultas: 0
  });

  const [chartData, setChartData] = useState([]); // Estado para datos dinámicos de la gráfica

  const [cumpleanos, setCumpleanos] = useState([]);
  const [clientes, setClientes] = useState([]); // Agregado para calcular cumpleaños por mes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Obtiene estadísticas resumidas del backend (total clientes, cumpleaños del mes, últimas consultas)
  const fetchStats = async () => {
    try {
      const res = await api.get("/stats/dashboard");
      console.log("Datos de /stats/dashboard:", res.data);  // Log temporal para depurar
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error("Error en fetchStats:", err);
      setError("Error al cargar estadísticas. Intenta recargar la página.");
    }
  };

  // Obtiene datos para la gráfica de actividad reciente
  const fetchChartData = async () => {
    try {
      const chartRes = await api.get("/stats/actividad-reciente");
      console.log("Datos de /stats/actividad-reciente:", chartRes.data);  // Log temporal para depurar
      setChartData(chartRes.data);
    } catch (err) {
      console.error("Error en fetchChartData:", err);
      setError("Error al cargar actividad reciente.");
    }
  };

  // Obtiene próximos cumpleaños y muestra un popup sonoro una vez al día
  const fetchCumpleanos = async () => {
    try {
      const res = await api.get("/clientes/cumpleanos-proximos");
      console.log("Datos de /clientes/cumpleanos-proximos:", res.data);  // Log temporal para depurar
      if (res.data && res.data.length > 0) {
        setCumpleanos(res.data);
        const lastShown = localStorage.getItem('cumpleanosShown');
        const today = new Date().toDateString();
        if (lastShown !== today) {
          setShowPopup(true);
          new Audio("/sounds/notify.mp3").play().catch(() => {});
          localStorage.setItem('cumpleanosShown', today);
        }
      }
    } catch (err) {
      console.log("Error en fetchCumpleanos:", err);
      setError("Error al cargar cumpleaños.");
    }
  };

  // Obtiene todos los clientes para hacer cálculos locales (ej. cumpleaños por mes)
  // Nota: si la API ya retorna esta información, podrías evitar esta petición adicional.
  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes/");
      console.log("Datos de /clientes/:", res.data);  // Log temporal para depurar
      setClientes(res.data);
    } catch (err) {
      console.error("Error en fetchClientes:", err);
      setError("Error al cargar clientes.");
    }
  };

  // Carga inicial: ejecuta todas las peticiones en paralelo para optimizar tiempo
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchChartData(), fetchCumpleanos(), fetchClientes()]); // Agregado fetchClientes
      setLoading(false);
    };
    loadData();
  }, []);

  // Log para depurar cambios en chartData
  useEffect(() => {
    console.log("chartData cambió:", chartData);
  }, [chartData]);

  // `refetch` permite reintentar manualmente desde el componente
  return { stats, cumpleanos, chartData, clientes, loading, error, showPopup, refetch: () => { fetchStats(); fetchChartData(); fetchCumpleanos(); fetchClientes(); } };
};

// Función auxiliar para parsear fechas construidas en formato `dd/mm/yyyy` a `yyyy-mm-dd`
// - Útil cuando los datos vienen en formatos inconsistentes desde el backend.
function parseFecha(raw) {
  if (!raw) return null;
  if (raw.includes("/")) {
    const [d, m, y] = raw.split("/");
    return `${y}-${m}-${d}`;
  }
  return raw;
}

// Dashboard: muestra estadísticas clave y notifica próximos cumpleaños.
export default function Dashboard() {
  // Obtenemos datos y estado desde el hook personalizado
  const { stats, cumpleanos, chartData, clientes, loading, error, showPopup, refetch } = useDashboardData();
  // `popupVisible` controla si el modal de cumpleaños está desplegado
  const [popupVisible, setPopupVisible] = useState(showPopup);
  // `selectedDay` mantiene la fila seleccionada de la gráfica para mostrar detalles
  const [selectedDay, setSelectedDay] = useState(null);

  // Sincroniza visibilidad del popup con el flag devuelto por el hook
  useEffect(() => {
    setPopupVisible(showPopup);
  }, [showPopup]);

  // Cálculo de cumpleaños por mes (inspirado en reportes, pero simplificado para dashboard)
  // Calcula cantidad de cumpleaños por mes a partir de `clientes`.
  // `useMemo` evita recalcular innecesariamente cuando `clientes` no cambia.
  const cumpleanosPorMes = React.useMemo(() => {
    const meses = [
      { mes: 'Enero', count: 0 },
      { mes: 'Febrero', count: 0 },
      { mes: 'Marzo', count: 0 },
      { mes: 'Abril', count: 0 },
      { mes: 'Mayo', count: 0 },
      { mes: 'Junio', count: 0 },
      { mes: 'Julio', count: 0 },
      { mes: 'Agosto', count: 0 },
      { mes: 'Septiembre', count: 0 },
      { mes: 'Octubre', count: 0 },
      { mes: 'Noviembre', count: 0 },
      { mes: 'Diciembre', count: 0 }
    ];
    clientes.forEach(c => {
      if (c.fecha_cumpleanos) {
        const fecha = new Date(parseFecha(c.fecha_cumpleanos));
        if (!isNaN(fecha)) {
          const mesIndex = fecha.getMonth();
          meses[mesIndex].count++;
        }
      }
    });
    return meses;
  }, [clientes]);

  // Paleta para la gráfica de pastel (cumpleaños)
  const COLORS = ["#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#ef4444", "#ef4444", "#f87171", "#fbbf24", "#a3e635", "#60a5fa", "#c084fc"];

  // Estado de carga: mostrar placeholder
  if (loading) {
    return (
      <div className="p-10 text-brand text-center animate-pulse">
        Cargando estadísticas...
      </div>
    );
  }

  // Estado de error: mostrar mensaje y botón para reintentar
  if (error) {
    return (
      <div className="p-10 text-red-500 text-center">
        {error}
        <button onClick={refetch} className="ml-4 px-4 py-2 bg-brand text-black rounded-lg">
          Reintentar
        </button>
      </div>
    );
  }

  // Vista principal del Dashboard
  return (
    <div className="p-5 text-brand animate-fade-in-up">
      {/* TITULAR */}
      <h1 className="text-3xl font-bold mb-1 animate-slide-left">
        Bienvenido
      </h1>
      <p className="text-sm text-brand-dark mb-6 animate-slide-left animation-delay-150">
        Resumen general del sistema de gestión Mundo Optico: Zona Oriente
      </p>

      {/* Botón para refrescar datos manualmente */}
      <button onClick={refetch} className="mb-4 px-4 py-2 bg-brand text-black rounded-lg">
        Refrescar Datos
      </button>

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

        {/* Actividad reciente (solo nuevos clientes registrados, sin consultas para evitar duplicación) */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-300">
          <h3 className="text-lg text-brand-dark mb-4">Actividad reciente (últimos 7 días)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" tick={{ fill: '#374151', fontSize: 12 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend />
              <Bar
                dataKey="nuevos_clientes"  // Cambiado: solo nuevos clientes registrados, sin sumar consultas
                name="Actividad (Nuevos Clientes)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                onClick={(data) => setSelectedDay({ ...data, actividad: data.nuevos_clientes })}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva gráfica: Ventas (solo clientes que compraron, sin monto monetario) */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-325">
          <h3 className="text-lg text-brand-dark mb-4">Ventas recientes (últimos 7 días)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" tick={{ fill: '#374151', fontSize: 12 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                formatter={(value, name) => {
                  if (name === 'Clientes que Compraron') return [`${value} clientes`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="ventas"  // Solo clientes que compraron (conteo, no monto)
                name="Clientes que Compraron"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                onClick={(data) => setSelectedDay(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva gráfica: Cumpleaños por mes */}
        <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-350">
          <h3 className="text-lg text-brand-dark mb-4">Cumpleaños por Mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cumpleanosPorMes}
                dataKey="count"
                nameKey="mes"
                cx="50%"
                cy="50%"
                outerRadius={100}
                // Muestra etiqueta solo si hay cumpleaños en el mes
                label={({ mes, count }) => count > 0 ? `${mes}: ${count}` : ''}
                animationDuration={1500}
              >
                {cumpleanosPorMes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} cumpleaños`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Actualizaciones consolidadas */}
        <div className="bg-panel border border-brand/10 p-5 rounded-xl shadow-glow-amber col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in-up animation-delay-400">
          <h3 className="text-lg text-brand-dark mb-4">Actualizaciones</h3>
          <div className="bg-brand/10 rounded-lg p-4 text-brand-dark">
            <p className="mb-4">Bienvenido a la versión 2.0 de Mundo Optico: Zona Oriente. ¡Gracias por confiar!</p>
            <p className="font-semibold">Ajustes aplicados:</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                <strong>Registro de Cambios</strong>
                <br />
                <strong>############# [2.1.0] - 2026 - 01 - 20</strong>
                <br />
                <strong>############# Agregado</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Transiciones suaves entre páginas con Framer Motion para mejor UX</li>
                  <li>UI de login mejorada con íconos, sombras y animaciones</li>
                  <li>Cierre automático después de 30 minutos de inactividad para seguridad</li>
                  <li>Campos adicionales en el formulario de creación de cliente</li>
                  <li>Función de importación de nube a base de datos local</li>
                  <li>Mejoras UX/UI en toda la aplicación</li>
                  <li>Gráficos más comprensibles y estéticos en reportes y dashboard</li>
                </ul>
                <strong>############# Cambiado</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Ajustes menores de UI para mejor responsividad</li>
                  <li>Transiciones suaves entre páginas con Framer Motion para mejor UX</li>
                  <li>UI de login mejorada con íconos, sombras y animaciones</li>
                  <li>Cierre automático después de 30 minutos de inactividad para seguridad</li>
                  <li>Campos adicionales en el formulario de creación de cliente</li>
                  <li>Función de importación de nube a base de datos local</li>
                  <li>Mejoras UX/UI en toda la aplicación</li>
                  <li>Gráficos más comprensibles y estéticos en reportes y dashboard</li>
                </ul>
                <strong>### Cambiado</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Ajustes menores de UI para mejor responsividad</li>
                </ul>
                <strong>############# [1.0] - Fecha Anterior</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Versión inicial</li>
                </ul>
              </li>
              <li>Mejoras en la interfaz de usuario para una experiencia más fluida.</li>
              <li>Corrección de errores menores para mejor manejo de la aplicación.</li>
              <li>Optimización del rendimiento general de la aplicación.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal para detalles del día seleccionado */}
      {/* Modal con detalles del día seleccionado en la gráfica */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in">
          <div className="bg-panel border border-brand p-8 rounded-2xl shadow-2xl animate-scale-in w-full max-w-md">
            <h2 className="text-2xl font-bold text-brand mb-5 text-center">
              Detalles de {selectedDay.dia}
            </h2>
            <div className="space-y-3">
              <p className="text-brand-dark"><strong>Consultas:</strong> {selectedDay.consultas}</p>
              <p className="text-brand-dark"><strong>Ventas:</strong> {selectedDay.ventas} clientes</p>  {/* Cambiado: solo clientes, sin monto */}
              <p className="text-brand-dark"><strong>Nuevos clientes:</strong> {selectedDay.nuevos_clientes}</p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-full mt-6 px-4 py-2 bg-brand text-black rounded-lg font-semibold hover:bg-brand-dark transition shadow-glow-amber"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Cumpleaños Popup */}
      {/* Popup que lista los próximos cumpleaños */}
      {popupVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[999] animate-fade-in" role="dialog" aria-labelledby="cumpleanos-title">
          <div className="bg-panel border border-brand p-8 rounded-2xl shadow-2xl animate-scale-in w-full max-w-xl">
            <h2 id="cumpleanos-title" className="text-2xl font-bold text-brand mb-5 text-center">
              Próximos cumpleaños
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
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setPopupVisible(false)}
                className="flex-1 px-4 py-2 bg-brand text-black rounded-lg font-semibold hover:bg-brand-dark transition shadow-glow-amber"
              >
                Cerrar
              </button>
              <button
                onClick={() => { setPopupVisible(false); localStorage.setItem('cumpleanosHidden', 'true'); }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                No mostrar más hoy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}