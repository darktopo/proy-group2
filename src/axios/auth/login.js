import axiosInstance from '../users/axiosInstance';

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(
      '/auth/login',
      { email, password },
      { withCredentials: true } // 🔥 esto asegura que las cookies se guarden
    );

    console.log('Respuesta completa del backend:', response.data);

    if (response.data.status === 'success') {
      // 💡 Ya no guardamos token manualmente, porque está en cookie HttpOnly
      return true;
    } else {
      throw new Error('Login fallido.');
    }
  } catch (error) {
    if (error.response?.data?.message) {
      console.error('Error en el login:', error.response.data.message);
      throw new Error(error.response.data.message);
    }
    console.error('Error en el login:', error);
    throw new Error('Error al iniciar sesión. Verifica tu conexión o intenta nuevamente.');
  }
};
