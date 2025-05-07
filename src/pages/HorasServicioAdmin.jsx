import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { instance } from "../axios/instance";

export default function HorasServicioAdminPage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    instance
      .get("/services")
      .then((res) => {
        setServices(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar servicios", err);
      });
  }, []);

  const handleSearch = (query) => {
    if (!query) return setFiltered(services);

    const result = services.filter((s) =>
      s.user?.full_name?.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <div className="min-h-screen bg-[#023861] text-[#023861] p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-center text-xl font-bold text-[#2c7ee2] mb-4">
          HORAS SERVICIO (ADMIN)
        </h1>

        {/* NAV será añadido por otro participante */}

        <SearchBar onSearch={handleSearch} />

        {/* Aquí irán tabs y tabla más adelante */}
        {/* <pre className="text-xs text-gray-600 bg-[#f2f3f7] rounded p-4 overflow-x-auto">
          {JSON.stringify(filtered, null, 2)}
        </pre> */}
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-md">
          <thead className="bg-[#023861] text-white">
            <tr>
              <th className="p-3 text-left">Estudiante</th>
              <th className="p-3 text-left">Horas Reportadas</th>
              <th className="p-3 text-left">Horas Aprobadas</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t hover:bg-[#f2f3f7]">
                <td className="p-3">{service.user?.full_name}</td>
                <td className="p-3">{service.amount_reported}</td>
                <td className="p-3">{service.amount_approved}</td>
                <td className="p-3">{service.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
