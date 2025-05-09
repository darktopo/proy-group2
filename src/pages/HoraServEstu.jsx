import React, { useEffect, useState, useContext } from 'react';
import { instance } from '../axios/instance';
import { ProfileContext } from '../components/layouts/AuthLayout';

export default function HoraServEstu() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);


  const [horas, setHoras] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  //const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('amount_reported', horas);
    formData.append('amount_approved', null);
    formData.append('description', descripcion);
    formData.append('evidence', evidencia);
    formData.append('status', "Pendiente");
    formData.append('comment', null);
    formData.append('created_at', new Date().toISOString());
    console.log(formData)
    try {
      const response = await instance.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/pdf',
        },
      });

      console.log(response);
      //para limpiar
      alert('Reporte enviado correctamente');
      setHoras('');
      setDescripcion('');
      setEvidencia(null);
      setData((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error al subir reporte:", error);
      alert("No se pudo enviar el reporte.");
    }
  };



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

  const loadEvidence = async (id) => {
    try {
      const response = await instance.get(`/evidence/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/pdf",
        },
        responseType: "blob",
      });

      console.log(response);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al cargar evidencia:", error);
      alert("No se pudo cargar el PDF.");
    }
  };

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


      <div className=' w-100 border-2 border-gray-500 rounded-lg p-4 mb-4 ml-20  bg-sky-900'>
        <div className="border-2 border-gray-500 rounded-lg p-4 mb-4 bg-blue-500 flex flex-row items-center gap-4">
          <p>Horas Reportadas:</p>
          <input className="pl-3 w-20 h-10 text-sm text-gray-600 border border-gray-500 rounded-lg bg-gray-300" type="text" value={horas} onChange={(e) => setHoras(e.target.value)} />
        </div>
        <div className=" border-2 border-gray-500 rounded-lg p-4 mb-4 bg-blue-500">
          <p>Evidencia</p>
          <input className="w-full text-sm text-gray-600 border border-gray-500 rounded-lg cursor-pointer bg-gray-300" type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
        </div>
        <div className="border-2 border-gray-500 rounded-lg p-4 mb-4 bg-blue-500">
          <p>Descripcion:</p>
          <input className=" pl-2 w-82 h-10 text-sm text-gray-600 border border-gray-500 rounded-lg bg-gray-300 " type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>

        <button onClick={handleSubmit} className="mb-3 bg-blue-700 hover:bg-sky-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">Subir Nuevo Reporte</button>
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
                <td className="w-55 border px-2 py-1 text-center">{item?.created_at}</td>
                <td className="w-25 border px-2 py-1 text-center">{item?.amount_reported}</td>
                <td className="w-25 border px-2 py-1 text-center">{item?.amount_approved}</td>
                <td className="w-70 border px-2 py-1">{item?.description}</td>
                <td className="w-20 border px-2 py-1 text-center">
                  {item?.evidence ? (
                    <button onClick={() => loadEvidence(item?.id)}
                      className="text-blue-500 hover:text-sky-900"
                    >
                      Visualizar
                    </button>
                  ) : (
                    "NO EXISTE EVIDENCIA"
                  )}
                </td>
                <td className="w-20 border px-2 py-1 text-center">{item?.status}</td>
                <td className="border px-2 py-1">{item?.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}