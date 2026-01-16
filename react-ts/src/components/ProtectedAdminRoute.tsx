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
    roles?: string | string[];
    [key: string]: any;
}

const ProtectedAdminRoute: FC<ProtectedAdminRouteProps> = ({
    children,
    redirectTo = '/'
}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.log('🚫 Токен не знайдено, перенаправлення на /login');
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('🔐 ProtectedAdminRoute - Декодований токен:', decoded);
        
        // Шукаємо роль у ВСІХ можливих полях
        const role = 
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            decoded.role ||
            decoded.Role ||
            decoded.roles ||
            decoded.Roles;
        
        console.log('👤 ProtectedAdminRoute - Знайдена роль:', role);
        
        // Перевіряємо чи є роль Admin
        const isAdmin = Array.isArray(role) 
            ? role.includes('Admin') 
            : role === 'Admin';

        console.log('✅ ProtectedAdminRoute - Це адмін?', isAdmin);

        if (!isAdmin) {
            console.log('🚫 Не адмін, перенаправлення на', redirectTo);
            return <Navigate to={redirectTo} replace />;
        }

        console.log('✅ Доступ дозволено до admin панелі');
        return <>{children}</>;
    } catch (error) {
        console.error("❌ Помилка декодування токена:", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedAdminRoute;