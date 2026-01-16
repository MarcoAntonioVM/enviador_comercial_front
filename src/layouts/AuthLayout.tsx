import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
    const token = localStorage.getItem('token');

    // Si ya está autenticado, redirigir al dashboard
    if (token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-dvh w-full">
            <Outlet />
        </div>
    );
};
