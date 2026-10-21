import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const authUser = localStorage.getItem('auth_user');

  if (!authUser) {
    // Chưa đăng nhập -> điều hướng về /login kèm state { from: location }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
