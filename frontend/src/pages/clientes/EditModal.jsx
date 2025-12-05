// src/pages/clientes/EditModal.jsx
import React, { useState, useEffect } from "react";

export default function EditModal({ cliente, onClose, onSaved, sharedLists, api }) {
  const [form, setForm] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if (cliente) {
      setForm({
        nombre: cliente.nombre || "", apellido: cliente.apellido || "", documento: cliente.documento || "",
        telefono: cliente.telefono || "", correo: cliente.correo || "", direccion: cliente.direccion || "", observaciones: cliente.observaciones || "",
        fechaNacimiento: cliente.fecha_cumpleanos || "",
        odEsfera: cliente.od_esfera || "", odCilindro: cliente.od_cilindro || "", odEje: cliente.od_eje || "", odAdd: cliente.od_add || "", odDp: cliente.od_dp || "", odAlt: cliente.od_alt || "", odPrisma: cliente.od_prisma || "",
        oiEsfera: cliente.oi_esfera || "", oiCilindro: cliente.oi_cilindro || "", oiEje: cliente.oi_eje || "", oiAdd: cliente.oi_add || "", oiDp: cliente.oi_dp || "", oiAlt: cliente.oi_alt || "", oiPrisma: cliente.oi_prisma || "",
      });
      setPreview(cliente.archivo ? `${api.defaults.baseURL}/clientes/archivo/${cliente.archivo}` : null);
    }
  }, [cliente]);

  const setField = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>{
        const snake = k.replace(/[A-Z]/g, m => "_"+m.toLowerCase());
        if (v !== "") fd.append(snake, v);
      });
      if (archivo) fd.append("archivo", archivo);

      const res = await api.put(`/clientes/${cliente.id}`, fd, { headers: { "Content-Type":"multipart/form-data" }});
      if ([200,201].includes(res.status)) {
        onSaved && onSaved();
      } else {
        alert("Error actualizando");
      }
    } catch (err) {
      console.error("guardarEdicion:", err);
      alert("Error al guardar edición");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-panel p-6 rounded-xl w-full max-w-3xl animate-fade-in-up overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Editar cliente</h3>
          <button onClick={onClose} className="text-brand-dark hover:text-brand">Cerrar</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.nombre} onChange={e=>setField("nombre", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
            <input value={form.apellido} onChange={e=>setField("apellido", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
            <input value={form.documento} onChange={e=>setField("documento", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
            <input value={form.telefono} onChange={e=>setField("telefono", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
            <input value={form.correo} onChange={e=>setField("correo", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
            <input value={form.direccion} onChange={e=>setField("direccion", e.target.value)} className="px-3 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand" />
          </div>

          {/* OD/OI sections - keep concise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="text-sm text-brand-dark mb-1">Fórmula OD</div>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.odEsfera} onChange={e=>setField("odEsfera", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Esfera</option>
                  {sharedLists.ESFERAS.map(v=> <option key={v}>{v}</option>)}
                </select>
                <select value={form.odCilindro} onChange={e=>setField("odCilindro", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Cilindro</option>
                  {sharedLists.CILINDROS.map(v=> <option key={v}>{v}</option>)}
                </select>
                <select value={form.odEje} onChange={e=>setField("odEje", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Eje</option>
                  {sharedLists.EJES.map(v=> <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <select value={form.odAdd} onChange={e=>setField("odAdd", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">ADD</option>{sharedLists.ADD_LIST.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.odDp} onChange={e=>setField("odDp", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">DP</option>{sharedLists.DP.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.odAlt} onChange={e=>setField("odAlt", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">ALT</option>{sharedLists.ALT.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.odPrisma} onChange={e=>setField("odPrisma", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">Prisma</option>{sharedLists.PRISMAS.map(v=> <option key={v}>{v}</option>)}</select>
              </div>
            </div>

            <div>
              <div className="text-sm text-brand-dark mb-1">Fórmula OI</div>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.oiEsfera} onChange={e=>setField("oiEsfera", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Esfera</option>
                  {sharedLists.ESFERAS.map(v=> <option key={v}>{v}</option>)}
                </select>
                <select value={form.oiCilindro} onChange={e=>setField("oiCilindro", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Cilindro</option>
                  {sharedLists.CILINDROS.map(v=> <option key={v}>{v}</option>)}
                </select>
                <select value={form.oiEje} onChange={e=>setField("oiEje", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand">
                  <option value="">Eje</option>
                  {sharedLists.EJES.map(v=> <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <select value={form.oiAdd} onChange={e=>setField("oiAdd", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">ADD</option>{sharedLists.ADD_LIST.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.oiDp} onChange={e=>setField("oiDp", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">DP</option>{sharedLists.DP.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.oiAlt} onChange={e=>setField("oiAlt", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">ALT</option>{sharedLists.ALT.map(v=> <option key={v}>{v}</option>)}</select>
                <select value={form.oiPrisma} onChange={e=>setField("oiPrisma", e.target.value)} className="px-2 py-2 bg-neutral-900 border border-brand/20 rounded-lg text-brand"><option value="">Prisma</option>{sharedLists.PRISMAS.map(v=> <option key={v}>{v}</option>)}</select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center mt-2">
            <div className="flex-1">
              <label className="text-sm text-brand-dark">Archivo (subir nuevo)</label>
              <input type="file" onChange={(e)=>{ const f = e.target.files?.[0]; setArchivo(f||null); if (f && f.type.startsWith("image/")) setPreview(URL.createObjectURL(f)); else setPreview(null); }} />
            </div>
            {preview && <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-md" />}
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-900 text-brand border border-brand/10">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-black font-semibold hover:bg-brand-dark">{loading ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
