import axios from 'axios';
import type { ClientCredentials, ClientExerciseNote, ClientLogin, ClientRoutine, Measurement } from '../shared/types';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_URL}/client-portal`,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('clientToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token enviado al backend:', token.substring(0, 20) + '...');
    } else {
        console.warn('⚠️ No hay token de cliente en localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        console.log('✅ Respuesta exitosa del backend');
        return response;
    },
    (error) => {
        console.error('❌ Error en respuesta del backend:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.error('🚫 Error 401: Token inválido o expirado');
            
            // Limpiar datos del cliente
            localStorage.removeItem('clientData');
            localStorage.removeItem('clientToken');
            
            // Mostrar alerta
            Swal.fire({
                icon: 'error',
                title: 'Sesión expirada',
                text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                confirmButtonColor: '#000000',
                willClose: () => {
                    // Redirigir al login de clientes
                    window.location.href = '/portal-cliente';
                }
            });
        }
        
        return Promise.reject(error);
    }
);

export const clientPortalService = {
    login: async (credentials: ClientCredentials): Promise<ClientLogin> => {
        console.log('🔐 Intentando login de cliente...');
        const response = await axios.post(`${API_URL}/client-portal/login`, credentials);
        const clientData = response.data.data.loggedClient;
        console.log('✅ Login exitoso, token recibido:', clientData.token.substring(0, 20) + '...');
        return clientData;
    },

    getMyRoutines: async (): Promise<ClientRoutine[]> => {
        const response = await api.get('/my-routines');
        console.log('=== FRONTEND: Full response:', response);
        console.log('=== FRONTEND: response.data:', response.data);
        console.log('=== FRONTEND: response.data.data:', response.data?.data);
        console.log('=== FRONTEND: response.data.data.routines:', response.data?.data?.routines);
        return response.data?.data?.routines || [];
    },

    getMyMeasurements: async (): Promise<Measurement[]> => {
        const response = await api.get('/my-measurements');
        return response.data?.data?.measurements || [];
    },

    downloadRoutinesPdf: async (): Promise<Blob> => {
        const response = await api.get('/download-routines-pdf', {
            responseType: 'blob'
        });
        return response.data;
    },

    downloadSingleRoutinePdf: async (idRoutineAssignment: number): Promise<Blob> => {
        const response = await api.get(`/download-routine-pdf/${idRoutineAssignment}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    downloadMeasurementsPdf: async (): Promise<Blob> => {
        const response = await api.get('/download-measurements-pdf', {
            responseType: 'blob'
        });
        return response.data;
    },

    hasProvisionalPassword: async (): Promise<boolean> => {
        const response = await api.get('/has-provisional-password');
        return response.data.data.hasProvisionalPassword;
    },

    changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
        await api.post('/change-password', {
            currentPassword,
            newPassword,
            confirmPassword
        });
    },

    // Obtener perfil actualizado del cliente (con fecha de vencimiento actualizada)
    getMyProfile: async (): Promise<ClientLogin> => {
        const response = await api.get('/my-profile');
        return response.data?.data?.profile;
    },

    // Notas personales de ejercicios
    getExerciseNotes: async (idRoutine: number): Promise<ClientExerciseNote[]> => {
        const response = await api.get(`/exercise-notes/${idRoutine}`);
        return response.data?.data?.notes || [];
    },

    getAllExerciseNotes: async (): Promise<ClientExerciseNote[]> => {
        const response = await api.get('/exercise-notes');
        return response.data?.data?.notes || [];
    },

    saveExerciseNote: async (idRoutineExercise: number, personalNote: string): Promise<ClientExerciseNote> => {
        const response = await api.post('/exercise-notes', {
            idRoutineExercise,
            personalNote
        });
        return response.data?.data?.note;
    },

    deleteExerciseNote: async (idRoutineExercise: number): Promise<void> => {
        await api.post(`/exercise-notes/delete/${idRoutineExercise}`);
    }
};
