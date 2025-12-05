// src/pages/clientes/ClientForm.jsx
import React, { useState } from "react";

export default function ClientForm({ onCreated, api }) {
  const initialState = {
    nombre: "",
    apellido: "",
    documento: "",
    telefono: "",
    correo: "",
    direccion: "",
    fecha_cumpleanos: "",

    od_esfera: "",
    od_cilindro: "",
    od_eje: "",
    od_add: "",
    od_dp: "",
    od_alt: "",
    od_prisma: "",

    oi_esfera: "",
    oi_cilindro: "",
    oi_eje: "",
    oi_add: "",
    oi_dp: "",
    oi_alt: "",
    oi_prisma: "",

    observaciones: "",
    archivo: null,
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const lists = {
    ESFERAS: ["-5.00","-4.00","-3.00","-2.00","-1.00","-0.50","-0.25","0.00","+0.25","+0.50","+1.00","+2.00","+3.00","+4.00","+5.00"],
    CILINDROS: ["0.00","-0.25","-0.50","-0.75","-1.00","-1.25","-1.50","-2.00"],
    EJES: Array.from({length: 181}, (_, i) => String(i)),
    ADD_LIST: ["+0.50","+0.75","+1.00","+1.25","+1.50","+1.75","+2.00","+2.25","+2.50","+2.75","+3.00"],
    PRISMAS: ["0","0.50","1.00","1.50","2.00","3.00","4.00"],
    DP: Array.from({length: 20}, (_, i) => String(25 + i)),
    ALT: Array.from({length: 20}, (_, i) => String(10 + i)),
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));

      await api.post("/clientes/", data);

      setForm(initialState);
      onCreated();
    } catch (error) {
      console.error(error);
      alert("Error al guardar cliente");
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (label, name, list) => (
    <div className="animate-slide-left animation-delay-200">
      <label className="text-sm text-brand-dark">{label}</label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="select-modern w-full bg-neutral-900 border border-brand/10 rounded-lg px-3 py-2 mt-1" // Agregué clases para fondo oscuro y consistencia
      >
        <option value="">--</option>
        {list.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-panel p-6 rounded-lg shadow-glow-amber animate-fade-in-up backdrop-blur-sm"> {/* Agregué bg-panel para fondo uniforme */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TITULO */}
        <h2 className="text-xl font-bold mb-2 text-brand animate-pulse-amber animation-delay-100">Registrar Cliente</h2>

        {/* DATOS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-left animation-delay-300">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="input-modern" />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} className="input-modern" />
          <input name="documento" placeholder="Documento" value={form.documento} onChange={handleChange} className="input-modern" />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="input-modern" />
          <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} className="input-modern" />
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="input-modern" />

          <div>
            <label className="text-sm">Fecha de cumpleaños</label>
            <input
              type="date"
              name="fecha_cumpleanos"
              value={form.fecha_cumpleanos}
              onChange={handleChange}
              className="input-modern"
            />
          </div>
        </div>

        {/* FORMULA OD */}
        <div className="mt-4 p-4 rounded-lg border border-brand/10 bg-neutral-900/40 animate-zoom-soft animation-delay-500">
          <h3 className="font-semibold text-brand mb-2">Fórmula OD</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {renderSelect("Esfera", "od_esfera", lists.ESFERAS)}
            {renderSelect("Cilindro", "od_cilindro", lists.CILINDROS)}
            {renderSelect("Eje", "od_eje", lists.EJES)}
            {renderSelect("ADD", "od_add", lists.ADD_LIST)}
            {renderSelect("DP", "od_dp", lists.DP)}
            {renderSelect("ALT", "od_alt", lists.ALT)}
            {renderSelect("Prisma", "od_prisma", lists.PRISMAS)}
          </div>
        </div>

        {/* FORMULA OI */}
        <div className="mt-4 p-4 rounded-lg border border-brand/10 bg-neutral-900/40 animate-zoom-soft animation-delay-700">
          <h3 className="font-semibold text-brand mb-2">Fórmula OI</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {renderSelect("Esfera", "oi_esfera", lists.ESFERAS)}
            {renderSelect("Cilindro", "oi_cilindro", lists.CILINDROS)}
            {renderSelect("Eje", "oi_eje", lists.EJES)}
            {renderSelect("ADD", "oi_add", lists.ADD_LIST)}
            {renderSelect("DP", "oi_dp", lists.DP)}
            {renderSelect("ALT", "oi_alt", lists.ALT)}
            {renderSelect("Prisma", "oi_prisma", lists.PRISMAS)}
          </div>
        </div>

        {/* OBSERVACIONES */}
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
          className="input-modern h-20 animate-slide-left animation-delay-900"
        />

        {/* ARCHIVO */}
        <div className="animate-fade-in-up animation-delay-1000">
          <label className="text-sm">Archivo (opcional)</label>
          <input type="file" name="archivo" onChange={handleChange} className="input-modern" />
        </div>

        {/* BOTÓN */}
        <button
          disabled={loading}
          className="btn-primary animate-pulse-amber animation-delay-1100"
        >
          {loading ? "Guardando..." : "Registrar cliente"}
        </button>
      </form>
    </div>
  );
}
