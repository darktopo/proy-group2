import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { listUsers, createUser, updateUser, deleteUser, listUsersByRole } from '../axios/users/userService';

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [controllers, setControllers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [countries, setCountries] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const [isControllersLoading, setIsControllersLoading] = useState(false);
  const [isRecruitersLoading, setIsRecruitersLoading] = useState(false);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);

  const initialStudentData = {
    f_name: '',
    m_name: '',
    f_lastname: '',
    s_lastname: '',
    email: '',
    phone: '',
    password: '',
    controller_id: '',
    recruiter_id: '',
    country_id: '',
    schools: [1], // Valor por defecto
    role_id: 4,
  };

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };
const fetchControllersRecruiters = async () => {
  setIsControllersLoading(true);
  setIsRecruitersLoading(true);
  setIsCountriesLoading(true);
  try {
    // Obtenemos los controllers y recruiters por su ID de rol
    const [controllersData, recruitersData] = await Promise.all([
      listUsersByRole(2),  // ID del role 'controller' (2)
      listUsersByRole(3)   // ID del role 'recruiter' (3)
    ]);

    // Verificar que los datos se están recibiendo correctamente
    console.log('Lista de controllers:', controllersData);
    console.log('Lista de recruiters:', recruitersData);

    // Cambiar aquí para acceder al array dentro de 'users' si el backend devuelve un objeto con esa propiedad
    setControllers(controllersData.users || []);  // Usamos 'users' si está presente
    setRecruiters(recruitersData.users || []);    // Hacemos lo mismo con recruiters

    // Simulación de países (puedes reemplazar esto por tu endpoint real)
   setCountries([
  { id: 1, name: 'Colombia' },
  { id: 2, name: 'México' },
  { id: 3, name: 'España' },
  { id: 4, name: 'Argentina' },
  { id: 5, name: 'Chile' },
  { id: 6, name: 'Perú' },
  { id: 7, name: 'Ecuador' },
  { id: 8, name: 'Venezuela' },
  { id: 9, name: 'Guatemala' },
  { id: 10, name: 'Cuba' },
  { id: 11, name: 'Bolivia' },
  { id: 12, name: 'Paraguay' },
  { id: 13, name: 'Uruguay' },
  { id: 14, name: 'Honduras' },
  { id: 15, name: 'El Salvador' },
  { id: 16, name: 'Nicaragua' },
  { id: 17, name: 'Costa Rica' },
  { id: 18, name: 'Panamá' },
  { id: 19, name: 'República Dominicana' },
  { id: 20, name: 'Puerto Rico' },
  { id: 21, name: 'Belice' },
  { id: 22, name: 'Jamaica' },
  { id: 23, name: 'Trinidad y Tobago' },
  { id: 24, name: 'Guyana' },
  { id: 25, name: 'Surinam' }
]);

  } catch (error) {
    console.error('Error al cargar controllers y recruiters:', error);
  } finally {
    setIsControllersLoading(false);
    setIsRecruitersLoading(false);
    setIsCountriesLoading(false);
  }
};


  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenModal = (student = null) => {
    setIsEditMode(!!student);
    fetchControllersRecruiters();  // Cargar siempre controllers/recruiters/countries
    setCurrentStudent(student ? { ...student } : initialStudentData);
    setFormErrors({});
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setFormErrors({});
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

const validateForm = () => {
  const errors = {};
  if (!currentStudent.email) errors.email = 'El email es obligatorio';
  if (!currentStudent.phone) errors.phone = 'El teléfono es obligatorio';
  if (!isEditMode) {
    if (!currentStudent.password) errors.password = 'La contraseña es obligatoria';
    if (currentStudent.password && currentStudent.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
  }
  if (!currentStudent.controller_id) errors.controller_id = 'El controller es obligatorio';
  if (!currentStudent.recruiter_id) errors.recruiter_id = 'El recruiter es obligatorio';
  if (!currentStudent.country_id) errors.country_id = 'El país es obligatorio';

  return errors;
};


  const handleSave = async () => {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setErrorMessage('');
  const studentData = {
    ...currentStudent,
    controller_id: Number(currentStudent.controller_id),
    recruiter_id: Number(currentStudent.recruiter_id),
    country_id: Number(currentStudent.country_id),
  };

  try {
    let response;
    if (isEditMode) {
      response = await updateUser(currentStudent.id, studentData); // Actualiza el estudiante
    } else {
      response = await createUser(studentData); // Crea un nuevo estudiante
    }

    console.log('Respuesta al crear/actualizar estudiante:', response);  // Log de la respuesta
    fetchStudents();  // Actualiza la lista de estudiantes
    handleCloseModal();  // Cierra el modal
  } catch (error) {
    setErrorMessage('Ocurrió un error al guardar el estudiante. Intenta nuevamente.');
    console.error('Error guardando estudiante:', error);
  }
};


  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      setDeleting(true);
      try {
        await deleteUser(id);
        fetchStudents();
      } catch (error) {
        console.error('Error eliminando estudiante:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Estudiantes (Admin)</h1>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          Crear Nuevo Estudiante
        </Button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <table className="min-w-full bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Nombre Completo</th>
                <th className="p-2">Email</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{student.id}</td>
                    <td className="p-2">{`${student.f_name || ''} ${student.m_name || ''} ${student.f_lastname || ''} ${student.s_lastname || ''}`}</td>
                    <td className="p-2">{student.email}</td>
                    <td className="p-2">{student.phone}</td>
                    <td className="p-2 flex gap-2">
                      <Button variant="outlined" size="small" onClick={() => handleOpenModal(student)}>
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(student.id)}
                        disabled={deleting}
                      >
                        {deleting ? <CircularProgress size={24} /> : 'Eliminar'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No hay estudiantes disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}</DialogTitle>
        <DialogContent>
          {currentStudent && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {errorMessage && (
                <div className="text-red-600 text-sm mt-2 mb-4">
                  <strong>{errorMessage}</strong>
                </div>
              )}
              <TextField
                label="Primer Nombre"
                name="f_name"
                value={currentStudent.f_name || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Segundo Nombre"
                name="m_name"
                value={currentStudent.m_name || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Primer Apellido"
                name="f_lastname"
                value={currentStudent.f_lastname || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Segundo Apellido"
                name="s_lastname"
                value={currentStudent.s_lastname || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={currentStudent.email || ''}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                label="Teléfono"
                name="phone"
                value={currentStudent.phone || ''}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />

              {!isEditMode && (
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={currentStudent.password || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              )}

              <FormControl fullWidth error={!!formErrors.controller_id}>
                <InputLabel>Controller</InputLabel>
                <Select
                  name="controller_id"
                  value={currentStudent.controller_id || ''}
                  onChange={handleChange}
                  label="Controller"
                  disabled={isControllersLoading}
                >
                  {controllers.map((ctrl) => (
                    <MenuItem key={ctrl.id} value={ctrl.id}>
                      {ctrl.f_name} {ctrl.f_lastname}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.controller_id && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.controller_id}</p>
                )}
              </FormControl>

              <FormControl fullWidth error={!!formErrors.recruiter_id}>
                <InputLabel>Recruiter</InputLabel>
                <Select
                  name="recruiter_id"
                  value={currentStudent.recruiter_id || ''}
                  onChange={handleChange}
                  label="Recruiter"
                  disabled={isRecruitersLoading}
                >
                  {recruiters.map((rec) => (
                    <MenuItem key={rec.id} value={rec.id}>
                      {rec.f_name} {rec.f_lastname}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.recruiter_id && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.recruiter_id}</p>
                )}
              </FormControl>

              <FormControl fullWidth error={!!formErrors.country_id}>
                <InputLabel>País</InputLabel>
                <Select
                  name="country_id"
                  value={currentStudent.country_id || ''}
                  onChange={handleChange}
                  label="País"
                  disabled={isCountriesLoading}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.country_id && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.country_id}</p>
                )}
              </FormControl>
            </div>
          )}
        </DialogContent>
        <div className="flex justify-end p-4">
          <Button onClick={handleCloseModal} variant="outlined" className="mr-2">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default StudentsTable;
