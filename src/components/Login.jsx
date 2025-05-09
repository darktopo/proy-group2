import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas react-router para la navegación
import { login } from '../axios/auth/login'; // Importa la función login desde el archivo auth/login.js
import { CircularProgress } from '@mui/material'; // Importa CircularProgress para el indicador de carga

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar si el email tiene el formato correcto
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingrese un email válido.');
      return;
    }

    // Validar si la contraseña tiene al menos 6 caracteres
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(''); // Limpiar cualquier error previo

    try {
      // Intentamos iniciar sesión con las credenciales
      const token = await login(email, password);

      // Si el login es exitoso, guarda el token en localStorage
      localStorage.setItem('authToken', token);
      
      // Redirige al usuario a la página de estudiantes o dashboard
      navigate('/students'); // Cambia la ruta si es necesario
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo nuevamente.');
      console.error('Login Error:', err);
    } finally {
      setLoading(false); // Detener indicador de carga
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="flex justify-center mt-4">
          {loading ? (
            <CircularProgress /> // Muestra el indicador de carga si está en proceso
          ) : (
            <button type="submit">Iniciar sesión</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
