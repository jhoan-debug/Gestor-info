import React from "react";

export default function ViewModal({ cliente, onClose, archivoUrl, onEdit, onNext, onPrev }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-labelledby="view-modal-title">
      <div className="bg-panel p-6 rounded-xl w-full max-w-5xl animate-fade-in-up"> {/* Tamaño aumentado para igualar EditModal */}
        <div className="flex justify-between items-center mb-4">
          <h3 id="view-modal-title" className="text-xl font-semibold">{cliente.nombre} {cliente.apellido}</h3>
          <div className="flex gap-2">
            {onPrev && <button onClick={onPrev} className="text-brand hover:text-brand-dark" aria-label="Cliente anterior">◀</button>}
            {onNext && <button onClick={onNext} className="text-brand hover:text-brand-dark" aria-label="Cliente siguiente">▶</button>}
            <button onClick={onClose} className="text-brand-dark hover:text-brand" aria-label="Cerrar modal">✕</button>
          </div>
        </div>

        {/* Sección: Información Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm animate-fade-in-up">
          <div className="bg-neutral-800 p-3 rounded-lg">
            <strong>Documento:</strong> {cliente.documento ?? "N/A"} <button onClick={() => copyToClipboard(cliente.documento ?? "N/A")} className="ml-2 text-xs text-brand">Copiar</button>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg">
            <strong>Teléfono:</strong> {cliente.telefono ?? "N/A"} <button onClick={() => copyToClipboard(cliente.telefono ?? "N/A")} className="ml-2 text-xs text-brand">Copiar</button>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg">
            <strong>Correo:</strong> {cliente.correo ?? "N/A"} <button onClick={() => copyToClipboard(cliente.correo ?? "N/A")} className="ml-2 text-xs text-brand">Copiar</button>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg">
            <strong>Dirección:</strong> {cliente.direccion ?? "N/A"} <button onClick={() => copyToClipboard(cliente.direccion ?? "N/A")} className="ml-2 text-xs text-brand">Copiar</button>
          </div>
          <div className="md:col-span-2 bg-neutral-800 p-3 rounded-lg">
            <strong>Fecha de Nacimiento:</strong> {cliente.fecha_cumpleanos ? new Date(cliente.fecha_cumpleanos).toLocaleDateString() : "N/A"}
          </div>
        </div>

        {/* Sección: Fórmulas Ópticas */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          <div className="bg-neutral-800 p-3 rounded-lg">
            <h4 className="font-medium mb-2 text-brand">Fórmula OD</h4>
            <div className="text-brand-dark text-sm">
              Esfera: {cliente.od_esfera ?? "N/A"} | Cilindro: {cliente.od_cilindro ?? "N/A"} | Eje: {cliente.od_eje ?? "N/A"}<br />
              ADD: {cliente.od_add ?? "N/A"} | DP: {cliente.od_dp ?? "N/A"} | ALT: {cliente.od_alt ?? "N/A"} | Prisma: {cliente.od_prisma ?? "N/A"}
            </div>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg">
            <h4 className="font-medium mb-2 text-brand">Fórmula OI</h4>
            <div className="text-brand-dark text-sm">
              Esfera: {cliente.oi_esfera ?? "N/A"} | Cilindro: {cliente.oi_cilindro ?? "N/A"} | Eje: {cliente.oi_eje ?? "N/A"}<br />
              ADD: {cliente.oi_add ?? "N/A"} | DP: {cliente.oi_dp ?? "N/A"} | ALT: {cliente.oi_alt ?? "N/A"} | Prisma: {cliente.oi_prisma ?? "N/A"}
            </div>
          </div>
        </div>

        {/* Sección: Datos del Lente */}
        <div className="mt-4 bg-neutral-800 p-3 rounded-lg animate-fade-in-up">
          <h4 className="font-medium mb-2 text-brand">Datos del Lente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Tipo de Lente:</strong> {cliente.tipo_lente ?? "N/A"}</div>
            <div><strong>Laboratorio:</strong> {cliente.laboratorio ?? "N/A"}</div>
            <div className="md:col-span-2"><strong>Tratamiento:</strong> {cliente.tratamiento_lente ?? "N/A"}</div>
            <div><strong>Precio:</strong> {cliente.precio ? `$${cliente.precio}` : "N/A"}</div>
            <div><strong>Tiene Factura:</strong> {cliente.tiene_factura ? "Sí" : "No"}</div>
            {cliente.tiene_factura && (
              <div className="md:col-span-2"><strong>Número de Factura:</strong> {cliente.numero_factura ?? "N/A"} <button onClick={() => copyToClipboard(cliente.numero_factura ?? "N/A")} className="ml-2 text-xs text-brand">Copiar</button></div>
            )}
          </div>
        </div>

        {/* Observaciones */}
        {cliente.observaciones && (
          <div className="mt-4 bg-neutral-800 p-3 rounded-lg animate-fade-in-up">
            <strong>Observaciones:</strong> {cliente.observaciones}
          </div>
        )}

        {/* Archivo */}
        {cliente.archivo && (
          <div className="mt-4 bg-neutral-800 p-3 rounded-lg animate-fade-in-up">
            <a className="text-brand hover:underline" href={archivoUrl(cliente.archivo)} target="_blank" rel="noreferrer">📎 Ver / descargar archivo</a>
          </div>
        )}

        {/* Botones */}
        <div className="mt-4 flex gap-2 justify-end animate-fade-in-up">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10">Cerrar</button>
          {onEdit && <button onClick={onEdit} className="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark transition">Editar</button>}
        </div>
      </div>
    </div>
  );
}