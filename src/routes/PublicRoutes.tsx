import { Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import { useLogin } from '../Login/useLogin';
import ForgotPasswordForm from '../Login/ForgotPasswordForm';
import ChangePasswordForm from '../Login/ChangePasswordForm';
import ClientLogin from '../ClientPortal/ClientLogin';
import ClientDashboard from '../ClientPortal/ClientDashboard';
import TrainingMode from '../ClientPortal/TrainingMode';
import ClientForgotPassword from '../ClientPortal/ClientForgotPassword';
import ClientResetPassword from '../ClientPortal/ClientResetPassword';

function PublicRoutes() {
    const { credencialUser, setCredencialUser, handleLoginSubmit, isSubmitting } = useLogin();
    
    return (
        <Routes>
            <Route 
                path="/" 
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
            {/* Rutas del Portal de Clientes */}
            <Route 
                path="/portal-cliente" 
                element={<ClientLogin />} 
            />
            <Route 
                path="/portal-cliente/recuperar-contrasena" 
                element={<ClientForgotPassword />} 
            />
            <Route 
                path="/portal-cliente/restablecer-contrasena" 
                element={<ClientResetPassword />} 
            />
            <Route 
                path="/portal-cliente/dashboard" 
                element={<ClientDashboard />} 
            />
            <Route 
                path="/portal-cliente/entrenar/:idRoutineAssignment" 
                element={<TrainingMode />} 
            />
        </Routes>
    );
}

export default PublicRoutes;
