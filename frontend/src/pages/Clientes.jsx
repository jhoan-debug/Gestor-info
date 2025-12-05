// src/pages/Clientes.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

// componentes
import ClientForm from "./clientes/ClientForm";
import SearchModal from "./clientes/SearchModal";
import ViewModal from "./clientes/ViewModal";
import EditModal from "./clientes/EditModal";

export const sharedLists = {
  ESFERAS: ["-8.00","-7.50","-7.00","-6.50","-6.00","-5.50","-5.00","-4.50","-4.00","-3.50","-3.00","-2.50",
            "-2.00","-1.75","-1.50","-1.25","-1.00","-0.75","-0.50","-0.25",
            "0.00","+0.25","+0.50","+0.75","+1.00","+1.25","+1.50","+1.75","+2.00","+2.25","+2.50","+3.00"
  ],
  CILINDROS: ["0.00","-0.25","-0.50","-0.75","-1.00","-1.25","-1.50","-1.75","-2.00"],
  EJES: Array.from({ length: 181 }, (_, i) => String(i)),
  ADD_LIST: ["+0.50","+0.75","+1.00","+1.25","+1.50","+1.75","+2.00","+2.25","+2.50","+2.75","+3.00"],
  PRISMAS: ["0","0.50","1.00","1.50","2.00","2.50","3.00","3.50","4.00"],
  DP: Array.from({ length: 14 }, (_, i) => String(25 + i)),
  ALT: Array.from({ length: 21 }, (_, i) => String(10 + i)),
};

export default function Clientes() {
  // Estados para modales y alertas globales (removí busqueda, loading, clientes ya que se mueven al modal)
  const [msg, setMsg] = useState("");

  // modales
  const [verCliente, setVerCliente] = useState(null);
  const [editarCliente, setEditarCliente] = useState(null);
  const [buscarModal, setBuscarModal] = useState(false);

  // Función para alertas
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
                flash("✅ Cliente registrado correctamente");
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