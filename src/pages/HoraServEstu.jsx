import React, { useEffect, useState, useContext } from 'react';
import { instance } from '../axios/instance';
import { ProfileContext } from '../components/layouts/AuthLayout';

export default function HoraServEstu() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const user = useContext(ProfileContext);
  console.log(user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/services');
        console.log(response)
        setData(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold'>HORAS DE SERVICIO</h1>
        <img src="serv.jpg" alt="Servicio" className='w-25' />
      </div>
      <div className='flex flex-col items-center justify-center mt-4'>
        <h1 className='text-3xl font-bold'>Horas de Servicio</h1>
        <p className='text-lg font-semibold'>Nombre del estudiante</p>
        <p className='font-bold text-2xl md:text-3xl'>{user?.data?.full_name || 'Cargando...'}</p>
      </div>
      <br />
      <div>

        <button className="mb-3 ml-5 bg-blue-700 hover:bg-sky-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">Introducir Nuevo Reporte</button>
      </div>

      {error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : (
        <table className="w-full border border-black text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Horas Reportadas</th>
              <th className="border px-2 py-1">Horas Aprobadas</th>
              <th className="border px-2 py-1">Descripción</th>
              <th className="border px-2 py-1">Evidencia</th>
              <th className="border px-2 py-1">Estatus</th>
              <th className="border px-2 py-1">Comentarios</th>
            </tr>
          </thead>
          <tbody className="bg-blue-200">
            {data?.map((item) => (
              <tr key={item?.id || item?.created_at}>
                <td className="border px-2 py-1">{item?.created_at}</td>
                <td className="border px-2 py-1">{item?.amount_reported}</td>
                <td className="border px-2 py-1">{item?.amount_approved}</td>
                <td className="border px-2 py-1">{item?.description}</td>
                <td className="border px-2 py-1">{item?.evidence}</td>
                <td className="border px-2 py-1">{item?.status}</td>
                <td className="border px-2 py-1">{item?.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}