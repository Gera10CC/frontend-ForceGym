import { Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import { useLogin } from '../Login/useLogin';
import ForgotPasswordForm from '../Login/ForgotPasswordForm';
import ChangePasswordForm from '../Login/ChangePasswordForm';

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
        </Routes>
    );
}

export default PublicRoutes;
