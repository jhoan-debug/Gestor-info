// Cliente Axios: configuración base para llamadas al backend.
// - Usa este módulo para centralizar la URL base y opciones de axios.
// - Cambia `baseURL` por la dirección de tu API (o usa variables de entorno).
// - Si usas Docker / despliegue, asegura que la URL apunte al contenedor/host correcto.
import axios from "axios";

const api = axios.create({
  // Recomendación: mover a una variable de entorno en producción (ej. import.meta.env.VITE_API_URL)
  baseURL: "http://127.0.0.1:8000",
  // Timeout razonable para evitar requests colgados en el cliente
  timeout: 15000,
});

// Ejemplos de uso:
// import api from './api';
// const res = await api.get('/clientes');

export default api;