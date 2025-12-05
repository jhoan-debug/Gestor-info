// src/pages/clientes/SearchModal.jsx
import React, { useState } from "react";
import ClientTable from "./ClientTable"; // Importa ClientTable aquí

export default function SearchModal({
  onClose,
  onVer,      // Callback para ver cliente
  onEditar,   // Callback para editar cliente
  onEliminar, // Callback para eliminar cliente
  api,        // Para hacer la búsqueda
  archivoUrl, // Función para URLs de archivos
  sharedLists // Si lo necesitas para algo, pero probablemente no aquí
}) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(""); // Para mensajes de error/flash

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      // Si no hay búsqueda, carga todos los clientes
      try {
        setLoading(true);
        const res = await api.get("/clientes/");
        setResultados(Array.isArray(res.data) ? res.data : []);
      } catch {
        flash("⚠️ Error al cargar clientes");
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/clientes/buscar", {
        params: { nombre: busqueda, documento: busqueda, telefono: busqueda },
      });
      setResultados(Array.isArray(res.data) ? res.data : []);
    } catch {
      flash("No se encontraron resultados");
    } finally {
      setLoading(false);
    }
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-panel border border-brand/10 rounded-xl p-6 w-full max-w-4xl shadow-glow-amber animate-fade-in-up max-h-[90vh] overflow-y-auto"> {/* Aumenté el ancho y agregué scroll para la tabla */}

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-brand">Buscar cliente</h2>
          <button
            onClick={onClose}
            className="text-brand-dark hover:text-brand transition"
          >
            ✕
          </button>
        </div>

        {/* ALERTA */}
        {msg && (
          <div className="bg-brand text-black px-4 py-2 rounded-md mb-5 animate-fade-in-up shadow-md">
            {msg}
          </div>
        )}

        {/* INPUT */}
        <input
          type="text"
          placeholder="Buscar por nombre, documento o teléfono..."
          className="input-modern w-full mb-4"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()} // Opcional: buscar al presionar Enter
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mb-6">
          <button onClick={onClose} className="btn-outline">
            Cerrar
          </button>
          <button onClick={handleBuscar} className="btn-primary">
            Buscar
          </button>
        </div>

        {/* RESULTADOS: Usa ClientTable aquí */}
        <ClientTable
          clientes={resultados}
          loading={loading}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
          archivoUrl={archivoUrl}
          searchTerm={busqueda} // Para resaltar coincidencias en ClientTable
        />

      </div>
    </div>
  );
}