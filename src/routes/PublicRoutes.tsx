import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useLogin } from '../Login/useLogin';

// Lazy loading para rutas públicas
const Login = lazy(() => import('../Login/Login'));
const ForgotPasswordForm = lazy(() => import('../Login/ForgotPasswordForm'));
const ChangePasswordForm = lazy(() => import('../Login/ChangePasswordForm'));
const ClientLogin = lazy(() => import('../ClientPortal/ClientLogin'));
const ClientDashboard = lazy(() => import('../ClientPortal/ClientDashboard'));
const TrainingMode = lazy(() => import('../ClientPortal/TrainingMode'));
const ClientForgotPassword = lazy(() => import('../ClientPortal/ClientForgotPassword'));
const ClientResetPassword = lazy(() => import('../ClientPortal/ClientResetPassword'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function PublicRoutes() {
    const { credencialUser, setCredencialUser, handleLoginSubmit, isSubmitting } = useLogin();
    
    return (
        <Suspense fallback={<PageLoader />}>
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
                {/* Rutas del Portal de Clientes - DESHABILITADO (pendiente de pago) */}
                 <Route 
                    path="/cliente" 
                    element={<ClientLogin />} 
                />
                <Route 
                    path="/cliente/recuperar-contrasena" 
                    element={<ClientForgotPassword />} 
                />
                <Route 
                    path="/cliente/restablecer-contrasena" 
                    element={<ClientResetPassword />} 
                />
                <Route 
                    path="/cliente/dashboard" 
                    element={<ClientDashboard />} 
                />
                <Route 
                    path="/cliente/entrenar/:idRoutineAssignment" 
                    element={<TrainingMode />} 
                /> 
            </Routes>
        </Suspense>
    );
}

export default PublicRoutes;
