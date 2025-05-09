import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import {
  getServicios,
  getEvidence,
  revisarServicio,
} from "../axios/services/services";

const HorasServicioAdmin = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nombresEstudiantes, setNombresEstudiantes] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [horasAprobadas, setHorasAprobadas] = useState({});

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const servicios = await getServicios();
        setOriginalData(servicios);
        setFilteredData(servicios);

        const nombresUnicos = [
          ...new Set(servicios.map((s) => s.user.full_name.trim())),
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

  const loadEvidence = async (id) => {
    try {
      const pdfData = await getEvidence(id);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al cargar evidencia:", error);
      alert("No se pudo cargar el PDF.");
    }
  };

  const actualizarEstado = async (id, nuevoEstado, comentario) => {
    const horas = parseFloat(horasAprobadas[id]);

    if (nuevoEstado === "1" && (isNaN(horas) || horas <= 0)) {
      alert("Debes ingresar una cantidad válida de horas aprobadas.");
      return;
    }

    try {
      await revisarServicio(id, nuevoEstado, comentario, horas);

      const nuevaData = originalData.map((s) =>
        s.id === id
          ? {
              ...s,
              status: nuevoEstado === "1" ? "approved" : "rejected",
              comment: comentario,
              amount_approved: nuevoEstado === "1" ? horas : 0,
            }
          : s
      );

      setOriginalData(nuevaData);
      setFilteredData(nuevaData);

      alert(
        `Servicio ${
          nuevoEstado === "1" ? "aprobado" : "rechazado"
        } exitosamente.`
      );
    } catch (error) {
      console.error(`Error al actualizar estado del servicio ${id}:`, error);
      alert("Ocurrió un error al actualizar el estado del servicio.");
    }
  };

  const handleComentarioChange = (id, valor) => {
    setComentarios((prev) => ({ ...prev, [id]: valor }));
  };

  const handleHorasChange = (id, valor) => {
    setHorasAprobadas((prev) => ({ ...prev, [id]: valor }));
  };

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
          <button
            onClick={resetFiltro}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Todos
          </button>
          <button
            onClick={() => handleFiltrarEstado("approved")}
            className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
          >
            Aprobados
          </button>
          <button
            onClick={() => handleFiltrarEstado("rejected")}
            className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
          >
            Rechazados
          </button>
          <button
            onClick={() => handleFiltrarEstado("pending")}
            className="px-3 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
          >
            Pendientes
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border text-sm rounded-lg">
        <thead className="bg-[#2c7ee2] text-white">
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Horas Reportadas</th>
            <th className="border px-2 py-1">Horas Aprobadas</th>
            <th className="border px-2 py-1">Tipo Servicio</th>
            <th className="border px-2 py-1">Evidencia</th>
            <th className="border px-2 py-1">Comentario</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((s) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.user?.full_name || "-"}</td>
              <td className="border px-2 py-1">
                {new Date(s.created_at).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1">{s.amount_reported || 0}</td>
              <td className="border px-2 py-1">
                {s.status === "Pending" ? (
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="border px-1 py-0.5 w-20 text-xs"
                    placeholder="Horas Aprobadas"
                    value={horasAprobadas[s.id] || ""}
                    onChange={(e) => handleHorasChange(s.id, e.target.value)}
                  />
                ) : (
                  s.amount_approved || "-"
                )}
              </td>
              <td className="border px-2 py-1">{s.category?.name || "-"}</td>
              <td className="border px-2 py-1">
                {s.evidence ? (
                  <button
                    onClick={() => loadEvidence(s.id)}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    Ver PDF
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {s.status === "Pending" ? (
                  <input
                    type="text"
                    className="border px-1 py-0.5 w-full text-xs"
                    placeholder="Comentario"
                    value={comentarios[s.id] || ""}
                    onChange={(e) =>
                      handleComentarioChange(s.id, e.target.value)
                    }
                  />
                ) : (
                  <span className="text-xs italic">
                    {s.comment || "Sin comentario"}
                  </span>
                )}
              </td>
              <td className="border px-2 py-1">
                {s.status === "Pending" ? (
                  <>
                    <button
                      className="text-green-600 hover:underline mr-2 cursor-pointer"
                      onClick={() =>
                        actualizarEstado(
                          s.id,
                          "1",
                          comentarios[s.id] || "Aprobado"
                        )
                      }
                    >
                      Aprobar
                    </button>
                    <button
                      className="text-red-600 hover:underline cursor-pointer"
                      onClick={() =>
                        actualizarEstado(
                          s.id,
                          "2",
                          comentarios[s.id] || "Rechazado"
                        )
                      }
                    >
                      Rechazar
                    </button>
                  </>
                ) : (
                  <span
                    className={
                      s.status.toLowerCase() === "approved"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {s.status.toLowerCase() === "approved"
                      ? "Aprobado"
                      : "Rechazado"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorasServicioAdmin;
