import { useState } from "react";

// --> Este componente muestra el acceso al sistema.
// --> Aquí se validan las credenciales básicas del usuario (admin y clave).

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  // --> Función que valida si el usuario y la clave son correctos.
  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === "admin" && clave === "124") {
      onLogin(); // --> Si son correctos, entra al panel principal.
    } else {
      setError("Credenciales incorrectas."); // --> Muestra error si no coinciden.
    }
  };

  // --> Interfaz del formulario de inicio de sesión.
  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h2>Acceso al Gestor de Óptica </h2>
      <form onSubmit={handleLogin} style={{ display: "inline-block" }}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <br />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;