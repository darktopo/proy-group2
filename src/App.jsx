import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthLayout from './components/layouts/AuthLayout'
import Profile from './pages/Profile'


export default function App() {
  return (
    <>
    
      <Routes>
        <Route element={<AuthLayout/>}>
        <Route path='/' element={<Profile/>}/>
        <Route path='/servicio_estudiante' element={<h1>Servicio de estudiante</h1>}/>
        <Route path='/servicio_admin' element={<h1>Servicio de Admin</h1>}/>
        <Route path='/lista_estudiantes' element={<h1>Lista de estudiantes para admin</h1>}/>
        </Route>
        
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
  )
}
