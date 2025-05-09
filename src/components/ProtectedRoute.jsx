import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Revisa si el token existe en el localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Si NO está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza la página normalmente
  return children;
};

export default ProtectedRoute;

