<<<<<<< HEAD
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import HorasServicioAdmin from "./pages/HorasServicioAdmin";
=======
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthLayout from './components/layouts/AuthLayout'

import HorasServicioAdminPage from './pages/HorasServicioAdminPage'
import HoraServEstu from './pages/HoraServEstu'
import ForbiddenPage from "./pages/Forbidden";


import Profile from './pages/Profile'

>>>>>>> 631d8d07baec887ff1d1089973ced766e722d262

export default function App() {
  return (
    <>
<<<<<<< HEAD
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<h1>Profile</h1>} />
          <Route
            path="/servicio_estudiante"
            element={<h1>Servicio de estudiante</h1>}
          />
          <Route path="/servicio_admin" element={<HorasServicioAdmin/>} />
          <Route
            path="/lista_estudiantes"
            element={<h1>Lista de estudiantes para admin</h1>}
          />
        </Route>

        <Route path="/login" element={<Login />} />
=======

      <Routes>

        <Route element={<AuthLayout />}>
          <Route path='/' element={<Profile />} />
          <Route path='/servicio_estudiante' element={<HoraServEstu />} />
          <Route path='/servicio_admin' element={<HorasServicioAdminPage />} />
          <Route path='/lista_estudiantes' element={<h1>Lista de estudiantes para admin</h1>} />


        </Route>

        <Route path='/login' element={<Login />} />
        <Route path="/forbiden" element={<ForbiddenPage />} />
>>>>>>> 631d8d07baec887ff1d1089973ced766e722d262
      </Routes>
    </>
  );
}
