import axios from 'axios';

// Asegúrate de obtener el token desde el almacenamiento local o desde donde lo estés guardando
const token = localStorage.getItem('authToken');  // O bien, desde las cookies, si lo guardas ahí

const axiosInstance = axios.create({
  baseURL: 'https://www.hs-service.api.crealape.com/api/v1', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',  // Si el token existe, lo agrega al encabezado
  },
  withCredentials: true,  // Esto es importante si el servidor usa cookies de sesión
});

// Los interceptores también deben incluir el token en las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');  // Obtén el token cada vez que la solicitud se realice
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Añadir token al encabezado Authorization
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar las respuestas de error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request: Token is missing or invalid');
      // Aquí puedes redirigir al usuario al login o manejar el error de la manera que necesites
      // Por ejemplo:
      window.location.href = '/login'; // Redirigir a la página de login si no está autenticado
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
