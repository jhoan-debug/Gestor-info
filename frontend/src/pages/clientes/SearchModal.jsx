import React, { useState, useEffect } from "react";
import ClientTable from "./ClientTable";

export default function SearchModal({
  onClose,
  onVer,
  onEditar,
  onEliminar,
  api,
  archivoUrl,
  refreshSignal,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!refreshSignal) return;

    if (refreshSignal.type === "delete") {
      setResultados((prev) => prev.filter((c) => c.id !== refreshSignal.id));
    }

    if (refreshSignal.type === "update" && refreshSignal.cliente) {
      setResultados((prev) =>
        prev.map((c) => (c.id === refreshSignal.cliente.id ? refreshSignal.cliente : c))
      );
    }
  }, [refreshSignal]);

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      try {
        setLoading(true);
        const res = await api.get("/clientes/");
        setResultados(Array.isArray(res.data) ? res.data : []);
        setHasSearched(true);
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
        params: { nombre: busqueda, apellido: busqueda, documento: busqueda, telefono: busqueda },
      });
      setResultados(Array.isArray(res.data) ? res.data : []);
      setHasSearched(true);
    } catch {
      flash("No se encontraron resultados");
      setResultados([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setBusqueda("");
    setResultados([]);
    setHasSearched(false);
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up p-4">
      <div className="bg-panel border border-brand/10 rounded-xl w-full max-w-4xl shadow-glow-amber animate-fade-in-up max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-brand/10">
          <div>
            <h2 className="text-xl font-semibold text-brand">Buscar cliente</h2>
            <p className="text-xs text-brand-dark mt-0.5">
              Buscá por nombre, documento o teléfono
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-dark hover:text-brand transition text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          {/* ALERTA */}
          {msg && (
            <div className="bg-brand text-black px-4 py-2 rounded-md mb-4 animate-fade-in-up shadow-md text-sm font-medium">
              {msg}
            </div>
          )}

          {/* BUSCADOR */}
          <div className="flex gap-2 mb-5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark text-sm pointer-events-none">
                
              </span>
              <input
                type="text"
                placeholder="Nombre, documento o teléfono..."
                className="input-modern w-full pl-9 pr-9"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              />
              {busqueda && (
                <button
                  onClick={handleLimpiar}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark hover:text-brand text-xs"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleBuscar}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark transition text-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {/* CONTADOR DE RESULTADOS */}
          {hasSearched && !loading && (
            <p className="text-xs text-brand-dark mb-3">
              {resultados.length === 0
                ? "Sin resultados"
                : `${resultados.length} cliente${resultados.length === 1 ? "" : "s"} encontrado${resultados.length === 1 ? "" : "s"}`}
            </p>
          )}

          {/* ESTADOS */}
          {loading && (
            <div className="flex items-center justify-center py-10 text-brand-dark text-sm gap-2">
              <span className="animate-pulse">Cargando clientes...</span>
            </div>
          )}

          {!loading && hasSearched && resultados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-brand-dark text-sm gap-1">
              <span className="text-2xl mb-1"></span>
              <span>No se encontraron clientes</span>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="flex flex-col items-center justify-center py-10 text-brand-dark text-sm gap-1">
              <span className="text-2xl mb-1"></span>
              <span>Escribí algo y presioná "Buscar", o buscá vacío para ver todos</span>
            </div>
          )}

          {/* RESULTADOS */}
          {!loading && resultados.length > 0 && (
            <ClientTable
              clientes={resultados}
              loading={loading}
              onVer={onVer}
              onEditar={onEditar}
              onEliminar={onEliminar}
              archivoUrl={archivoUrl}
              searchTerm={busqueda}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-brand/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10 text-sm hover:bg-neutral-800 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}