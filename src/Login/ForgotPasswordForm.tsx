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
        <div className="flex flex-col justify-center items-center h-screen bg-black">
            <main className="self-center text-center justify-center h-[70vh] gap-16 p-12 w-[80vh] bg-white rounded-lg">
                <header className="flex between gap-4 items-center mb-8">
                    <Link
                        to={"/login"}
                        className="hover:text-yellow "
                    >
                        <MdArrowBackIosNew/>
                    </Link>

                    <h1 className="font-bold text-xl">Recuperación de contraseña</h1>
                </header>

                <section className="flex flex-col h-full gap-4">
                    <form className="flex flex-col gap-4" onSubmit={(e) => {handleSubmit(e)}}>
                        <label htmlFor='email' className="text-start text-1xl font-bold">Correo electrónico</label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="Ingresar email" 
                            required 
                            className="p-2 outline-1"
                        />

                        <ReCAPTCHA ref={recaptcha} sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`} />
                        <button type="submit" className="text-1xl mt-4 py-2 bg-black text-white rounded-4xl transition-all hover:bg-yellow hover:text-black hover:cursor-pointer">Enviar</button>
                    </form>                    
                </section>
            </main>
        </div>
    )
}

export default ForgotPasswordForm;