import { useForm } from "react-hook-form";
import { profile } from "../axios/auth/auth"
import { update } from "../axios/users/user";
import { useEffect, useState } from "react";

export default function UpdateProfile() {
    const { register, handleSubmit } = useForm({ defaultValues: async () => await profile() })
    const [save, setSave] = useState(false)
    const onSubmit = async (profile, e) => {
        e.preventDefault()
        try {
            profile.status = 1
            const status = await update(profile, profile.id);
            if (status === 200) {
                setSave(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (save === true) {
            setTimeout(() => {
                setSave(false);
            }, 3000);
        }
    }, [save]);

    return (
        <>
            <div className="mb-8 p-6  rounded-lg bg-[rgb(226,228,231)] shadow-lg shadow-gray-400 flex flex-col md:flex-row items-center gap-8">
                <img className="size-40 rounded-2xl" src="foto_perfil.avif" alt="" />
                <input type="text"
                className="border-0 outline-none w-full md:w-[80%] text-center md:text-start md:text-2xl
                font-semibold tracking-tight"
                {...register("full_name")}
                readOnly
                
                />
            </div>

            <div className="mb-8 p-6  rounded-lg bg-[rgb(226,228,231)] shadow-lg shadow-gray-400">
                <h2 className="text-[#297ee2] text-2xl font-bold text-center tracking-tight mb-6">PROFILE</h2>

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Primer Nombre</h2>
                            <input
                                type="text"
                                {...register("f_name")}
                                placeholder="1er Nombre"
                                className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Segundo Nombre</h2>
                            <input
                                type="text"
                                {...register("m_name")}
                                placeholder="2do Nombre"
                                className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Primer Apellido</h2>
                            <input
                                type="text"
                                {...register("f_lastname")}
                                placeholder="Primer Apellido"
                                className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Segundo Apellido</h2>
                            <input
                                type="text"
                                {...register("s_lastname")}
                                placeholder="Segundo Apellido"
                                className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Teléfono</h2>
                            <input
                                type="text"
                                {...register("phone")}
                                placeholder="Phone"
                                className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Email</h2>
                            <input
                                type="text"
                                {...register("email")}
                                placeholder="Email"
                                readOnly
                                className="w-full bg-white p-3 border hover:outline-none focus:outline-none rounded-md"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold mb-1 ml-2">Rol</h2>
                            <input
                                type="text"
                                {...register("role.name")}
                                placeholder="Rol"
                                readOnly
                                className="w-full bg-white p-3 border hover:outline-none focus:outline-none rounded-md"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <button
                            type="submit"
                            className="bg-[#053666] text-white px-6 py-2 rounded-md hover:bg-[#05294e] transition-colors cursor-pointer mb-2 font-semibold "
                        >
                            Guardar
                        </button>
                        {save &&
                            <p className="bg-green-500 text-center font-medium h-7 text-gray-200 w-full rounded-lg ">Perfil Actualizado</p>
                        }
                    </div>
                </form>
            </div>
        </>
    )
}
