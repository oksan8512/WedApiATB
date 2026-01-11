import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
                                                     children,
                                                     redirectTo = '/login'
                                                 }) => {
    // Перевіряємо наявність токена в localStorage
    const token = localStorage.getItem('authToken');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;