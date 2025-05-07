import { useEffect, useState } from "react";
import { instance } from "../axios/instance";
import SearchBar from "../components/SearchBar";

const HorasServicioAdmin = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nombresEstudiantes, setNombresEstudiantes] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await instance.get("/services");
        const serviciosEstudiantes = res.data.filter(
          (s) =>
            s.user?.role_id === 4 && s.user?.status?.toLowerCase() === "activo"
        );

        console.log("Servicios Estudiantes:", serviciosEstudiantes);

        setOriginalData(serviciosEstudiantes);
        setFilteredData(serviciosEstudiantes);

        const nombresUnicos = [
          ...new Set(
            serviciosEstudiantes.map((s) => s.user?.full_name?.trim()).filter(Boolean)
          ),
        ];
        setNombresEstudiantes(nombresUnicos);
      } catch (err) {
        console.error("Error al obtener servicios:", err);
      }
    };

    fetchServicios();
  }, []);

  const handleSearch = (nombre) => {
    if (!nombre.trim()) return;
    const resultado = originalData.filter((s) =>
      s.user?.full_name?.toLowerCase().includes(nombre.toLowerCase())
    );
    setFilteredData(resultado);
  };

  const resetFiltro = () => {
    setFilteredData(originalData);
  };

  const handleFiltrarEstado = (estado) => {
    const resultado = originalData.filter(
      (s) => s.status?.toLowerCase() === estado.toLowerCase()
    );
    setFilteredData(resultado);
  };

  const obtenerPDF = (hash) =>
    `https://www.hs-service.api.crealape.com/api/v1/evidence/${hash}`;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Administrar Horas de Servicio</h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
        <SearchBar
          suggestions={nombresEstudiantes}
          onSearch={handleSearch}
          onReset={resetFiltro}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <button onClick={resetFiltro} className="px-3 py-1 bg-gray-200 rounded">
            Todos
          </button>
          <button
            onClick={() => handleFiltrarEstado("approved")}
            className="px-3 py-1 bg-green-200 rounded"
          >
            Aprobados
          </button>
          <button
            onClick={() => handleFiltrarEstado("rejected")}
            className="px-3 py-1 bg-red-200 rounded"
          >
            Rechazados
          </button>
          <button
            onClick={() => handleFiltrarEstado("pending")}
            className="px-3 py-1 bg-yellow-200 rounded"
          >
            Pendientes
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Carrera</th>
            <th className="border px-2 py-1">Horas Reportadas</th>
            <th className="border px-2 py-1">Tipo Servicio</th>
            <th className="border px-2 py-1">Evidencia</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((s) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.user?.full_name || "-"}</td>
              <td className="border px-2 py-1">{s.user?.schools?.[0]?.name || "-"}</td>
              <td className="border px-2 py-1">{s.amount_reported || 0}</td>
              <td className="border px-2 py-1">{s.category?.name || "-"}</td>
              <td className="border px-2 py-1">
                {s.evidence ? (
                  <a
                    href={obtenerPDF(s.evidence)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Ver PDF
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">
                <button className="text-green-600 hover:underline mr-2">Aprobar</button>
                <button className="text-red-600 hover:underline">Rechazar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorasServicioAdmin;
