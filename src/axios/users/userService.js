import axiosInstance from '../users/axiosInstance';  // Importando la instancia de axios configurada

// Listar estudiantes
export const listUsers = async () => {
    try {
        const url = '/students';  // URL para obtener la lista de estudiantes
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching students:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener todos los usuarios
export const listAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener un usuario específico por ID
export const getUserById = async (userId) => {
    if (!userId) throw new Error('User ID is required');

    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Crear un nuevo usuario (ruta correcta /users)
export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/users', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error creating user:", error.response.data);
            alert(`Error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            console.error("No response from server:", error.request);
            alert('No response from server. Please try again later.');
        } else {
            console.error("Error setting up request:", error.message);
            alert(`Request error: ${error.message}`);
        }
        throw error;
    }
};

// Actualizar un usuario específico por ID
export const updateUser = async (userId, userData) => {
    if (!userId) throw new Error('User ID is required');

    try {
        const response = await axiosInstance.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Eliminar un usuario específico por ID
export const deleteUser = async (userId) => {
    if (!userId) throw new Error('User ID is required');

    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Cambiar el rol de un usuario específico por ID
export const changeUserRole = async (userId, roleId) => {
    if (!userId || !roleId) throw new Error('User ID and Role ID are required');

    try {
        const response = await axiosInstance.put(`/users/${userId}/role`, { role_id: roleId });
        return response.data;
    } catch (error) {
        console.error("Error changing user role:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Cambiar la contraseña de un usuario específico por ID
export const changeUserPassword = async (userId, passwordData) => {
    if (!userId || !passwordData) throw new Error('User ID and password data are required');

    try {
        const response = await axiosInstance.put(`/users/${userId}/password`, passwordData);
        return response.data;
    } catch (error) {
        console.error("Error changing user password:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Cambiar el estado de un usuario específico por ID
export const changeUserStatus = async (userId, status) => {
    if (!userId || status === undefined) throw new Error('User ID and status are required');

    try {
        const response = await axiosInstance.put(`/users/${userId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error changing user status:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener usuarios por rol (controller o recruiter)
export const listUsersByRole = async (roleId) => {
    if (!roleId) throw new Error('Role ID is required');

    try {
        const rolesResponse = await axiosInstance.get('/roles');
        const roles = rolesResponse.data;

        const role = roles.find(r => r.id === roleId);

        if (!role) {
            throw new Error(`Role with ID ${roleId} not found`);
        }

        const url = `/users?role_id=${roleId}`;
        const response = await axiosInstance.get(url);

        return {
            role: role.name,
            users: response.data,
        };
    } catch (error) {
        console.error(`Error fetching users with role ${roleId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};