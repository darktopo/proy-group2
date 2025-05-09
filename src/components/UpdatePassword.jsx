import { useForm } from "react-hook-form"
import { changePassword } from "../axios/auth/auth"
import { useEffect, useState } from "react"


export default function UpdatePassword() {
    const { register, reset, formState: { isValid }, handleSubmit, watch } = useForm()

    const [change, setChange] = useState(false)
    const [error, setError] = useState(false)
    const submitForm = async (data, e) => {
        e.preventDefault()
        try {
            const status = await changePassword(data)
            if (status === 200) {
                setChange(true)
                reset()
            }
        } catch (error) {
            console.log(error)
            setError(true)
            return
        }
    }
    useEffect(() => {
        if (change === true) {
            setTimeout(() => {
                setChange(false);
            }, 3000);
        }
    }, [change]);

    const oldPassword = watch('old_password');
    const newPassword = watch('new_password')
    const confirmNewPassword = watch('confirm_new_password');

    const validateNewPassword = () => newPassword && newPassword === oldPassword
    const validateConfirmPassword = () => confirmNewPassword && confirmNewPassword !== newPassword;


    return (
        <div className="p-6 rounded-lg bg-[rgb(226,228,231)] shadow-lg shadow-gray-400">
            <h2 className="text-[#297ee2] text-xl font-bold text-center mb-6 tracking-tight">ACTUALIZAR CONTRASEÑA</h2>

            <form onSubmit={handleSubmit(submitForm)}>
                <div className="space-y-4 mb-4">
                    <div>
                        <input
                            type="password"
                            {...register("old_password", {
                                required: "Tu contraseña anterior es requerida",
                                validate: (value) => value === oldPassword

                            })}

                            placeholder="Antigua contraseña"
                            className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            {...register("new_password", {
                                required: "Tu nueva contraseña es requerida",
                                validate: (value) => value !== oldPassword

                            })}

                            placeholder="Nueva contrazeña"
                            className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                        />
                        {validateNewPassword() && <p className="text-red-500">Las nueva contraseña no debe ser igual a la contraseña antigua</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register("confirm_new_password", {
                                required: "Debes confirmar tu  nueva contraseña",
                                validate: (value) => value === newPassword

                            })}

                            placeholder="Confirmar nueva contraseña"
                            className="w-full bg-white p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#297ee2] cursor-pointer"
                        />
                        {validateConfirmPassword() && <p className="text-red-500">Las contraseñas no coinciden</p>}
                    </div>
                </div>

                <div className="flex flex-col items-end">

                    <button
                        type="submit"
                        className="bg-[#053666] text-white px-6 py-2 rounded-md hover:bg-[#05294e] transition-colors cursor-pointer font-semibold disabled:bg-gray-600 mb-4"
                        disabled={!isValid}>
                        Cambiar
                    </button>
                    {
                        change &&
                        <p className="bg-green-500 text-center font-medium h-7 text-gray-200 w-full rounded-lg ">Contraseña Actualizada</p>
                    }
                    {error &&
                        <p className="bg-red-500 text-center font-medium h-7 text-gray-200 w-full rounded-lg ">Error al actualizar. Por favor, revise los datos</p>
                    }
                </div>
            </form>
        </div>
    )

}

