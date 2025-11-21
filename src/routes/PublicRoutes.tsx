import { Routes, Route } from 'react-router-dom'; // Asegúrate de importar 'react-router-dom'
import Login from '../Login/Login';
import { useLogin } from '../Login/useLogin';
import ForgotPasswordForm from '../Login/ForgotPasswordForm';
import ChangePasswordForm from '../Login/ChangePasswordForm';
import LandingPage from '../LandingPage/page'; // Importa tu Landing Page
import VideoSection from '../VideosSection';

function PublicRoutes() {
    const { credencialUser, setCredencialUser, handleLoginSubmit, isSubmitting } = useLogin();
    
    return (
        <Routes>
            {/* Ruta principal para el Landing */}
            <Route 
                path="/" 
                element={<LandingPage />} 
            />
                <Route 
                path="/videos-ejercicios" 
                element={<VideoSection/>} 
            />
            <Route 
                path="/login" 
                element={
                    <Login 
                        credencialUser={credencialUser}
                        setCredencialUser={setCredencialUser}
                        handleLoginSubmit={handleLoginSubmit}
                        isSubmitting={isSubmitting}
                    />
                } 
            />
            <Route 
                path="/forgot-password" 
                element={<ForgotPasswordForm />} 
            />

            <Route 
                path="/reset-password" 
                element={<ChangePasswordForm />} 
            />
        </Routes>
    );
}

export default PublicRoutes;