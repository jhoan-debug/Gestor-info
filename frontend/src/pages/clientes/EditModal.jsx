import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const inputStyle =
  "w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand placeholder:text-brand-dark/50 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition";
const labelStyle = "block text-xs text-brand-dark mb-1";

function SectionTitle({ children }) {
  return (
    <h4 className="text-sm font-semibold text-brand border-l-2 border-brand pl-2 mb-4 uppercase tracking-wide">
      {children}
    </h4>
  );
}

export default function EditModal({ cliente, onClose, onSaved, sharedLists, api }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombre: cliente?.nombre || "",
      apellido: cliente?.apellido || "",
      documento: cliente?.documento || "",
      telefono: cliente?.telefono || "",
      correo: cliente?.correo || "",
      direccion: cliente?.direccion || "",
      fecha_cumpleanos: cliente?.fecha_cumpleanos || "",
      observaciones: cliente?.observaciones || "",
      odEsfera: cliente?.od_esfera || "",
      odCilindro: cliente?.od_cilindro || "",
      odEje: cliente?.od_eje || "",
      odAdd: cliente?.od_add || "",
      odDp: cliente?.od_dp || "",
      odAlt: cliente?.od_alt || "",
      odPrisma: cliente?.od_prisma || "",
      oiEsfera: cliente?.oi_esfera || "",
      oiCilindro: cliente?.oi_cilindro || "",
      oiEje: cliente?.oi_eje || "",
      oiAdd: cliente?.oi_add || "",
      oiDp: cliente?.oi_dp || "",
      oiAlt: cliente?.oi_alt || "",
      oiPrisma: cliente?.oi_prisma || "",
      tipoLente: cliente?.tipo_lente || "",
      tratamientoLente: cliente?.tratamiento_lente || "",
      laboratorio: cliente?.laboratorio || "",
      precio: cliente?.precio || "",
      tieneFactura: cliente?.tiene_factura || false,
      numeroFactura: cliente?.numero_factura || "",
    }
  });

  const tieneFactura = watch("tieneFactura");

  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        documento: cliente.documento || "",
        telefono: cliente.telefono || "",
        correo: cliente.correo || "",
        direccion: cliente.direccion || "",
        fecha_cumpleanos: cliente.fecha_cumpleanos || "",
        observaciones: cliente.observaciones || "",
        odEsfera: cliente.od_esfera || "",
        odCilindro: cliente.od_cilindro || "",
        odEje: cliente.od_eje || "",
        odAdd: cliente.od_add || "",
        odDp: cliente.od_dp || "",
        odAlt: cliente.od_alt || "",
        odPrisma: cliente.od_prisma || "",
        oiEsfera: cliente.oi_esfera || "",
        oiCilindro: cliente.oi_cilindro || "",
        oiEje: cliente.oi_eje || "",
        oiAdd: cliente.oi_add || "",
        oiDp: cliente.oi_dp || "",
        oiAlt: cliente.oi_alt || "",
        oiPrisma: cliente.oi_prisma || "",
        tipoLente: cliente.tipo_lente || "",
        tratamientoLente: cliente.tratamiento_lente || "",
        laboratorio: cliente.laboratorio || "",
        precio: cliente.precio || "",
        tieneFactura: cliente.tiene_factura || false,
        numeroFactura: cliente.numero_factura || "",
      });
      setPreview(cliente.archivo ? `${api.defaults.baseURL}/clientes/archivo/${cliente.archivo}` : null);
    }
  }, [cliente, reset]);

  const onSubmit = async (data) => {
    if (!window.confirm("¿Guardar cambios?")) return;
    setLoading(true);
    try {
      const fd = new FormData();

      fd.append("nombre", data.nombre || cliente.nombre || "");
      fd.append("apellido", data.apellido || cliente.apellido || "");
      fd.append("documento", data.documento || cliente.documento || "");

      Object.entries(data).forEach(([k, v]) => {
        if (["nombre", "apellido", "documento"].includes(k)) return;

        const snake = k.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
        if (v !== "" && v !== null && v !== undefined) {
          if (k === "precio" && v) {
            const num = parseInt(v, 10);
            if (!isNaN(num)) fd.append(snake, num);
          } else if (k === "tieneFactura") {
            fd.append(snake, v ? "true" : "false");
          } else {
            fd.append(snake, v);
          }
        }
      });

      if (archivo) fd.append("archivo", archivo);

      const res = await api.put(`/clientes/${cliente.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if ([200, 201].includes(res.status)) {
        onSaved && onSaved(res.data);
      } else {
        alert("Error actualizando");
      }
    } catch (err) {
      console.error("guardarEdicion:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Error desconocido";
      alert(`Error al guardar edición: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="edit-modal-title">
  <div className="modal-surface rounded-xl w-full max-w-5xl animate-fade-in-up max-h-[90vh] flex flex-col overflow-hidden border border-brand/10 shadow-glow-amber">

    {/* BARRA DE ACENTO */}
    <div className="h-[3px] w-full bg-gradient-to-r from-brand-dark via-brand to-brand-dark shrink-0" />

    {/* HEADER */}
    <div className="flex justify-between items-center px-6 py-5 border-b border-brand/10 shrink-0">
          <div>
            <h3 id="edit-modal-title" className="text-lg font-semibold text-brand">Editar cliente</h3>
            <p className="text-xs text-brand-dark mt-0.5">{cliente?.nombre} {cliente?.apellido}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-neutral-900 border border-brand/10 text-brand-dark hover:text-brand transition" aria-label="Cerrar modal">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">

            {/* Información Personal */}
            <div className="bg-neutral-800/60 p-4 rounded-lg">
              <SectionTitle>Información personal</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Nombre *</label>
                  <input {...register("nombre", { required: "Nombre es requerido" })} placeholder="Ingresa nombre" className={inputStyle} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Apellido *</label>
                  <input {...register("apellido", { required: "Apellido es requerido" })} placeholder="Ingresa apellido" className={inputStyle} />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Documento *</label>
                  <input {...register("documento")} placeholder="Ingresa documento" className={inputStyle} />
                  {errors.documento && <p className="text-red-500 text-xs mt-1">{errors.documento.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Teléfono</label>
                  <input {...register("telefono")} placeholder="Ingresa teléfono" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Correo</label>
                  <input {...register("correo", { pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })} placeholder="ejemplo@email.com" className={inputStyle} />
                  {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Dirección</label>
                  <input {...register("direccion")} placeholder="Ingresa dirección" className={inputStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyle}>Fecha de Nacimiento</label>
                  <input type="date" {...register("fecha_cumpleanos")} className={inputStyle} />
                </div>
              </div>
            </div>

            {/* Fórmula OD */}
            <div className="bg-neutral-800/60 p-4 rounded-lg">
              <SectionTitle>Fórmula Ojo Derecho (OD)</SectionTitle>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <label className={labelStyle}>Esfera</label>
                  <select {...register("odEsfera")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ESFERAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Cilindro</label>
                  <select {...register("odCilindro")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.CILINDROS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Eje</label>
                  <select {...register("odEje")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.EJES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className={labelStyle}>ADD</label>
                  <select {...register("odAdd")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ADD_LIST.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>DP</label>
                  <select {...register("odDp")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.DP.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>ALT</label>
                  <select {...register("odAlt")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ALT.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Prisma</label>
                  <select {...register("odPrisma")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.PRISMAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Fórmula OI */}
            <div className="bg-neutral-800/60 p-4 rounded-lg">
              <SectionTitle>Fórmula Ojo Izquierdo (OI)</SectionTitle>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <label className={labelStyle}>Esfera</label>
                  <select {...register("oiEsfera")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ESFERAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Cilindro</label>
                  <select {...register("oiCilindro")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.CILINDROS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Eje</label>
                  <select {...register("oiEje")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.EJES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className={labelStyle}>ADD</label>
                  <select {...register("oiAdd")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ADD_LIST.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>DP</label>
                  <select {...register("oiDp")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.DP.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>ALT</label>
                  <select {...register("oiAlt")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.ALT.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Prisma</label>
                  <select {...register("oiPrisma")} className={inputStyle}>
                    <option value="">Seleccionar</option>
                    {sharedLists.PRISMAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Datos del Lente */}
            <div className="bg-neutral-800/60 p-4 rounded-lg">
              <SectionTitle>Datos del lente</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Tipo de lente</label>
                  <select {...register("tipoLente")} className={inputStyle}>
                    <option value="">Tipo de lente</option>
                    <option value="Monofocal">Monofocal</option>
                    <option value="Bifocal">Bifocal</option>
                    <option value="Progresivo">Progresivo</option>
                    <option value="Ocupacional">Ocupacional</option>
                    <option value="Contacto">Contacto</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Laboratorio</label>
                  <select {...register("laboratorio")} className={inputStyle}>
                    <option value="">Laboratorio</option>
                    <option value="Essilor">Essilor</option>
                    <option value="Hoya">Hoya</option>
                    <option value="Zeiss">Zeiss</option>
                    <option value="Genérico">Genérico</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Tratamiento</label>
                  <input {...register("tratamientoLente")} placeholder="Ej. antirreflejo" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Precio</label>
                  <input type="number" {...register("precio", { valueAsNumber: true })} placeholder="Precio" className={inputStyle} />
                </div>
                <label className="flex items-center gap-2 text-sm text-brand bg-neutral-900 border border-brand/10 rounded-lg px-3 py-2 w-fit">
                  <input type="checkbox" {...register("tieneFactura")} className="toggle-brand" />
                  Tiene factura
                </label>
                {tieneFactura && (
                  <div>
                    <label className={labelStyle}>Número de factura</label>
                    <input {...register("numeroFactura")} placeholder="Número de factura" className={inputStyle} />
                  </div>
                )}
              </div>
            </div>

            {/* Archivo y Observaciones */}
            <div className="bg-neutral-800/60 p-4 rounded-lg">
              <SectionTitle>Archivo y observaciones</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Observaciones</label>
                  <textarea {...register("observaciones")} placeholder="Ingresa observaciones" rows="3" className={`${inputStyle} resize-none`}></textarea>
                </div>
                <div>
                  <label className={labelStyle}>Archivo (subir nuevo)</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setArchivo(f || null);
                      if (f && f.type.startsWith("image/")) setPreview(URL.createObjectURL(f));
                      else setPreview(null);
                    }}
                    accept="image/*"
                    className={`${inputStyle} file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-brand file:text-black file:text-xs file:font-semibold cursor-pointer`}
                  />
                  {preview && <img src={preview} alt="Vista previa" className="mt-2 w-20 h-20 object-cover rounded-md border border-brand/20" />}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-brand/10 shrink-0">
            <button type="button" onClick={() => reset()} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10 hover:bg-neutral-800 transition text-sm">Reset</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10 hover:bg-neutral-800 transition text-sm">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>}
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}