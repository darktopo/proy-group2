import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthLayout from './components/layouts/AuthLayout'
import HorasServicioAdminPage from './pages/HorasServicioAdminPage'
import HoraServEstu from './pages/HoraServEstu'
import ForbiddenPage from "./pages/Forbidden";
import Profile from './pages/Profile'
import StudentsTable from './pages/StudentsTable'

export default function App() {
  return (
    <>

      <Routes>

        <Route element={<AuthLayout />}>
          <Route path='/' element={<Profile />} />
          <Route path='/servicio_estudiante' element={<HoraServEstu />} />
          <Route path='/servicio_admin' element={<HorasServicioAdminPage />} />
          <Route path='/lista_estudiantes' element={<StudentsTable />} />

        </Route>

        <Route path='/login' element={<Login />} />
        <Route path="/forbiden" element={<ForbiddenPage />} />
      </Routes>
    </>
  )
}
