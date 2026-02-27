import { MdArrowBackIosNew } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PasswordInput from "../shared/components/PasswordInput";
import { useForm } from "react-hook-form";
import ErrorForm from "../shared/components/ErrorForm";
import { useEffect, useRef } from "react";
import { postData } from "../shared/services/gym";
import Swal from 'sweetalert2';

function ClientResetPassword() {
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<{password: string, confirmPassword: string}>();

    const validatePassword = (password: string): true | string => {
        const num = /\d/;
        const lowercase = /[a-z]/;
        const uppercase = /[A-Z]/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const charLength = /^.{8,20}$/;
    
        if (!charLength.test(password)) {
            return "La contraseña debe tener entre 8 y 20 caracteres.";
        }
        if (!lowercase.test(password)) {
            return "La contraseña debe contener al menos una letra minúscula.";
        }
        if (!uppercase.test(password)) {
            return "La contraseña debe contener al menos una letra mayúscula.";
        }
        if (!num.test(password)) {
            return "La contraseña debe contener al menos un número.";
        }
        if (!specialChar.test(password)) {
            return "La contraseña debe contener al menos un carácter especial.";
        }
    
        return true;
    };

    const submitForm = async (data: {password: string, confirmPassword: string}) => {
        const reqData = {newPassword: data.password, token: searchParams.get('token')};
        const result = await postData(`${import.meta.env.VITE_URL_API}client-portal/reset-password`, reqData);
        
        if (result.ok) {
            await Swal.fire({
                title: 'Contraseña cambiada',
                text: 'Se ha cambiado tu contraseña. Ahora puedes iniciar sesión.',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 500,
                confirmButtonColor: '#CFAD04'
            });

            navigate("/portal-cliente");
        } else {
            await Swal.fire({
                title: 'Error',
                text: result.message || 'No se pudo cambiar la contraseña. El token puede estar expirado.',
                icon: 'error',
                confirmButtonText: 'OK',
                width: 500,
                confirmButtonColor: '#d33'
            });
        }
    };

    useEffect(() => {
        if (!searchParams.get('token') || searchParams.get('token') === null) {
            Swal.fire({
                title: 'Token no encontrado',
                text: 'Realiza tu solicitud de recuperación de contraseña para recibirlo.',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 500,
                confirmButtonColor: '#CFAD04'
            }).then(() => {
                navigate("/portal-cliente");
            });

            setTimeout(() => {
                navigate("/portal-cliente");
            }, 3000);
        }

        passwordRef.current = document.getElementById("password") as HTMLInputElement;
    }, [navigate, searchParams]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-4 px-3 sm:py-8 sm:px-4">
            <main className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <header className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Link
                        to="/portal-cliente"
                        className="hover:text-yellow-500 transition-colors text-gray-700 flex-shrink-0"
                    >
                        <MdArrowBackIosNew size={20} className="sm:w-6 sm:h-6" />
                    </Link>
                    <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900">Restablecer Contraseña</h1>
                </header>

                <section className="flex flex-col">
                    <form className="text-left flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit(submitForm)}>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm uppercase font-bold text-gray-700 mb-1.5">
                                Nueva Contraseña
                            </label>
                            <PasswordInput     
                                id="password"
                                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"  
                                type="password" 
                                placeholder="Ingresa tu nueva contraseña" 
                                {...register('password', {
                                    validate: validatePassword
                                })}
                            />

                            {errors.password && 
                                <ErrorForm>
                                    {errors.password.message}
                                </ErrorForm>
                            }
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm uppercase font-bold text-gray-700 mb-1.5">
                                Confirmar Contraseña
                            </label>
                            <PasswordInput     
                                id="confirmPassword"
                                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"  
                                type="password" 
                                placeholder="Confirma tu nueva contraseña" 
                                {...register('confirmPassword', {
                                    validate: value => value === passwordRef.current?.value || "Las contraseñas no coinciden"
                                })}
                            />

                            {errors.confirmPassword && 
                                <ErrorForm>
                                    {errors.confirmPassword.message}
                                </ErrorForm>
                            }
                        </div>

                        <button 
                            type="submit" 
                            className="w-full text-sm sm:text-base md:text-lg mt-2 sm:mt-4 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg transition-all hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg"
                        >
                            Restablecer Contraseña
                        </button>
                    </form>                    
                </section>

                <footer className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
                    <p>¿Recordaste tu contraseña?</p>
                    <Link 
                        to="/portal-cliente" 
                        className="text-yellow-600 hover:text-yellow-800 font-semibold transition-colors"
                    >
                        Volver al inicio de sesión
                    </Link>
                </footer>
            </main>
            
            {/* Footer con información del desarrollador */}
            <footer className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Desarrollado por{' '}
                    <a 
                        href="https://geraldcalderon.netlify.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 transition-colors underline"
                    >
                        Gerald Calderón
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default ClientResetPassword;
