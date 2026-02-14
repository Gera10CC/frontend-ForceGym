import { useRef } from 'react';
import { useClientLogin } from './useClientLogin';
import PasswordInput from '../shared/components/PasswordInput';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';

function ClientLogin() {
    const recaptcha = useRef<ReCAPTCHA>(null);
    const { credentials, setCredentials, handleLoginSubmit, isSubmitting } = useClientLogin();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (recaptcha.current?.getValue()) {
            recaptcha.current.reset();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black p-4">
            <main className="flex flex-col lg:flex-row justify-between w-full max-w-6xl bg-white rounded-lg overflow-hidden">
                <section className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
                
                    <header className="flex justify-center my-4 sm:my-6">
                        <img 
                            src="/Logo.webp" 
                            alt="Logo de Force GYM" 
                            className="w-40 sm:w-52 h-auto"
                        />
                    </header>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold">Portal del Cliente</h1>
                        <p className="text-gray-600 mt-2">Accede a tus rutinas y medidas</p>
                    </div>

                    <form 
                        className="flex flex-col gap-4 mt-4"
                        onSubmit={(e) => handleLoginSubmit(e, recaptcha)}
                    >
                        <label htmlFor='identificationNumber' className="text-lg sm:text-xl font-bold ">
                            Usuario
                        </label>
                        <input 
                            type="text" 
                            name="identificationNumber" 
                            id="identificationNumber" 
                            value={credentials.identificationNumber} 
                            onChange={handleInputChange}
                            required 
                            placeholder="Ingresa tu usuario"
                            className="p-2 outline-1 border border-gray-300 rounded"
                            disabled={isSubmitting}

                        />

                        <label htmlFor="password" className="text-lg sm:text-xl font-bold">
                            Contraseña
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingresa tu contraseña"
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded"
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
                            className={`text-lg sm:text-xl mt-2 py-2 px-4 bg-black text-white rounded-full transition-all hover:bg-yellow hover:text-black hover:cursor-pointer ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>

                        <div className="text-center mt-2">
                            <Link
                                to="/portal-cliente/recuperar-contrasena"
                                className="text-sm sm:text-base text-gray-600 hover:underline hover:text-yellow"
                            >
                                ¿Olvidaste tu contraseña?
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

export default ClientLogin;
