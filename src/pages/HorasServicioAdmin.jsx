import { useEffect, useState } from "react";
import { instance } from "../axios/instance";
import SearchBar from "../components/SearchBar";

const HorasServicioAdmin = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nombresEstudiantes, setNombresEstudiantes] = useState([]);
  const [comentarios, setComentarios] = useState({});

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await instance.get("/services");
        const servicios = res.data.filter(
          (s) => s.user?.role_id === 4 && s.user?.status === "activo"
        );

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
      const response = await instance.get(`/evidence/${id}`, {
        headers: {
          "Content-Type": "application/pdf",
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

  const actualizarEstado = async (id, nuevoEstado, comentario) => {
    try {
      await instance.patch(`/review/${id}`, {
        amount_approved: 0,
        comment: comentario,
        status: nuevoEstado, // 1 aprobado, 2 rechazado
      });

      const nuevaData = originalData.map((s) =>
        s.id === id
          ? {
              ...s,
              status: nuevoEstado === "1" ? "approved" : "rejected",
              comment: comentario, // ← Aquí agregas el comentario
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
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          >
            Todos
          </button>
          <button
            onClick={() => handleFiltrarEstado("approved")}
            className="px-3 py-1 bg-green-200 rounded cursor-pointer hover:bg-green-300"
          >
            Aprobados
          </button>
          <button
            onClick={() => handleFiltrarEstado("rejected")}
            className="px-3 py-1 bg-red-200 rounded cursor-pointer hover:bg-red-300"
          >
            Rechazados
          </button>
          <button
            onClick={() => handleFiltrarEstado("pending")}
            className="px-3 py-1 bg-yellow-200 rounded cursor-pointer hover:bg-yellow-300"
          >
            Pendientes
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border text-sm rounded-lg">
        <thead className="bg-[#2c7ee2] text-white">
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Carrera</th>
            <th className="border px-2 py-1">Horas Reportadas</th>
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
                {s.user?.schools?.[0]?.name || "-"}
              </td>
              <td className="border px-2 py-1">{s.amount_reported || 0}</td>
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
                    placeholder="Escribe un comentario"
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
                          comentarios[s.id] || "Aprobado por el administrador"
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
                          comentarios[s.id] || "Rechazado por el administrador"
                        )
                      }
                    >
                      Rechazar
                    </button>
                  </>
                ) : (
                  <span
                    className={
                      s.status === "Approved" || s.status === "approved"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {s.status === "Approved" || s.status === "approved"
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
