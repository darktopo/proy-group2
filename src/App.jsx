import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Agregamos Navigate
import Login from './components/Login';
import StudentsTable from './components/StudentsTable';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirige la ruta raíz / hacia /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;



