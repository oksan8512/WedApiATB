import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedAdminRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

interface JwtPayload {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
    role?: string | string[];
}

const ProtectedAdminRoute: FC<ProtectedAdminRouteProps> = ({
    children,
    redirectTo = '/'
}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        // Отримуємо роль з токена (ASP.NET Identity зберігає роль у специфічному claim)
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;
        
        // Перевіряємо чи є роль Admin
        const isAdmin = Array.isArray(role) 
            ? role.includes('Admin') 
            : role === 'Admin';

        if (!isAdmin) {
            return <Navigate to={redirectTo} replace />;
        }

        return <>{children}</>;
    } catch (error) {
        console.error("Error decoding token:", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedAdminRoute;