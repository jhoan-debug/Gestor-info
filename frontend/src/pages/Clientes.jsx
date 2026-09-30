import React, { useState } from "react";
import api from "../api";

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

export default function Clientes() {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [verCliente, setVerCliente] = useState(null);
  const [editarCliente, setEditarCliente] = useState(null);
  const [buscarModal, setBuscarModal] = useState(false);
  const [searchRefresh, setSearchRefresh] = useState(null);

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  return (
    <div className="p-6 text-brand animate-fade-in-up relative">

      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 border ${
            toast.type === "error"
              ? "bg-red-950/90 border-red-500/50 text-red-200"
              : "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
          }`}
        >
          <span className="text-lg">
            {toast.type === "error" ? "⚠️" : "✨"}
          </span>
          <p className="text-xs font-medium pr-2">{toast.message}</p>
        </div>
      )}

      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>

        <button
          onClick={() => setBuscarModal(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold shadow-glow-amber hover:bg-amber-400 transition text-xs"
        >
          Buscar cliente
        </button>
      </div>

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-panel border border-brand/10 rounded-xl p-6 shadow-glow-amber transition-all duration-300 w-full">
            <ClientForm
              onCreated={(msg, type) => showNotification(msg, type)}
              sharedLists={sharedLists}
            />
          </div>
        </div>
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
              showNotification("Cliente eliminado con éxito", "success");

              // Si el cliente eliminado estaba abierto en "ver", lo cerramos
              if (verCliente?.id === id) setVerCliente(null);

              // Avisamos al SearchModal para que lo quite de su lista
              setSearchRefresh({ type: "delete", id, ts: Date.now() });
            } catch {
              showNotification("Error al eliminar el cliente", "error");
            }
          }}
          api={api}
          archivoUrl={(fn) => fn ? `${api.defaults.baseURL}/clientes/archivo/${fn}` : null}
          sharedLists={sharedLists}
          refreshSignal={searchRefresh} // 👈 le pasamos la señal
        />
      )}

      {verCliente && (
        <ViewModal
          cliente={verCliente}
          onClose={() => setVerCliente(null)}
          archivoUrl={(fn) => fn ? `${api.defaults.baseURL}/clientes/archivo/${fn}` : null}
          onEdit={() => setEditarCliente(verCliente)}
        />
      )}

      {editarCliente && (
        <EditModal
          cliente={editarCliente}
          onClose={() => setEditarCliente(null)}
          onSaved={async (clienteActualizado) => {
            showNotification("Cliente actualizado exitosamente", "success");

            let clienteFinal = clienteActualizado;

            // Fallback si EditModal no devuelve el objeto actualizado
            if (!clienteFinal) {
              try {
                const res = await api.get(`/clientes/${editarCliente.id}`);
                clienteFinal = res.data;
              } catch {
                clienteFinal = null;
              }
            }

            // Actualiza el ViewModal si está mostrando este cliente
            if (clienteFinal && verCliente?.id === editarCliente.id) {
              setVerCliente(clienteFinal);
            }

            // Avisa al SearchModal para que actualice esa fila
            if (clienteFinal) {
              setSearchRefresh({ type: "update", cliente: clienteFinal, ts: Date.now() });
            }

            setEditarCliente(null);
          }}
          api={api}
          sharedLists={sharedLists}
        />
      )}
    </div>
  );
}