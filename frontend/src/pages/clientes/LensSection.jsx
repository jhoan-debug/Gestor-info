export default function LensSection({ form, setForm }) {
  return (
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
        placeholder="Tratamiento del lente"
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
  );
}