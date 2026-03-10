import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientPortalService } from './clientPortalService';
import type { ClientCredentials, ClientLogin } from '../shared/types';
import Swal from 'sweetalert2';

export const useClientLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<ClientCredentials>({
        identificationNumber: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Verificar si ya hay un cliente logueado
        const clientData = localStorage.getItem('clientData');
        const clientToken = localStorage.getItem('clientToken');
        if (clientData && clientToken) {
            navigate('/cliente/dashboard');
        }
    }, [navigate]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.identificationNumber || !credentials.password) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const clientData: ClientLogin = await clientPortalService.login(credentials);
            
            // Guardar datos del cliente en localStorage
            localStorage.setItem('clientData', JSON.stringify(clientData));
            localStorage.setItem('clientToken', clientData.token);
            
            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/cliente/dashboard');
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Credenciales inválidas'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        credentials,
        setCredentials,
        handleLoginSubmit,
        isSubmitting
    };
};
