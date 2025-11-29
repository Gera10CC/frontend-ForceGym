import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthUser } from '../shared/utils/authentication';

type AppRole = 'Administrador' | 'Colaborador';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  redirectPath?: string;
}

const isAppRole = (role: any): role is AppRole => {
  return ['Administrador', 'Colaborador'].includes(role);
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectPath = '/gestion/dashboard'
}: ProtectedRouteProps) => {
  const user = getAuthUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.name;
  
  if (!isAppRole(userRole) || !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};