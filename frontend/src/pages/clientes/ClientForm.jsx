import React, { useState } from "react";
import api from "../../api"; // Importación directa para evitar que api llegue undefined

export default function ClientForm({ onCreated, sharedLists = {} }) {
  const esferas = sharedLists?.ESFERAS || [];
  const cilindros = sharedLists?.CILINDROS || [];
  const ejes = sharedLists?.EJES || [];
  const addList = sharedLists?.ADD_LIST || [];
  const prismas = sharedLists?.PRISMAS || [];
  const dp = sharedLists?.DP || [];
  const alt = sharedLists?.ALT || [];

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    telefono: "",
    correo: "",
    direccion: "",
    observaciones: "",
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
    registrar_precio: false,
    precio: "",
    tiene_factura: false,
    numero_factura: "",
    fecha_cumpleanos: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "precio" && !formData.registrar_precio) return;
      if (key === "numero_factura" && !formData.tiene_factura) return;
      if (key === "registrar_precio") return;

      if (key === "tiene_factura") {
        body.append("tiene_factura", formData.tiene_factura ? "true" : "false");
        return;
      }

      if (formData[key] !== null && formData[key] !== "") {
        body.append(key, formData[key]);
      }
    });

    if (archivo) {
      body.append("archivo", archivo);
    }

    try {
      await api.post("/clientes/", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onCreated("¡Cliente registrado exitosamente!", "success");

      setFormData({
        nombre: "", apellido: "", documento: "", telefono: "", correo: "", direccion: "", observaciones: "",
        od_esfera: "", od_cilindro: "", od_eje: "", od_add: "", od_dp: "", od_alt: "", od_prisma: "",
        oi_esfera: "", oi_cilindro: "", oi_eje: "", oi_add: "", oi_dp: "", oi_alt: "", oi_prisma: "",
        tipo_lente: "", tratamiento_lente: "", laboratorio: "",
        registrar_precio: false, precio: "", tiene_factura: false, numero_factura: "", fecha_cumpleanos: ""
      });
      setArchivo(null);
    } catch (err) {
      console.error(err);
      const errorDetail = err.response?.data?.detail;
      const msgError = Array.isArray(errorDetail)
        ? errorDetail.map((e) => e.msg).join(", ")
        : (errorDetail || "Error al registrar cliente. Verifique los datos.");

      onCreated(msgError, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors";
  const labelStyle = "block text-[11px] font-medium text-slate-400 mb-0.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      
      {/* DATOS PERSONALES */}
      <div>
        <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
          Datos Personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <div>
            <label className={labelStyle}>Nombre *</label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Apellido *</label>
            <input required type="text" name="apellido" value={formData.apellido} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Documento</label>
            <input type="text" name="documento" value={formData.documento} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Correo</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Cumpleaños</label>
            <input type="date" name="fecha_cumpleanos" value={formData.fecha_cumpleanos} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Historia / Archivo</label>
            <input type="file" onChange={(e) => setArchivo(e.target.files[0])} className={`${inputStyle} file:mr-2 file:py-0 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-amber-500 file:text-black hover:file:bg-amber-400`} />
          </div>
        </div>
      </div>

      {/* FÓRMULA ÓPTICA */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
          Fórmula Óptica
        </h3>
        
        {/* OD */}
        <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
          <span className="text-[10px] font-bold text-amber-400 block mb-1">OJO DERECHO (OD)</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            <div>
              <label className={labelStyle}>Esfera</label>
              <select name="od_esfera" value={formData.od_esfera} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {esferas.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Cilindro</label>
              <select name="od_cilindro" value={formData.od_cilindro} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {cilindros.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Eje</label>
              <select name="od_eje" value={formData.od_eje} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {ejes.map((val) => <option key={val} value={val}>{val}°</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>ADD</label>
              <select name="od_add" value={formData.od_add} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {addList.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>DP</label>
              <select name="od_dp" value={formData.od_dp} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {dp.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>ALT</label>
              <select name="od_alt" value={formData.od_alt} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {alt.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Prisma</label>
              <select name="od_prisma" value={formData.od_prisma} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {prismas.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* OI */}
        <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
          <span className="text-[10px] font-bold text-amber-400 block mb-1">OJO IZQUIERDO (OI)</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            <div>
              <label className={labelStyle}>Esfera</label>
              <select name="oi_esfera" value={formData.oi_esfera} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {esferas.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Cilindro</label>
              <select name="oi_cilindro" value={formData.oi_cilindro} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {cilindros.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Eje</label>
              <select name="oi_eje" value={formData.oi_eje} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {ejes.map((val) => <option key={val} value={val}>{val}°</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>ADD</label>
              <select name="oi_add" value={formData.oi_add} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {addList.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>DP</label>
              <select name="oi_dp" value={formData.oi_dp} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {dp.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>ALT</label>
              <select name="oi_alt" value={formData.oi_alt} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {alt.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Prisma</label>
              <select name="oi_prisma" value={formData.oi_prisma} onChange={handleChange} className={inputStyle}>
                <option value="">-</option>
                {prismas.map((val) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LENTE Y FACTURACIÓN */}
      <div>
        <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
          Lente y Facturación
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className={labelStyle}>Tipo de Lente</label>
              <select name="tipo_lente" value={formData.tipo_lente} onChange={handleChange} className={inputStyle}>
                <option value="">Laboratorio</option>
                  <option>Monofocal</option>
                  <option>Bifocal</option>
                  <option>Progresivo</option>
                  <option>Ocupacional</option>
                  <option>Contacto</option>
              </select>
          </div>
          <div>
            <label className={labelStyle}>Tratamiento</label>
            <input type="text" name="tratamiento_lente" value={formData.tratamiento_lente} onChange={handleChange} className={inputStyle} placeholder="Ej: Antirreflejo..." />
          </div>
          <div>
            <label className={labelStyle}>Laboratorio</label>
              <select name="laboratorio" value={formData.laboratorio} onChange={handleChange} className={inputStyle}>
                <option value="">Laboratorio</option>
                <option>Essilor</option>
                <option>Hoya</option>
                <option>Zeiss</option>
                <option>Genérico</option>
                <option>Otro</option>
              </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/30 p-2.5 rounded border border-slate-800/80">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="registrar_precio"
                checked={formData.registrar_precio}
                onChange={handleChange}
                className="toggle-brand"
              />
              <span className="text-xs font-medium text-slate-300">¿Registrar Precio / Valor de Venta?</span>
            </label>

            {formData.registrar_precio && (
              <div className="pl-6 animate-fade-in-up">
                <label className={labelStyle}>Precio ($) *</label>
                <input
                  required
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Monto de la venta"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="tiene_factura"
                checked={formData.tiene_factura}
                onChange={handleChange}
                className="toggle-brand"
              />
              <span className="text-xs font-medium text-slate-300">¿Tiene Factura?</span>
            </label>

            {formData.tiene_factura && (
              <div className="pl-6 animate-fade-in-up">
                <label className={labelStyle}>Número de Factura *</label>
                <input
                  required
                  type="text"
                  name="numero_factura"
                  value={formData.numero_factura}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Ej: FAC-00123"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* OBSERVACIONES Y SUBMIT */}
      <div>
        <label className={labelStyle}>Observaciones</label>
        <textarea name="observaciones" rows="2" value={formData.observaciones} onChange={handleChange} className={inputStyle} />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors shadow-glow-amber disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>
      </div>

    </form>
  );
}