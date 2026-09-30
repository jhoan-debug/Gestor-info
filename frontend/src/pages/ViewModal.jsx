import React, { useState } from "react";

function InfoField({ label, value, onCopy }) {
  return (
    <div className="group bg-neutral-800/60 hover:bg-neutral-800 border border-transparent hover:border-brand/10 p-3 rounded-lg transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-brand-dark/80">{label}</p>
          <p className="text-sm text-brand truncate">{value ?? "N/A"}</p>
        </div>
        {onCopy && (
          <button
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-brand-dark hover:text-brand shrink-0"
            aria-label={`Copiar ${label}`}
          >
            📋
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-brand border-l-2 border-brand pl-2 mb-3 uppercase tracking-wide">
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </h4>
  );
}

function Chip({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-neutral-900 border-brand/10 text-brand-dark",
    brand: "bg-brand/10 border-brand/30 text-brand",
    success: "bg-emerald-950/60 border-emerald-500/30 text-emerald-300",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default function ViewModal({ cliente, onClose, archivoUrl, onEdit, onNext, onPrev }) {
  const [copiedMsg, setCopiedMsg] = useState("");

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text ?? "");
    setCopiedMsg(`${label} copiado`);
    setTimeout(() => setCopiedMsg(""), 1500);
  };

  const iniciales = `${cliente.nombre?.[0] ?? ""}${cliente.apellido?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="view-modal-title"
    >
      <div className="modal-surface rounded-xl w-full max-w-5xl animate-fade-in-up max-h-[90vh] flex flex-col overflow-hidden border border-brand/10 shadow-glow-amber">

        {/* BARRA DE ACENTO */}
        <div className="h-[3px] w-full bg-gradient-to-r from-brand-dark via-brand to-brand-dark shrink-0" />

        {/* HEADER */}
        <div className="flex justify-between items-center gap-4 px-6 py-5 border-b border-brand/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-semibold shrink-0">
              {iniciales || "?"}
            </div>
            <div className="min-w-0">
              <h3 id="view-modal-title" className="text-lg font-semibold text-brand truncate">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <p className="text-xs text-brand-dark truncate">
                Doc. {cliente.documento ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onPrev && (
              <button
                onClick={onPrev}
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-brand/10 text-brand hover:bg-neutral-800 transition"
                aria-label="Cliente anterior"
              >
                ◀
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-brand/10 text-brand hover:bg-neutral-800 transition"
                aria-label="Cliente siguiente"
              >
                ▶
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-brand/10 text-brand-dark hover:text-brand transition ml-1"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CHIPS DE DATOS RAPIDOS */}
        {(cliente.tipo_lente || cliente.laboratorio || cliente.precio) && (
          <div className="flex flex-wrap gap-2 px-6 pt-4 shrink-0">
            {cliente.tipo_lente && <Chip tone="brand">👓 {cliente.tipo_lente}</Chip>}
            {cliente.laboratorio && <Chip>🧪 {cliente.laboratorio}</Chip>}
            {cliente.precio && <Chip tone="brand">💲 {cliente.precio}</Chip>}
            <Chip tone={cliente.tiene_factura ? "success" : "neutral"}>
              {cliente.tiene_factura ? "✔ Con factura" : "Sin factura"}
            </Chip>
          </div>
        )}

        {/* TOAST DE COPIADO */}
        {copiedMsg && (
          <div className="mx-6 mt-4 bg-brand text-black text-xs font-medium px-3 py-1.5 rounded-md w-fit animate-fade-in-up shrink-0">
            {copiedMsg}
          </div>
        )}

        {/* BODY */}
        <div className="px-6 py-5 overflow-y-auto space-y-5">

          {/* Informacion Personal */}
          <div>
            <SectionTitle icon="👤">Información personal</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoField label="Documento" value={cliente.documento} onCopy={() => copyToClipboard(cliente.documento, "Documento")} />
              <InfoField label="Teléfono" value={cliente.telefono} onCopy={() => copyToClipboard(cliente.telefono, "Teléfono")} />
              <InfoField label="Correo" value={cliente.correo} onCopy={() => copyToClipboard(cliente.correo, "Correo")} />
              <InfoField label="Dirección" value={cliente.direccion} onCopy={() => copyToClipboard(cliente.direccion, "Dirección")} />
              <div className="md:col-span-2">
                <InfoField
                  label="Fecha de nacimiento"
                  value={cliente.fecha_cumpleanos ? new Date(cliente.fecha_cumpleanos).toLocaleDateString() : null}
                />
              </div>
            </div>
          </div>

          {/* Formulas Opticas */}
          <div>
            <SectionTitle icon="🔍">Fórmulas ópticas</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-neutral-800/60 p-3 rounded-lg border border-transparent hover:border-brand/10 transition-colors">
                <p className="text-xs font-semibold text-brand mb-2">Ojo Derecho (OD)</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Esfera</p>
                    <p className="text-sm text-brand">{cliente.od_esfera ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Cilindro</p>
                    <p className="text-sm text-brand">{cliente.od_cilindro ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Eje</p>
                    <p className="text-sm text-brand">{cliente.od_eje ?? "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-brand/5">
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">ADD</p>
                    <p className="text-xs text-brand-dark">{cliente.od_add ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">DP</p>
                    <p className="text-xs text-brand-dark">{cliente.od_dp ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">ALT</p>
                    <p className="text-xs text-brand-dark">{cliente.od_alt ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Prisma</p>
                    <p className="text-xs text-brand-dark">{cliente.od_prisma ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/60 p-3 rounded-lg border border-transparent hover:border-brand/10 transition-colors">
                <p className="text-xs font-semibold text-brand mb-2">Ojo Izquierdo (OI)</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Esfera</p>
                    <p className="text-sm text-brand">{cliente.oi_esfera ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Cilindro</p>
                    <p className="text-sm text-brand">{cliente.oi_cilindro ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Eje</p>
                    <p className="text-sm text-brand">{cliente.oi_eje ?? "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-brand/5">
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">ADD</p>
                    <p className="text-xs text-brand-dark">{cliente.oi_add ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">DP</p>
                    <p className="text-xs text-brand-dark">{cliente.oi_dp ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">ALT</p>
                    <p className="text-xs text-brand-dark">{cliente.oi_alt ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-dark/80 uppercase">Prisma</p>
                    <p className="text-xs text-brand-dark">{cliente.oi_prisma ?? "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Datos del Lente */}
          <div>
            <SectionTitle icon="🧪">Datos del lente</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoField label="Tipo de lente" value={cliente.tipo_lente} />
              <InfoField label="Laboratorio" value={cliente.laboratorio} />
              <div className="md:col-span-2">
                <InfoField label="Tratamiento" value={cliente.tratamiento_lente} />
              </div>
              <InfoField label="Precio" value={cliente.precio ? `$${cliente.precio}` : null} />
              <div className="bg-neutral-800/60 p-3 rounded-lg flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-brand-dark/80">Factura</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    cliente.tiene_factura
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : "bg-neutral-900 text-brand-dark border border-brand/10"
                  }`}
                >
                  {cliente.tiene_factura ? "Sí" : "No"}
                </span>
              </div>
              {cliente.tiene_factura && (
                <div className="md:col-span-2">
                  <InfoField
                    label="Número de factura"
                    value={cliente.numero_factura}
                    onCopy={() => copyToClipboard(cliente.numero_factura, "N.º de factura")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {cliente.observaciones && (
            <div>
              <SectionTitle icon="📝">Observaciones</SectionTitle>
              <div className="bg-neutral-800/60 p-3 rounded-lg text-sm text-brand whitespace-pre-wrap">
                {cliente.observaciones}
              </div>
            </div>
          )}

          {/* Archivo */}
          {cliente.archivo && (
            <div>
              <SectionTitle icon="📎">Archivo</SectionTitle>
              <a
                className="inline-flex items-center gap-2 bg-neutral-800/60 hover:bg-neutral-800 border border-transparent hover:border-brand/10 px-3 py-2 rounded-lg text-brand hover:underline transition-colors text-sm"
                href={archivoUrl(cliente.archivo)}
                target="_blank"
                rel="noreferrer"
              >
                📎 Ver / descargar archivo
              </a>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-brand/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10 hover:bg-neutral-800 transition text-sm"
          >
            Cerrar
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark transition text-sm"
            >
              ✏️ Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
