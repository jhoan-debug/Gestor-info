import React, { useEffect } from "react";

// Muestra popup de cumpleaños próximos y reproduce sonido si aplica.
export default function BirthdayPopup({ birthdays, onClose }) {
  useEffect(() => {
    // reproducir sonido solo si hay cumpleaños
    if (birthdays.length > 0) {
      const audio = new Audio("/sounds/notify.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  }, [birthdays]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up p-4"
      role="dialog"
      aria-labelledby="birthday-popup-title"
    >
      <div className="modal-surface border border-brand/20 rounded-xl w-full max-w-sm shadow-glow-amber animate-slide-left overflow-hidden">

        {/* BARRA DE ACENTO */}
        <div className="h-[3px] w-full bg-gradient-to-r from-brand-dark via-brand to-brand-dark" />

        {/* HEADER */}
        <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
          <span className="text-xl">🎂</span>
          <div>
            <h2 id="birthday-popup-title" className="text-sm font-semibold text-brand uppercase tracking-wide">
              Cumpleaños próximos
            </h2>
            <p className="text-[11px] text-brand-dark">
              {birthdays.length === 0
                ? "Nada por ahora"
                : `${birthdays.length} cliente${birthdays.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="px-5 pb-2 max-h-72 overflow-y-auto">
          {birthdays.length === 0 ? (
            <p className="text-brand-dark text-xs text-center py-6">
              No hay cumpleaños dentro de los próximos días.
            </p>
          ) : (
            <div className="space-y-2">
              {birthdays.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg border border-transparent hover:border-brand/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-xs font-semibold shrink-0">
                    {`${b.nombre?.[0] ?? ""}${b.apellido?.[0] ?? ""}`.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-brand text-sm font-medium truncate">
                      {b.nombre} {b.apellido}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      b.dias === 0
                        ? "bg-brand/10 border-brand/30 text-brand"
                        : "bg-neutral-900 border-brand/10 text-brand-dark"
                    }`}
                  >
                    {b.dias === 0 ? "¡Hoy! 🎉" : `En ${b.dias} día${b.dias === 1 ? "" : "s"}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-5 py-4 border-t border-brand/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand text-black text-xs font-semibold hover:bg-brand-dark transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}