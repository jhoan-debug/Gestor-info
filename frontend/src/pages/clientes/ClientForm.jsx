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

    tipo_lente: "",
    tratamiento_lente: "",
    laboratorio: "",
    precio: "",
    tiene_factura: false,
    numero_factura: "",

    observaciones: "",
    archivo: null,
  };

function normalizeDate(fechaStr) {
  if (!fechaStr) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    return fechaStr;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
    const [dia, mes, año] = fechaStr.split("/");
    return `${año}-${mes}-${dia}`;
  }

  return null;
}


  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const lists = {
    ESFERAS: [
    "-20.00","-19.75","-19.50","-19.25","-19.00","-18.75","-18.50","-18.25",
    "-18.00","-17.75","-17.50","-17.25","-17.00","-16.75","-16.50","-16.25",
    "-16.00","-15.75","-15.50","-15.25","-15.00","-14.75","-14.50","-14.25",
    "-14.00","-13.75","-13.50","-13.25","-13.00","-12.75","-12.50","-12.25",
    "-12.00","-11.75","-11.50","-11.25","-11.00","-10.75","-10.50","-10.25",
    "-10.00","-9.75","-9.50","-9.25","-9.00","-8.75","-8.50","-8.25",
    "-8.00","-7.75","-7.50","-7.25","-7.00","-6.75","-6.50","-6.25",
    "-6.00","-5.75","-5.50","-5.25","-5.00","-4.75","-4.50","-4.25",
    "-4.00","-3.75","-3.50","-3.25","-3.00","-2.75","-2.50","-2.25",
    "-2.00","-1.75","-1.50","-1.25","-1.00","-0.75","-0.50","-0.25",
    "0.00",
    "+0.25","+0.50","+0.75","+1.00","+1.25","+1.50","+1.75","+2.00",
    "+2.25","+2.50","+2.75","+3.00","+3.25","+3.50","+3.75","+4.00",
    "+4.25","+4.50","+4.75","+5.00","+5.25","+5.50","+5.75","+6.00",
    "+6.25","+6.50","+6.75","+7.00","+7.25","+7.50","+7.75","+8.00",
    "+8.25","+8.50","+8.75","+9.00","+9.25","+9.50","+9.75","+10.00",
    "+10.25","+10.50","+10.75","+11.00","+11.25","+11.50","+11.75","+12.00",
    "+12.25","+12.50","+12.75","+13.00","+13.25","+13.50","+13.75","+14.00",
    "+14.25","+14.50","+14.75","+15.00","+15.25","+15.50","+15.75","+16.00",
    "+16.25","+16.50","+16.75","+17.00","+17.25","+17.50","+17.75","+18.00",
    "+18.25","+18.50","+18.75","+19.00","+19.25","+19.50","+19.75","+20.00"
  ],

  CILINDROS: [
    "6.00","5.75","5.50","5.25","5.00","4.75","4.50","4.25", "4.00",
    "3.75","3.50","3.25","3.00","2.75","2.50","2.25","2.00",
    "1.75","1.50","1.25","1.00","0.75","0.50","0.25",
    "0.00",
    "-0.25","-0.50","-0.75","-1.00","-1.25","-1.50","-1.75",
    "-2.00","-2.25","-2.50","-2.75","-3.00","-3.25","-3.50","-3.75",
    "-4.00","-4.25","-4.50","-4.75","-5.00","-5.25","-5.50","-5.75","-6.00"
  ],

  EJES: Array.from({ length: 180 }, (_, i) => String(i + 1)),

  ADD_LIST: [
    "+0.75","+1.00","+1.25","+1.50","+1.75","+2.00",
    "+2.25","+2.50","+2.75","+3.00","+3.25","+3.50"
  ],

  PRISMAS: [
    "0.25","0.50","0.75","1.00","1.25","1.50","1.75","2.00","2.25","2.50",
    "2.75","3.00","3.25","3.50","3.75","4.00","4.25","4.50","4.75","5.00",
    "5.25","5.50","5.75","6.00","6.25","6.50","6.75","7.00","7.25","7.50",
    "7.75","8.00","8.25","8.50","8.75","9.00","9.25","9.50","9.75","10.00"
  ],

  DP: Array.from({ length: 13 }, (_, i) => String(26 + i)),
  ALT: Array.from({ length: 21 }, (_, i) => String(10 + i)),
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const payload = {
  ...form,
  precio: form.precio ? Number(form.precio) : null,
  numero_factura: form.tiene_factura ? form.numero_factura : null
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      // NO envia si esta vacio
      if (v === null || v === undefined || v === "") return;

      // archivo si es file
      if (k === "archivo") {
        if (v instanceof File) {
          data.append(k, v);
        }
        return;
      }

      data.append(k, v);
    });

    // Debugging
    console.log("¿Es FormData?", data instanceof FormData);
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1], typeof pair[1]);
    }

    await api.post("/clientes/", data);

    setForm(initialState);
    onCreated();
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DETAIL:", error.response?.data?.detail);
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

        {/* DATOS DEL LENTE */}
<div className="card p-6 mt-6 fade-up">
  <h3 className="text-lg font-semibold text-brand mb-4">
    Datos del lente
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <select
      className="input-modern"
      value={form.tipo_lente || ""}
      onChange={e => setForm({ ...form, tipo_lente: e.target.value })}
    >
      <option value="">Tipo de lente</option>
      <option>Monofocal</option>
      <option>Bifocal</option>
      <option>Progresivo</option>
      <option>Ocupacional</option>
      <option>Contacto</option>
    </select>

    <select
      className="input-modern"
      value={form.laboratorio || ""}
      onChange={e => setForm({ ...form, laboratorio: e.target.value })}
    >
      <option value="">Laboratorio</option>
      <option>Essilor</option>
      <option>Hoya</option>
      <option>Zeiss</option>
      <option>Genérico</option>
      <option>Otro</option>
    </select>
  </div>

  <input
    className="input-modern mt-4"
    placeholder="Tratamiento del lente (antirreflejo, blue light, etc.)"
    value={form.tratamiento_lente || ""}
    onChange={e => setForm({ ...form, tratamiento_lente: e.target.value })}
  />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <input
      type="number"
      className="input-modern"
      placeholder="Precio"
      value={form.precio || ""}
      onChange={e => setForm({ ...form, precio: e.target.value })}
    />

    <label className="flex items-center gap-2 text-sm text-brand">
      <input
        type="checkbox"
        checked={form.tiene_factura || false}
        onChange={e =>
          setForm({
            ...form,
            tiene_factura: e.target.checked,
            numero_factura: e.target.checked ? form.numero_factura : ""
          })
        }
      />
      Tiene factura
    </label>
  </div>

  {form.tiene_factura && (
    <input
      className="input-modern mt-4 animate-fade-in-up"
      placeholder="Número de factura"
      value={form.numero_factura || ""}
      onChange={e => setForm({ ...form, numero_factura: e.target.value })}
    />
  )}
</div>
      

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
