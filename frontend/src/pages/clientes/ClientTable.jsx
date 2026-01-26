import React from "react";
import { Eye, Edit2, Trash2, Download } from "lucide-react";

/**
 * Props:
 *  - clientes: array
 *  - loading: boolean
 *  - onVer(cliente)
 *  - onEditar(cliente)
 *  - onEliminar(id)
 *  - archivoUrl(filename) => url | null
 *  - searchTerm (optional) => string (para destacar coincidencias si lo deseas)
 */
export default function ClientTable({
  clientes = [],
  loading = false,
  onVer = () => {},
  onEditar = () => {},
  onEliminar = () => {},
  archivoUrl = () => null,
  searchTerm = "",
}) {
  // helper
  const highlight = (text = "") => {
    if (!searchTerm) return text;
    const s = String(text);
    const re = new RegExp(`(${escapeRegExp(searchTerm)})`, "ig");
    const parts = s.split(re);
    return parts.map((p, i) =>
      re.test(p) ? <mark key={i} className="bg-yellow-300/20 text-brand-dark px-0.5 rounded-sm">{p}</mark> : <span key={i}>{p}</span>
    );
  };

  function escapeRegExp(string) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <div className="bg-panel border border-brand/10 rounded-lg shadow-glow-amber animate-fade-in-up overflow-auto">
      {/* responsive wrapper - ancho ajustado para eliminar barra horizontal */}
      <div className="w-full min-w-[800px]">
        {/* header row small */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-brand/8">
          <div className="text-sm text-brand-dark font-semibold">Lista de clientes</div>
          <div className="text-xs text-muted-foreground/60">{clientes.length} resultados</div>
        </div>

        {/* TABLE - cambiado a table-auto para ajuste dinámico */}
        <table className="w-full table-auto">
          <thead>
            <tr className="text-brand-dark border-b border-brand/10 text-left">
              <th className="p-4">Cliente</th> {/* Sin ancho fijo */}
              <th className="p-4 hidden sm:table-cell">Documento</th>
              <th className="p-4 hidden md:table-cell">Teléfono</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {/* loading skeleton */}
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-neutral-900/40 rounded w-3/4" /></td>
                    <td className="p-4 hidden sm:table-cell"><div className="h-4 bg-neutral-900/40 rounded w-1/2" /></td>
                    <td className="p-4 hidden md:table-cell"><div className="h-4 bg-neutral-900/40 rounded w-1/3" /></td>
                    <td className="p-4"><div className="h-4 bg-neutral-900/40 rounded w-1/4" /></td>
                  </tr>
                ))}
              </>
            )}

            {/* no results */}
            {!loading && clientes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No hay clientes. Prueba otra búsqueda o crea uno nuevo.
                </td>
              </tr>
            )}

            {/* rows */}
            {!loading && clientes.map((c) => (
              <tr
                key={c.id}
                className="border-t border-brand/5 hover:bg-neutral-900/40 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {/* avatar placeholder - más grande */}
                    <div className="h-12 w-12 rounded-md bg-neutral-900 flex items-center justify-center text-base text-brand-dark font-semibold">
                      {initials(c.nombre, c.apellido)}
                    </div>
                    <div>
                      <div className="font-semibold text-base text-brand">{highlight(fullName(c))}</div>
                      <div className="text-sm text-neutral-400 mt-0.5">{c.correo || "—"}</div>
                    </div>
                  </div>
                </td>

                <td className="p-4 hidden sm:table-cell">
                  <div className="text-sm">{highlight(c.documento)}</div>
                </td>

                <td className="p-4 hidden md:table-cell">
                  <div className="text-sm">{highlight(c.telefono)}</div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onVer(c)}
                      title="Ver"
                      className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-neutral-900/30 transition text-brand-dark"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Ver</span>
                    </button>

                    <button
                      onClick={() => onEditar(c)}
                      title="Editar"
                      className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-neutral-900/30 transition text-blue-300"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Editar</span>
                    </button>

                    <button
                      onClick={() => onEliminar(c.id)}
                      title="Eliminar"
                      className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-red-700/20 transition text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">Eliminar</span>
                    </button>

                    {c.archivo && (
                      <a
                        href={archivoUrl(c.archivo)}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir archivo"
                        className="ml-2 flex items-center gap-1 px-3 py-2 rounded-md hover:bg-neutral-900/30 transition text-brand-dark"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline text-xs">Archivo</span>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* small helpers */
function initials(nombre = "", apellido = "") {
  const n = String(nombre || "").trim().split(" ")[0] || "";
  const a = String(apellido || "").trim().split(" ")[0] || "";
  return ((n[0] || "") + (a[0] || "")).toUpperCase() || "U";
}
function fullName(c) {
  return `${c.nombre || ""} ${c.apellido || ""}`.trim();
}