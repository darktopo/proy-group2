import React, { useState } from 'react'
import { login } from '../axios/auth/auth';
import { useNavigate } from 'react-router';

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState (false)
    
    async function handleLogin(e) {
        e.preventDefault()
        try{
        const formdata = new FormData(e.target);
        const requestData = Object.fromEntries(formdata.entries())

        const data = await login(requestData)
        console.log(data)
        
            if (data.status === 'success') {
                navigate('/');
            }else{
            setError(true)
        }}catch(error){
            console.log(error)
            setError(true)
        }
    }

    return (
        <div className=' h-screen w-screen flex justify-center items-center '>
            <img className='absolute -z-10 h-full w-full object-cover' src="fondo.avif" alt="" />

            <div className='bg-white w-[90%] max-w-120 h-80 shadow-gray-800 shadow-lg rounded-xl flex flex-col items-center py-5'>
                <img className='w-80 rounded-t-2xl mb-3' src="logo-funval.png" alt="logo_funval" />

                <form className='w-[85%]' onSubmit={handleLogin}>
                    <label htmlFor="email" className="">
                        <input type="email" name="email" id="email" className="w-full h-11 border border-gray-700 rounded-lg pl-3 font-semibold outline-none text-gray-600 mb-4 hover:bg-gray-200 focus:border-2 cursor-pointer" placeholder="Your@email.com" required="" />
                    </label>

                    <label htmlFor="password" className="">
                        <input type="password" name="password" id="password" placeholder="Contraseña" className="w-full h-11 border border-gray-700 rounded-lg pl-3 font-semibold outline-none text-gray-600 mb-4 hover:bg-gray-200 focus:border-2 cursor-pointer" required="" />
                    </label>

                    <button type="submit" className='w-full h-10 rounded-lg bg-[#053666] text-white font-semibold hover:bg-[#05294e] cursor-pointer'>Acceder</button>
                    {
                        error &&
                        <p className='text-red-600 w-full text-center'>Email o contraseña incorrecta</p>
                    }
                </form>
            </div>


        </div>
    )
}
