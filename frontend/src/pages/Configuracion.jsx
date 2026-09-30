import React, { useState, useEffect } from "react";
import api from "../api";

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-panel border border-brand/10 p-4 rounded-xl shadow-lg mb-4">
      <h2 className="text-xs font-semibold text-brand border-l-2 border-brand pl-2 mb-1 uppercase tracking-wide">
        {title}
      </h2>
      {description && <p className="text-brand-dark text-xs mb-3">{description}</p>}
      {children}
    </div>
  );
}

export default function Configuracion() {
  const [clientes, setClientes] = useState([]);
  const [cumpleanos, setCumpleanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [tema, setTema] = useState(localStorage.getItem("tema") || "dorado");
  const [notificaciones, setNotificaciones] = useState(localStorage.getItem("notificaciones") === "true");

  useEffect(() => {
    fetchDatos();
    aplicarTema(tema);
  }, []);

  const aplicarTema = (nuevoTema) => {
    const temasValidos = ["claro", "oscuro", "dorado"];
    if (!temasValidos.includes(nuevoTema)) {
      console.warn(`Tema inválido: ${nuevoTema}. Usando 'dorado' por defecto.`);
      nuevoTema = "dorado";
    }
    document.body.className = `theme-${nuevoTema}`;
  };

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const resClientes = await api.get("/clientes/");
      const resCumpleanos = await api.get("/clientes/cumpleanos-proximos");
      setClientes(resClientes.data);
      setCumpleanos(resCumpleanos.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarTema = (nuevoTema) => {
    setTema(nuevoTema);
    localStorage.setItem("tema", nuevoTema);
    aplicarTema(nuevoTema);
  };

  const cambiarNotificaciones = (valor) => {
    setNotificaciones(valor);
    localStorage.setItem("notificaciones", valor);
  };

  const exportarPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
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
        c.nombre || "", c.apellido || "", c.documento || "", c.telefono || "", c.correo || "",
        c.direccion || "", c.fecha_cumpleanos || "",
        c.od_esfera || "", c.od_cilindro || "", c.od_eje || "", c.od_add || "", c.od_dp || "", c.od_alt || "", c.od_prisma || "",
        c.oi_esfera || "", c.oi_cilindro || "", c.oi_eje || "", c.oi_add || "", c.oi_dp || "", c.oi_alt || "", c.oi_prisma || "",
        c.observaciones || "", c.archivo ? c.archivo.toString() : "",
      ]);

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

  const exportarCSVClientes = () => {
    const headers = [
      "Nombre", "Apellido", "Documento", "Teléfono", "Correo", "Dirección", "Fecha de Cumpleaños",
      "OD Esfera", "OD Cilindro", "OD Eje", "OD Add", "OD DP", "OD Alt", "OD Prisma",
      "OI Esfera", "OI Cilindro", "OI Eje", "OI Add", "OI DP", "OI Alt", "OI Prisma",
      "Observaciones", "Archivo"
    ];
    const rows = clientes.map(c => [
      c.nombre || "", c.apellido || "", c.documento || "", c.telefono || "", c.correo || "",
      c.direccion || "", c.fecha_cumpleanos || "",
      c.od_esfera || "", c.od_cilindro || "", c.od_eje || "", c.od_add || "", c.od_dp || "", c.od_alt || "", c.od_prisma || "",
      c.oi_esfera || "", c.oi_cilindro || "", c.oi_eje || "", c.oi_add || "", c.oi_dp || "", c.oi_alt || "", c.oi_prisma || "",
      c.observaciones || "", c.archivo ? c.archivo.toString() : "",
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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

  const importarDesdeSupabase = async () => {
    setSyncStatus("Importando...");
    try {
      const response = await api.get('/config/import-from-supabase');
      const clientesImportados = response.data.clientes;
      setClientes(clientesImportados);
      await api.post('/config/sync-to-local-db', { clientes: clientesImportados });
      await fetchDatos();
      setSyncStatus("¡Datos importados desde Supabase y guardados localmente exitosamente!");
    } catch (err) {
      console.error("Error importando:", err);
      setSyncStatus(`Error al importar: ${err.response?.data?.error || err.message}`);
    }
  };

  const temas = [
    { id: "claro", label: "☀️ Claro" },
    { id: "oscuro", label: "🌙 Oscuro" },
    { id: "dorado", label: "✨ Dorado" },
  ];

  return (
    <div className="p-4 text-brand animate-fade-in-up">
      <h1 className="text-xl font-bold mb-4">Configuración</h1>

      {loading && <p className="text-center animate-pulse text-xs mb-3">Cargando datos...</p>}

      <SectionCard title="Apariencia" description="Elegí el tema visual del sistema.">
        <div className="flex gap-2 flex-wrap">
          {temas.map(t => (
            <button
              key={t.id}
              onClick={() => cambiarTema(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                tema === t.id
                  ? "bg-brand text-black border-brand"
                  : "bg-neutral-900 text-brand-dark border-brand/10 hover:border-brand/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Exportar datos" description="Descargá listas en CSV o generá un PDF simple.">
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportarCSVClientes} className="bg-brand text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-dark transition">
            Exportar Clientes CSV
          </button>
          <button onClick={exportarPDF} className="bg-brand text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-dark transition">
            Exportar Clientes PDF
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Sincronizar a la nube" description="Sincronizá tus datos locales a la nube para backup o acceso remoto, o importá desde la nube.">
        <div className="flex gap-2 flex-wrap">
          <button onClick={sincronizarSupabase} disabled={loading} className="bg-brand text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-dark transition disabled:opacity-50">
            Sincronizar a la nube
          </button>
          <button onClick={importarDesdeSupabase} disabled={loading} className="bg-neutral-900 text-brand border border-brand/10 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 transition disabled:opacity-50">
            Sincronizar desde la nube
          </button>
        </div>
        {syncStatus && <p className="mt-2 text-xs text-brand-dark">{syncStatus}</p>}
      </SectionCard>

      <SectionCard title="Notificaciones" description="Configurá alertas.">
        <label className="flex items-center gap-2 text-xs cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={notificaciones}
            onChange={e => cambiarNotificaciones(e.target.checked)}
            className="toggle-brand"
          />
          Activar sonidos en popups de cumpleaños
        </label>
      </SectionCard>
    </div>
  );
}