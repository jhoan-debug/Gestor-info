import React, { useEffect } from "react";

export default function BirthdayPopup({ birthdays, onClose }) {
  useEffect(() => {
    // reproducir sonido solo si hay cumpleaños
    if (birthdays.length > 0) {
      const audio = new Audio("/sounds/notify.mp3");
      audio.volume = 0.4;
      audio.play();
    }
  }, [birthdays]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-panel border border-brand/20 rounded-xl p-6 w-full max-w-md shadow-glow-amber animate-slide-left">

        <h2 className="text-2xl font-bold text-brand flex items-center gap-3 mb-4">
          🎉 Cumpleaños próximos
        </h2>

        {birthdays.length === 0 ? (
          <p className="text-brand-dark">No hay cumpleaños dentro de los próximos días.</p>
        ) : (
          <div className="space-y-3">
            {birthdays.map((b, idx) => (
              <div key={idx} className="p-3 bg-neutral-900/40 rounded-lg border border-brand/10">
                <p className="text-brand font-semibold">
                  {b.nombre} {b.apellido}
                </p>
                <p className="text-brand-dark text-sm">
                  En {b.dias} día(s)
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
