import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
      fechaNacimiento: cliente?.fecha_cumpleanos || "",
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
      // Campos nuevos del lente
      tipoLente: cliente?.tipo_lente || "",
      tratamientoLente: cliente?.tratamiento_lente || "",
      laboratorio: cliente?.laboratorio || "",
      precio: cliente?.precio || "",
      tieneFactura: cliente?.tiene_factura || false,
      numeroFactura: cliente?.numero_factura || "",
    }
  });

  const tieneFactura = watch("tieneFactura"); // Para mostrar/ocultar numeroFactura

  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        documento: cliente.documento || "",
        telefono: cliente.telefono || "",
        correo: cliente.correo || "",
        direccion: cliente.direccion || "",
        fechaNacimiento: cliente.fecha_cumpleanos || "",
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
        // Campos nuevos
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
    
    // Campos requeridos: Siempre enviar desde el cliente (para edición, usa los valores existentes si no cambian)
    fd.append("nombre", data.nombre || cliente.nombre || "");
    fd.append("apellido", data.apellido || cliente.apellido || "");
    fd.append("documento", data.documento || cliente.documento || "");
    
    // Campos opcionales: Enviar solo si no vacíos y válidos
    Object.entries(data).forEach(([k, v]) => {
      if (["nombre", "apellido", "documento"].includes(k)) return; // Ya enviados arriba
      
      const snake = k.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
      if (v !== "" && v !== null && v !== undefined && !isNaN(v)) {
        // Conversiones de tipos
        if (k === "precio" && v) {
          const num = parseInt(v, 10);
          if (!isNaN(num)) fd.append(snake, num);
        } else if (k === "tieneFactura") {
          fd.append(snake, v ? "true" : "false");
        } else if (["odEsfera", "odCilindro", "odEje", "odAdd", "odDp", "odAlt", "oiEsfera", "oiCilindro", "oiEje", "oiAdd", "oiDp", "oiAlt"].includes(k) && v) {
          const num = parseFloat(v);
          if (!isNaN(num)) fd.append(snake, num);
        } else {
          fd.append(snake, v);
        }
      }
    });
    if (archivo) fd.append("archivo", archivo);

    console.log("Datos enviados:", Object.fromEntries(fd.entries()));

    const res = await api.put(`/clientes/${cliente.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    if ([200, 201].includes(res.status)) {
      onSaved && onSaved();
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-labelledby="edit-modal-title">
      <div className="bg-panel p-6 rounded-xl w-full max-w-5xl animate-fade-in-up overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 id="edit-modal-title" className="text-xl font-semibold">Editar cliente</h3>
          <button onClick={onClose} className="text-brand-dark hover:text-brand" aria-label="Cerrar modal">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Información Personal */}
          <div className="bg-neutral-800 p-4 rounded-lg animate-fade-in-up">
            <h4 className="text-md font-medium mb-4 text-brand">Información Personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brand-dark mb-1">Nombre *</label>
                <input {...register("nombre", { required: "Nombre es requerido" })} placeholder="Ingresa nombre" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Apellido *</label>
                <input {...register("apellido", { required: "Apellido es requerido" })} placeholder="Ingresa apellido" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Documento *</label>
                <input {...register("documento", { required: "Documento es requerido" })} placeholder="Ingresa documento" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
                {errors.documento && <p className="text-red-500 text-sm mt-1">{errors.documento.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Teléfono</label>
                <input {...register("telefono")} placeholder="Ingresa teléfono" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Correo</label>
                <input {...register("correo", { pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })} placeholder="ejemplo@email.com" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
                {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Dirección</label>
                <input {...register("direccion")} placeholder="Ingresa dirección" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-brand-dark mb-1">Fecha de Nacimiento</label>
                <input type="date" {...register("fechaNacimiento")} className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              </div>
            </div>
          </div>

          {/* Sección: Fórmulas Ópticas OD */}
          <div className="bg-neutral-800 p-4 rounded-lg animate-fade-in-up">
            <h4 className="text-md font-medium mb-4 text-brand">Fórmula Ojo Derecho (OD)</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <label className="block text-xs text-brand-dark mb-1">Esfera</label>
                <select {...register("odEsfera")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ESFERAS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Cilindro</label>
                <select {...register("odCilindro")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.CILINDROS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Eje</label>
                <select {...register("odEje")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.EJES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-brand-dark mb-1">ADD</label>
                <select {...register("odAdd")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ADD_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">DP</label>
                <select {...register("odDp")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.DP.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">ALT</label>
                <select {...register("odAlt")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ALT.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Prisma</label>
                <select {...register("odPrisma")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.PRISMAS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Fórmulas Ópticas OI */}
          <div className="bg-neutral-800 p-4 rounded-lg animate-fade-in-up">
            <h4 className="text-md font-medium mb-4 text-brand">Fórmula Ojo Izquierdo (OI)</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <label className="block text-xs text-brand-dark mb-1">Esfera</label>
                <select {...register("oiEsfera")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ESFERAS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Cilindro</label>
                <select {...register("oiCilindro")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.CILINDROS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Eje</label>
                <select {...register("oiEje")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.EJES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-brand-dark mb-1">ADD</label>
                <select {...register("oiAdd")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ADD_LIST.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">DP</label>
                <select {...register("oiDp")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.DP.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">ALT</label>
                <select {...register("oiAlt")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.ALT.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-dark mb-1">Prisma</label>
                <select {...register("oiPrisma")} className="w-full px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Seleccionar</option>
                  {sharedLists.PRISMAS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>


          {/* Sección: Datos del Lente */}
          <div className="bg-neutral-800 p-4 rounded-lg animate-fade-in-up">
            <h4 className="text-md font-medium mb-4 text-brand">Datos del Lente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select {...register("tipoLente")} className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                <option value="">Tipo de lente</option>
                <option value="Monofocal">Monofocal</option>
                <option value="Bifocal">Bifocal</option>
                <option value="Progresivo">Progresivo</option>
                <option value="Ocupacional">Ocupacional</option>
                <option value="Contacto">Contacto</option>
              </select>
              <select {...register("laboratorio")} className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                <option value="">Laboratorio</option>
                <option value="Essilor">Essilor</option>
                <option value="Hoya">Hoya</option>
                <option value="Zeiss">Zeiss</option>
                <option value="Genérico">Genérico</option>
                <option value="Otro">Otro</option>
              </select>
              <input {...register("tratamientoLente")} placeholder="Tratamiento del lente (ej. antirreflejo)" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              <input type="number" {...register("precio", { valueAsNumber: true })} placeholder="Precio" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              <label className="flex items-center gap-2 text-sm text-brand">
                <input type="checkbox" {...register("tieneFactura")} className="accent-brand" />
                Tiene factura
              </label>
              {tieneFactura && (
                <input {...register("numeroFactura")} placeholder="Número de factura" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
              )}
            </div>
          </div>
          
          {/* Sección: Archivo y Observaciones */}
          <div className="bg-neutral-800 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-4">Archivo y Observaciones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brand-dark mb-1">Observaciones</label>
                <textarea {...register("observaciones")} placeholder="Ingresa observaciones" rows="3" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm text-brand-dark mb-1">Archivo (subir nuevo)</label>
                <input type="file" onChange={(e) => { const f = e.target.files?.[0]; setArchivo(f || null); if (f && f.type.startsWith("image/")) setPreview(URL.createObjectURL(f)); else setPreview(null); }} accept="image/*" className="w-full px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
                {preview && <img src={preview} alt="Vista previa" className="mt-2 w-20 h-20 object-cover rounded-md border" />}
              </div>
            </div>
          </div>

          

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => reset()} className="px-4 py-2 rounded-lg bg-neutral-700 text-brand border border-brand/10">Reset</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark transition">{loading ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}