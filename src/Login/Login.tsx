import { useRef } from "react";
import type { CredencialUser } from "../shared/types/index";
import PasswordInput from "../shared/components/PasswordInput";
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

type LoginProps = {
    credencialUser: CredencialUser;
    setCredencialUser: React.Dispatch<React.SetStateAction<CredencialUser>>;
    handleLoginSubmit: (e: React.FormEvent, refReCaptcha: React.RefObject<ReCAPTCHA>) => void;
    isSubmitting: boolean;
};

function Login({ credencialUser, setCredencialUser, handleLoginSubmit, isSubmitting }: LoginProps) {
    const recaptcha = useRef<ReCAPTCHA>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredencialUser(prev => ({
            ...prev,
            [name]: value
        }));

        // Resetear el captcha si hay cambios después de un error
        if (recaptcha.current?.getValue()) {
            recaptcha.current.reset();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black p-4">
            <main className="flex flex-col lg:flex-row justify-between w-full max-w-6xl bg-white rounded-lg overflow-hidden">
                {/* Sección del formulario */}
                <section className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
                    <div className="w-8 sm:w-10 md:w-12 flex justify-start">
                        <a
                            href="/"
                            className="flex items-center text-gray-400 hover:text-yellow transition-colors duration-300"
                            title="Regresar"
                        >
                            <FaArrowLeft className="text-xl sm:text-2xl" />
                        </a>
                    </div>
                    
                    <header className="flex justify-center my-4 sm:my-6">
                        <img 
                            src="Logo.webp" 
                            alt="Logo de Force GYM" 
                            className="w-40 sm:w-52 h-auto"
                        />
                    </header>

                    <form 
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={(e) => handleLoginSubmit(e, recaptcha)}
                    >
                        <label htmlFor='username' className="text-lg sm:text-xl font-bold">Usuario</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={credencialUser.username} 
                            onChange={handleInputChange}
                            placeholder="Ingresar usuario" 
                            required 
                            className="p-2 outline-1 border border-gray-300 rounded"
                            disabled={isSubmitting}
                        />

                        <label htmlFor="password" className="text-lg sm:text-xl font-bold">Contraseña</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={credencialUser.password}
                            onChange={handleInputChange}
                            placeholder="Ingresar contraseña"
                            required
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded"
                        />

                        <ReCAPTCHA 
                            ref={recaptcha} 
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        />

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`text-lg sm:text-xl mt-2 py-2 px-4 bg-black text-white rounded-full transition-all hover:bg-yellow hover:text-black hover:cursor-pointer ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>

                        <div className="text-center mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm sm:text-base text-gray-600 hover:underline hover:text-yellow"
                            >
                                ¿Olvidó su contraseña?
                            </Link>
                        </div>
                    </form>
                </section>
            
                {/* Sección de la imagen */}
                <aside className="w-full lg:w-1/2 hidden sm:flex items-center justify-center bg-gray-100">
                    <div className="w-full h-full">
                        <img 
                            src="gym copy.webp" 
                            alt="Imagen del equipo de Force GYM" 
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default Login;