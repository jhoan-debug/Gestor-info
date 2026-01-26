import React, { useEffect, useState } from "react";
import api from "../api";

// componentes
import ClientForm from "./clientes/ClientForm";
import SearchModal from "./clientes/SearchModal";
import ViewModal from "./clientes/ViewModal";
import EditModal from "./clientes/EditModal";

export const sharedLists = {
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

// Vista Clientes: gestiona formulario, búsqueda y modales de clientes.
export default function Clientes() {

  const [msg, setMsg] = useState("");
  const [verCliente, setVerCliente] = useState(null);
  const [editarCliente, setEditarCliente] = useState(null);
  const [buscarModal, setBuscarModal] = useState(false);
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="p-6 text-brand animate-fade-in-up">

      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>

        <button
          onClick={() => setBuscarModal(true)}
          className="px-4 py-2 rounded-lg bg-brand text-black font-semibold shadow-glow-amber hover:bg-brand-dark transition"
        >
          Buscar cliente
        </button>
      </div>

      {/* ALERTA */}
      {msg && (
        <div className="bg-brand text-black px-4 py-2 rounded-md mb-5 animate-fade-in-up shadow-md">
          {msg}
        </div>
      )}

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-panel border border-brand/10 rounded-xl p-8 shadow-glow-amber animate-fade-in-up transition-all duration-300 w-full">
            <ClientForm
              onCreated={() => {
                flash("Cliente registrado exitosamente!");
              }}
              api={api}
              sharedLists={sharedLists}
            />
          </div>
        </div>

        {/* Removí la sección "TABLA RESULTADOS" porque ahora está en el modal */}
      </div>

      {/* MODALES */}
      {buscarModal && (
        <SearchModal
          onClose={() => setBuscarModal(false)}
          onVer={(c) => setVerCliente(c)}
          onEditar={(c) => setEditarCliente(c)}
          onEliminar={async (id) => {
            if (!confirm("¿Eliminar cliente?")) return;
            try {
              await api.delete(`/clientes/${id}`);
              flash("Cliente eliminado");
            } catch {
              flash("Error al eliminar cliente");
            }
          }}
          api={api}
          archivoUrl={(fn) => fn ? `${api.defaults.baseURL}/clientes/archivo/${fn}` : null}
          sharedLists={sharedLists}
        />
      )}

      {verCliente && (
        <ViewModal
          cliente={verCliente}
          onClose={() => setVerCliente(null)}
          archivoUrl={(fn) => fn ? `${api.defaults.baseURL}/clientes/archivo/${fn}` : null}
        />
      )}

      {editarCliente && (
        <EditModal
          cliente={editarCliente}
          onClose={() => setEditarCliente(null)}
          onSaved={() => {
            flash("✨ Cliente actualizado");
            setEditarCliente(null);
          }}
          api={api}
          sharedLists={sharedLists}
        />
      )}
    </div>
  );
}