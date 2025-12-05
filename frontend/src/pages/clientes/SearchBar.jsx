// src/pages/clientes/SearchModal.jsx
import React from "react";

export default function SearchModal({ busqueda, setBusqueda, onBuscar, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-panel border border-brand/10 rounded-xl p-6 w-full max-w-xl shadow-glow-amber animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 animate-slide-left animation-delay-100"> {/* Agregué animación con retraso y aumenté mb para mejor espaciado */}
          <h2 className="text-xl font-semibold text-brand">Buscar cliente</h2>
          <button
            onClick={onClose}
            className="text-brand-dark hover:text-brand transition animate-pulse-amber animation-delay-200" // Agregué animación sutil
          >
            ✕
          </button>
        </div>

        {/* INPUT */}
        <div className="animate-slide-left animation-delay-300"> {/* Envolví en div para animación */}
          <input
            type="text"
            placeholder="Buscar por nombre, documento o teléfono..."
            className="input-modern w-full" // Cambié a input-modern para estilo consistente
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-6 animate-slide-left animation-delay-500"> {/* Agregué animación con retraso y aumenté gap/mt para coherencia */}
          <button
            onClick={onClose}
            className="btn-outline" // Cambié a btn-outline para estilo UI
          >
            Cancelar
          </button>
          <button
            onClick={() => { onBuscar(); onClose(); }}
            className="btn-primary" // Cambié a btn-primary para estilo UI
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
