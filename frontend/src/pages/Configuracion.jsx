import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import api from "../api";
import { supabase } from "../supabaseClient";

export default function Configuracion() {
  const [clientes, setClientes] = useState([]);
  const [cumpleanos, setCumpleanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [tema, setTema] = useState(localStorage.getItem("tema") || "claro");
  const [notificaciones, setNotificaciones] = useState(localStorage.getItem("notificaciones") === "true");

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const resClientes = await api.get("/clientes/");
      const resCumpleanos = await api.get("/clientes/cumpleanos-proximos");
      console.log("Datos de clientes desde API:", resClientes.data);
      setClientes(resClientes.data);
      setCumpleanos(resCumpleanos.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar tema
  const cambiarTema = (nuevoTema) => {
    setTema(nuevoTema);
    localStorage.setItem("tema", nuevoTema);
    document.documentElement.className = nuevoTema === "oscuro" ? "dark" : "";
  };

  // Cambiar notificaciones
  const cambiarNotificaciones = (valor) => {
    setNotificaciones(valor);
    localStorage.setItem("notificaciones", valor);
  };

  // Exportar PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 10, 10);
    clientes.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.nombre} ${c.apellido} - ${c.fecha_cumpleanos || "Sin fecha"}`, 10, 20 + i * 10);
    });
    doc.save("clientes.pdf");
  };

  // Sincronizar a Supabase
  const sincronizarSupabase = async () => {
    setSyncStatus("Sincronizando...");
    try {
      // Borra tabla existente
      const { error: deleteError } = await supabase.from('clientes').delete().neq('id', 0);
      if (deleteError) {
        console.error("Error borrando:", deleteError);
        throw deleteError;
      }

      // Mapea los datos para que coincidan exactamente con el esquema de la tabla
      const datosMapeados = clientes.map(c => ({
        nombre: c.nombre,
        apellido: c.apellido,
        documento: c.documento,
        telefono: c.telefono,
        correo: c.correo,
        direccion: c.direccion,
        formula_od: c.formula_od,
        formula_oi: c.formula_oi,
        observaciones: c.observaciones,
        od_esfera: c.od_esfera,
        od_cilindro: c.od_cilindro,
        od_eje: c.od_eje,
        od_add: c.od_add,
        od_dp: c.od_dp,
        od_alt: c.od_alt,
        od_prisma: c.od_prisma,
        oi_esfera: c.oi_esfera,
        oi_cilindro: c.oi_cilindro,
        oi_eje: c.oi_eje,
        oi_add: c.oi_add,
        oi_dp: c.oi_dp,
        oi_alt: c.oi_alt,
        oi_prisma: c.oi_prisma,
        archivo: c.archivo,
        fecha_cumpleanos: c.fecha_cumpleanos ? new Date(c.fecha_cumpleanos).toISOString().split('T')[0] : null,  // Convierte a YYYY-MM-DD
        // fecha_registro se auto-genera en Supabase
      }));

      console.log("Datos mapeados para Supabase:", datosMapeados);  // Depuración

      // Insertar los datos mapeados
      const { error: insertError } = await supabase.from('clientes').insert(datosMapeados);
      if (insertError) {
        console.error("Error insertando:", insertError);
        throw insertError;
      }

      setSyncStatus("¡Datos sincronizados a Supabase exitosamente!");
    } catch (err) {
      console.error("Error completo:", err);
      setSyncStatus(`Error al sincronizar: ${err.message}`);
    }
  };

  // Preparar datos para CSV
  const csvClientes = clientes.map(c => ({
    ID: c.id,
    Nombre: c.nombre,
    Apellido: c.apellido,
    Documento: c.documento,
    Telefono: c.telefono,
    Correo: c.correo,
    Fecha_Cumpleanos: c.fecha_cumpleanos,
  }));

  const csvCumpleanos = cumpleanos.map(c => ({
    Nombre: c.nombre,
    Apellido: c.apellido,
    Dias: c.dias,
  }));

  return (
    <div className="p-6 text-brand animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {loading && <p className="text-center animate-pulse">Cargando datos...</p>}

      {/* EXPORTAR DATOS */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Exportar Datos</h2>
        <p className="text-brand-dark mb-4">Descarga listas en CSV o genera un PDF simple.</p>
        <div className="flex gap-4 flex-wrap">
          <CSVLink data={csvClientes} filename="clientes.csv">
            <button className="btn-primary px-4 py-2 rounded-lg">Exportar Clientes CSV</button>
          </CSVLink>
          <CSVLink data={csvCumpleanos} filename="cumpleanos_proximos.csv">
            <button className="btn-primary px-4 py-2 rounded-lg">Exportar Cumpleaños CSV</button>
          </CSVLink>
          <button onClick={exportarPDF} className="btn-primary px-4 py-2 rounded-lg">Exportar Clientes PDF</button>
        </div>
      </div>

      {/* CONECTAR A SUPABASE */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Conectar a la Nube (Supabase)</h2>
        <p className="text-brand-dark mb-4">Sincroniza tus datos locales a Supabase para backup o acceso remoto.</p>
        <button onClick={sincronizarSupabase} className="btn-primary px-4 py-2 rounded-lg" disabled={loading}>
          Sincronizar Datos
        </button>
        {syncStatus && <p className="mt-2 text-sm text-brand">{syncStatus}</p>}
      </div>

      {/* TEMA */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Tema de la App</h2>
        <p className="text-brand-dark mb-4">Elige el modo visual.</p>
        <select value={tema} onChange={e => cambiarTema(e.target.value)} className="p-2 rounded border border-brand/20 bg-panel text-brand">
          <option value="claro">Modo Claro</option>
          <option value="oscuro">Modo Oscuro</option>
        </select>
      </div>

      {/* NOTIFICACIONES */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
        <p className="text-brand-dark mb-4">Configura alertas.</p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notificaciones}
            onChange={e => cambiarNotificaciones(e.target.checked)}
            className="rounded"
          />
          Activar sonidos en popups de cumpleaños
        </label>
      </div>
    </div>
  );
}