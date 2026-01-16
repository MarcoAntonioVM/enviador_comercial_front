import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
    const isAuthenticated = localStorage.getItem('auth') === 'true';

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-dvh w-full">
            <Outlet />
        </div>
    );
};
