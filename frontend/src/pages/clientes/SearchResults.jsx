import React from "react";

export default function SearchResults({ clientes }) {
  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-brand-dark mt-6 animate-fade-in-up bg-panel p-4 rounded-lg border border-brand/10 shadow-glow-amber text-center">
        No hay resultados para mostrar
      </div>
    );
  }

  return (
    <div className="mt-6 bg-panel border border-brand/10 rounded-lg p-4 shadow-glow-amber animate-fade-in-up">
      <h3 className="text-brand-dark text-lg mb-3 font-semibold">
        Resultados de la búsqueda
      </h3>

      <div className="flex flex-col gap-3">
        {clientes.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition border border-brand/5 animate-slide-left"
          >
            <p className="text-brand font-semibold text-lg">
              {c.nombre} {c.apellido}
            </p>
            <p className="text-brand-dark text-sm">Documento: {c.documento}</p>
            <p className="text-brand-dark text-sm">Teléfono: {c.telefono}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
