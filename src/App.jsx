import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthLayout from './components/layouts/AuthLayout'

import HorasServicioAdmin from './pages/HorasServicioAdmin'
import HoraServEstu from './pages/HoraServEstu'
import ForbiddenPage from "./pages/Forbidden";


import Profile from './pages/Profile'


export default function App() {
  return (
    <>

      <Routes>

        <Route element={<AuthLayout />}>
          <Route path='/' element={<Profile />} />
          <Route path='/servicio_estudiante' element={<HoraServEstu />} />
          <Route path='/servicio_admin' element={<HorasServicioAdmin />} />
          <Route path='/lista_estudiantes' element={<h1>Lista de estudiantes para admin</h1>} />


        </Route>

        <Route path='/login' element={<Login />} />
        <Route path="/forbiden" element={<ForbiddenPage />} />
      </Routes>
    </>
  );
}
