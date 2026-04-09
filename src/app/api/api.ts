import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // ¡ESTO ES VITAL! Permite enviar cookies y cabeceras de seguridad
  withXSRFToken: true,   // Solo si usas Laravel 10.x o 11.x (maneja el token CSRF automáticamente)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Asegúrate de que las cabeceras comunes estén presentes
  config.headers['Accept'] = 'application/json';
  config.headers['Content-Type'] = 'application/json';

  return config;
});

export default api;