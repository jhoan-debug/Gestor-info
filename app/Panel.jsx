import { useState } from "react";
import api from "./api";

// --> Este componente representa el panel principal del sistema.
// --> Aquí se pueden registrar y buscar clientes dentro del gestor.

function Panel({ onLogout }) {
  // --> Estados para guardar la información temporal mientras el usuario escribe.
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  // --> Función que se ejecuta al registrar un nuevo cliente.
  const registrarCliente = async (e) => {
    e.preventDefault();
    try {
      // --> Envía los datos al backend para crear el cliente.
      await api.post("/clientes/", { nombre, apellido, documento, telefono });
      alert("Cliente registrado exitosamente");

      // --> Limpia los campos después del registro.
      setNombre("");
      setApellido("");
      setDocumento("");
      setTelefono("");
    } catch (error) {
      alert("Error al registrar cliente..");
    }
  };

  // --> Permite buscar clientes por nombre, documento o teléfono.
  const buscarClientes = async () => {
    try {
      const API_URL = "http://127.0.0.1:8000";, {
        params: { nombre: busqueda, documento: busqueda, telefono: busqueda },
      };
      setClientes(response.data); // --> Guarda los resultados en el estado.
    } catch (error) {
      console.error("Error al buscar:", error);
      setClientes([]); // --> Limpia la lista si hay error.
    }
  };

  // --> Interfaz principal: muestra formulario de registro y búsqueda.
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
      <button
        onClick={onLogout} // --> Cierra la sesión y vuelve al login.
        style={{
          float: "right",
          background: "#f44",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Cerrar sesión
      </button>

      <h1>DEMO: Gestor de Óptica </h1>

      {/* --> Formulario para registrar nuevos clientes */}
      <form onSubmit={registrarCliente} style={{ marginBottom: "2rem" }}>
        <h2>Registrar Cliente</h2>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        <input placeholder="Documento" value={documento} onChange={(e) => setDocumento(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <button type="submit">Registrar</button>
      </form>

      {/* --> Sección para buscar clientes registrados */}
      <h2>Buscar Cliente</h2>
      <input
        placeholder="Buscar por nombre, documento o teléfono"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <button onClick={buscarClientes}>Buscar</button>

      {/* --> Muestra los resultados de la búsqueda */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Resultados:</h3>
        {clientes.length > 0 ? (
          <ul>
            {clientes.map((c) => (
              <li key={c.id}>
                <strong>{c.nombre} {c.apellido}</strong> — {c.documento} — {c.telefono}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray" }}>No se encontraron clientes</p>
        )}
      </div>
    </div>
  );
}

export default Panel;