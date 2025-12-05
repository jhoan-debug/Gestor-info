// src/pages/clientes/ViewModal.jsx
import React from "react";

export default function ViewModal({ cliente, onClose, archivoUrl }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-panel p-6 rounded-xl w-full max-w-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{cliente.nombre} {cliente.apellido}</h3>
          <button onClick={onClose} className="text-brand-dark hover:text-brand">Cerrar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><strong>Documento:</strong> {cliente.documento}</div>
          <div><strong>Tel:</strong> {cliente.telefono}</div>
          <div><strong>Correo:</strong> {cliente.correo}</div>
          <div><strong>Dirección:</strong> {cliente.direccion}</div>
          <div className="md:col-span-2">
            <strong>Fórmula OD:</strong>
            <div className="text-brand-dark">
              {cliente.od_esfera ?? ""} {cliente.od_cilindro ?? ""} {cliente.od_eje ?? ""} — ADD:{cliente.od_add ?? ""} DP:{cliente.od_dp ?? ""} ALT:{cliente.od_alt ?? ""} PR:{cliente.od_prisma ?? ""}
            </div>
          </div>
          <div className="md:col-span-2">
            <strong>Fórmula OI:</strong>
            <div className="text-brand-dark">
              {cliente.oi_esfera ?? ""} {cliente.oi_cilindro ?? ""} {cliente.oi_eje ?? ""} — ADD:{cliente.oi_add ?? ""} DP:{cliente.oi_dp ?? ""} ALT:{cliente.oi_alt ?? ""} PR:{cliente.oi_prisma ?? ""}
            </div>
          </div>
          {cliente.observaciones && <div className="md:col-span-2"><strong>Observaciones:</strong> {cliente.observaciones}</div>}
        </div>

        {cliente.archivo && (
          <div className="mt-4">
            <a className="text-brand hover:underline" href={archivoUrl(cliente.archivo)} target="_blank" rel="noreferrer">Ver / descargar archivo</a>
          </div>
        )}

        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
