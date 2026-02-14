import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { MdArrowBackIosNew } from "react-icons/md";
import Swal from 'sweetalert2';
import { Link } from "react-router";
import { postData } from "../shared/services/gym";

function ForgotPasswordForm () {
    const recaptcha = useRef<ReCAPTCHA>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const emailInput = form.elements[0] as HTMLInputElement;
        const email = emailInput.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await Swal.fire({
                title: 'Correo inválido',
                text: 'Por favor, ingresá un correo electrónico válido',
                icon: 'warning',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 300,
                confirmButtonColor: '#CFAD04'
            });
            return;
        }

        const captchaValue = recaptcha.current?.getValue();
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

        Swal.fire({
            title: 'Enviando correo...',
            html: 'Por favor espera mientras procesamos tu solicitud',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await postData(`${import.meta.env.VITE_URL_API}recoveryPassword?email=${encodeURIComponent(email)}`, {});
            
            Swal.close();

            if (res.ok) {
                await Swal.fire({
                    title: 'Correo enviado',
                    text: 'Se ha enviado un enlace de recuperación a su correo electrónico',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 300,
                    confirmButtonColor: '#CFAD04'
                });
            } else {
                throw new Error('Error al enviar el correo de recuperación');
            }
        } catch (error) {
            Swal.close();
            
            await Swal.fire({
                title: 'Error',
                text: 'El correo usado no está registrado',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 300,
                confirmButtonColor: '#CFAD04'
            });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black py-4 px-3 sm:py-8 sm:px-4">
            <main className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
                <header className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Link
                        to={"/login"}
                        className="hover:text-yellow transition-colors flex-shrink-0"
                    >
                        <MdArrowBackIosNew size={20} className="sm:w-6 sm:h-6" />
                    </Link>

                    <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">Recuperación de contraseña</h1>
                </header>

                <section className="flex flex-col">
                    <form className="flex flex-col gap-3 sm:gap-4" onSubmit={(e) => {handleSubmit(e)}}>
                        <label htmlFor='email' className="text-start text-xs sm:text-sm font-bold text-gray-700">Correo electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="tu.email@ejemplo.com" 
                            required 
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                        />

                        <div className="flex justify-center sm:justify-start w-full">
                            <div className="transform scale-[0.85] origin-left sm:scale-100">
                                <ReCAPTCHA ref={recaptcha} sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`} />
                            </div>
                        </div>
                        <button type="submit" className="w-full text-sm sm:text-base md:text-lg mt-2 sm:mt-4 py-2.5 sm:py-3 bg-black text-white rounded-lg transition-all hover:bg-yellow hover:text-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Enviar enlace de recuperación</button>
                    </form>                    
                </section>
            </main>
        </div>
    )
}

export default ForgotPasswordForm;