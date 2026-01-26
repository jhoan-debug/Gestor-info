import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from "../api";

// Configuración: exportación/importación y ajustes de la aplicación.
export default function Configuracion() {
  const [clientes, setClientes] = useState([]);
  const [cumpleanos, setCumpleanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [tema, setTema] = useState(localStorage.getItem("tema") || "claro");
  const [notificaciones, setNotificaciones] = useState(localStorage.getItem("notificaciones") === "true");

  useEffect(() => {
    fetchDatos();
    // Aplicar el tema inicial al cargar el componente
    aplicarTema(tema);
  }, []);

  // Función para aplicar el tema globalmente
  const aplicarTema = (nuevoTema) => {
  const temasValidos = ["claro", "oscuro", "dorado"];
  if (!temasValidos.includes(nuevoTema)) {
    console.warn(`Tema inválido: ${nuevoTema}. Usando 'dorado' por defecto.`);
    nuevoTema = "dorado";
  }
  // Cambia a document.body para mayor compatibilidad
  document.body.className = `theme-${nuevoTema}`;
};

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
    aplicarTema(nuevoTema); // Aplica el cambio inmediatamente
  };

  // Cambiar notificaciones
  const cambiarNotificaciones = (valor) => {
    setNotificaciones(valor);
    localStorage.setItem("notificaciones", valor);
  };

  // Exportar PDF con todos los campos
  const exportarPDF = async () => {
  try {
    // Carga dinámica de jsPDF
    const { default: jsPDF } = await import('jspdf');
    // Carga dinámica de jsPDF-AutoTable
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.text("Lista de Clientes", 10, 10);
    
    const tableColumn = [
      "Nombre", "Apellido", "Documento", "Teléfono", "Correo", "Dirección", "Fecha de Cumpleaños",
      "OD Esfera", "OD Cilindro", "OD Eje", "OD Add", "OD DP", "OD Alt", "OD Prisma",
      "OI Esfera", "OI Cilindro", "OI Eje", "OI Add", "OI DP", "OI Alt", "OI Prisma",
      "Observaciones", "Archivo"
    ];
    const tableRows = clientes.map(c => [
      c.nombre || "",
      c.apellido || "",
      c.documento || "",
      c.telefono || "",
      c.correo || "",
      c.direccion || "",
      c.fecha_cumpleanos || "",
      
      c.od_esfera || "",
      c.od_cilindro || "",
      c.od_eje || "",
      c.od_add || "",
      c.od_dp || "",
      c.od_alt || "",
      c.od_prisma || "",
      
      c.oi_esfera || "",
      c.oi_cilindro || "",
      c.oi_eje || "",
      c.oi_add || "",
      c.oi_dp || "",
      c.oi_alt || "",
      c.oi_prisma || "",
      
      c.observaciones || "",
      c.archivo ? c.archivo.toString() : "",
    ]);
    
    // Usa autoTable con el doc cargado dinámicamente
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 6 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.save("clientes.pdf");
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Error al generar el PDF. Revisa la consola para más detalles.");
  }
};

  // Exportar CSV de clientes (manual)
  const exportarCSVClientes = () => {
    const headers = [
      "Nombre", "Apellido", "Documento", "Teléfono", "Correo", "Dirección", "Fecha de Cumpleaños",
      "OD Esfera", "OD Cilindro", "OD Eje", "OD Add", "OD DP", "OD Alt", "OD Prisma",
      "OI Esfera", "OI Cilindro", "OI Eje", "OI Add", "OI DP", "OI Alt", "OI Prisma",
      "Observaciones", "Archivo"
    ];
    const rows = clientes.map(c => [
      c.nombre || "",
      c.apellido || "",
      c.documento || "",
      c.telefono || "",
      c.correo || "",
      c.direccion || "",
      c.fecha_cumpleanos || "",
      
      c.od_esfera || "",
      c.od_cilindro || "",
      c.od_eje || "",
      c.od_add || "",
      c.od_dp || "",
      c.od_alt || "",
      c.od_prisma || "",
      
      c.oi_esfera || "",
      c.oi_cilindro || "",
      c.oi_eje || "",
      c.oi_add || "",
      c.oi_dp || "",
      c.oi_alt || "",
      c.oi_prisma || "",
      
      c.observaciones || "",
      c.archivo ? c.archivo.toString() : "",
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  
  // Sincronizar a Supabase
  const sincronizarSupabase = async () => {
    setSyncStatus("Sincronizando...");
    try {
      const response = await api.post('/config/sync-to-supabase', clientes);
      setSyncStatus(response.data.message || "¡Datos sincronizados a Supabase exitosamente!");
    } catch (err) {
      console.error("Error exportando:", err);
      setSyncStatus(`Error al exportar: ${err.response?.data?.error || err.message}`);
    }
  };

  // Importar desde Supabase
  const importarDesdeSupabase = async () => {
  setSyncStatus("Importando...");
  try {
    // Obtener datos de Supabase
    const response = await api.get('/config/import-from-supabase');
    const clientesImportados = response.data.clientes;
    
    // Actualizar el estado local (para mostrarlos inmediatamente en la UI)
    setClientes(clientesImportados);
    
    // Enviar los datos importados a tu backend local para guardarlos en la DB local
    await api.post('/config/sync-to-local-db', { clientes: clientesImportados });
    
    // Opcional: Recargar los datos locales para confirmar que se guardaron
    await fetchDatos();
    
    setSyncStatus("¡Datos importados desde Supabase y guardados localmente exitosamente!");
  } catch (err) {
    console.error("Error importando:", err);
    setSyncStatus(`Error al importar: ${err.response?.data?.error || err.message}`);
  }
};

  return (
    <div className="p-6 text-brand animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {loading && <p className="text-center animate-pulse">Cargando datos...</p>}

      {/* EXPORTAR DATOS */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Exportar Datos</h2>
        <p className="text-brand-dark mb-4">Descarga listas en CSV o genera un PDF simple.</p>
        <div className="flex gap-4 flex-wrap">
          <button onClick={exportarCSVClientes} className="btn-primary px-4 py-2 rounded-lg">Exportar Clientes CSV</button>
          
          <button onClick={exportarPDF} className="btn-primary px-4 py-2 rounded-lg">Exportar Clientes PDF</button>
        </div>
      </div>

      {/* CONECTAR A SUPABASE */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Sincronizar a la Nube</h2>
        <p className="text-brand-dark mb-4">Sincroniza tus datos locales a la nube para backup o acceso remoto, o importa desde la nube.</p>
        <div className="flex gap-4 flex-wrap">
          <button onClick={sincronizarSupabase} className="btn-primary px-4 py-2 rounded-lg" disabled={loading}>
            Sincronizar Datos a la nube
          </button>
          <button onClick={importarDesdeSupabase} className="btn-secondary px-4 py-2 rounded-lg" disabled={loading}>
            Sincronizar Datos desde la nube
          </button>
        </div>
        {syncStatus && <p className="mt-2 text-sm text-brand">{syncStatus}</p>}
      </div>

      {/* TEMA */}
      <div className="bg-panel border border-brand/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Tema de la App</h2>
        <p className="text-brand-dark mb-4">Elige el modo visual o tono de la página.</p>
        <select 
          value={tema} 
          onChange={e => cambiarTema(e.target.value)} 
          className="p-2 rounded border border-brand/20 bg-panel text-brand"
        >
          <option value="claro">Modo Claro</option>
          <option value="oscuro">Modo Oscuro</option>
          <option value="dorado">Modo Dorado (Fondo negro, letras doradas)</option> {/* Nueva opción */}
        </select>
        <p className="mt-2 text-sm text-green-600">Tema actual: {tema}</p> {/* Feedback visual */}
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