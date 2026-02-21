import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function ClientForgotPassword() {
    const recaptcha = useRef<ReCAPTCHA>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;
        const email = emailInput.value;

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await Swal.fire({
                title: 'Correo inválido',
                text: 'Por favor, ingresa un correo electrónico válido',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#000000'
            });
            return;
        }

        // Validar reCAPTCHA
        const captchaValue = recaptcha.current?.getValue();
        if (!captchaValue) {
            await Swal.fire({
                title: 'Verificación requerida',
                text: 'Debe completar el reCAPTCHA',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#000000'
            });
            return;
        }

        setIsSubmitting(true);

        Swal.fire({
            title: 'Enviando correo...',
            html: 'Por favor espera mientras procesamos tu solicitud',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await axios.post(
                `${API_URL}/client-portal/forgot-password`,
                { 
                    email,
                    recaptchaToken: captchaValue
                }
            );
            
            Swal.close();

            if (response.data) {
                await Swal.fire({
                    title: 'Correo enviado',
                    text: 'Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#000000'
                });
                
                // Resetear formulario
                form.reset();
                recaptcha.current?.reset();
            }
        } catch (error: any) {
            Swal.close();
            
            const errorMessage = error.response?.data?.message || 
                'El correo electrónico no está registrado o hubo un error al enviar el correo';
            
            await Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#000000'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black py-4 px-3 sm:p-4">
            <main className="flex flex-col lg:flex-row justify-between w-full max-w-6xl bg-white rounded-lg overflow-hidden shadow-2xl">
                <section className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col">
                    
                    <header className="flex justify-center my-3 sm:my-4 md:my-6">
                        <img 
                            src="/Logo.webp" 
                            alt="Logo de Force GYM" 
                            className="w-32 sm:w-40 md:w-52 h-auto"
                        />
                    </header>

                    <div className="text-center mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Recuperar Contraseña</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">Ingresa tu correo electrónico para recibir un enlace de recuperación</p>
                    </div>

                    <form 
                        className="flex flex-col gap-3 sm:gap-4 mt-3 sm:mt-4"
                        onSubmit={handleSubmit}
                    >
                        <label htmlFor='email' className="text-base sm:text-lg md:text-xl font-bold">
                            Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            required 
                            placeholder="ejemplo@correo.com"
                            className="p-2.5 sm:p-3 text-sm sm:text-base outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                            disabled={isSubmitting}
                        />

                        <div className="flex justify-center sm:justify-start w-full">
                            <div className="transform scale-[0.85] origin-left sm:scale-100">
                                <ReCAPTCHA 
                                    ref={recaptcha} 
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`text-sm sm:text-base md:text-lg mt-2 py-2.5 sm:py-3 px-4 bg-black text-white rounded-full transition-all hover:bg-yellow hover:text-black hover:shadow-lg ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </button>

                        <div className="text-center mt-3 sm:mt-4">
                            <Link
                                to="/portal-cliente"
                                className="text-xs sm:text-sm md:text-base text-gray-600 hover:underline hover:text-yellow flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft /> Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </section>
            
                <aside className="w-full lg:w-1/2 hidden sm:flex items-center justify-center bg-gray-100">
                    <div className="w-full h-full">
                        <img 
                            src="/gym copy.webp" 
                            alt="Imagen del gimnasio" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default ClientForgotPassword;
