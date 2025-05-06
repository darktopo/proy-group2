import React, { createContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { profile } from '../../axios/auth/auth'
import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
    const ProfileContext = createContext()
    const [data, setData] = useState({})
    console.log(data)
    const [menu, setMenu] = useState(false)
    const rolesOptions = [
        { name: "Perfil", roles: ['Admin', 'Student'], link: "/" },
        { name: "Horas de Servicio", roles: ['Student'], link: "/servicio_estudiante" },
        { name: "Horas de Servicio", roles: ['Admin'], link: "/servicio_admin" },
        { name: "Lista de Estudiantes", roles: ['Admin'], link: "/lista_estudiantes" }
    ]
    useEffect(() => {
        profile()
            .then((rs) => setData(rs))
            .catch((error) => console.log(error))
    }, [])
    function closeMenu() {
        setMenu(false)
    }

    return (
        <ProfileContext value={{ data }}>
            <div>
                <Navbar
                    setMenu={setMenu}
                />
                {menu &&
                    <div className='bg-[#0e3059] h-[100vh] w-80 flex flex-col items-center py-3 gap-1 absolute top-0 right-0 '>
                        <div className='w-72 h-12 flex '>
                            <button className=' text-white w-10 h-10 rounded-lg shadow-gray-900 shadow-xs  border-4 border-[#051d35] hover:bg-[#08294b] cursor-pointer' onClick={closeMenu}><p>X</p></button>
                        </div>
                        {
                            rolesOptions.filter((option) => option.roles.includes(data?.role?.name)).map((button) =>
                                <Link to={button.link}>
                                    <button className='text-white bg-[#08294b] hover:bg-[#051d35] w-79 h-12 text-xl font-semibold rounded shadow-gray-900 shadow-sm cursor-pointer tracking-tight text-start pl-5' onClick={closeMenu}>{button.name}</button>
                                </Link>
                            )
                        }
                    </div>
                }
                <Outlet />
            </div>
        </ProfileContext>
    )
}
