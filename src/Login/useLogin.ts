import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router";
import Swal from 'sweetalert2';
import { postData } from "../shared/services/gym"
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import { CredencialUser } from "../shared/types"
import ReCAPTCHA from "react-google-recaptcha";

export const useLogin = () => {
    const [credencialUser, setCredencialUser] = useState<CredencialUser>({
        username: '', 
        password: '', 
        recaptchaToken: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Solo limpiar si estamos realmente en la página de login
        if (location.pathname === '/login' || location.pathname === '/') {
            console.log('🔄 Limpiando sesión anterior en página de login');
            setAuthHeader(null);
            setAuthUser(null);
        }
    }, [location.pathname]);

    const handleLoginSubmit = async (e: React.FormEvent, refReCaptcha: React.RefObject<ReCAPTCHA>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const captchaValue = refReCaptcha.current?.getValue();
            
            if (!captchaValue) {
                await Swal.fire({
                    title: 'Acceso no autorizado',
                    text: 'Debe completar el ReCaptcha',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 300,
                    confirmButtonColor: '#CFAD04'
                });
                return;
            }

            const response = await postData(`${import.meta.env.VITE_URL_API}login`, {
                ...credencialUser,
                recaptchaToken: captchaValue
            });

            if (response.data?.loggedUser) {
                console.log('✅ Login exitoso, guardando token...');
                setAuthHeader(response.data.loggedUser.token);
                setAuthUser(response.data.loggedUser);
                
                // Verificar que se guardó correctamente
                const savedToken = localStorage.getItem("token");
                console.log('✔️ Token verificado en localStorage:', savedToken ? 'Guardado correctamente' : '❌ ERROR: No se guardó');
                
                navigate('/gestion/dashboard', { replace: true });
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            setCredencialUser({ username: '', password: '', recaptchaToken: '' });
            refReCaptcha.current?.reset();
            
            await Swal.fire({
                title: 'Error de autenticación',
                text: 'Usuario y/o contraseña incorrectos. Por favor, intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 300,
                confirmButtonColor: '#CFAD04'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        credencialUser,
        setCredencialUser,
        handleLoginSubmit,
        isSubmitting
    };
};