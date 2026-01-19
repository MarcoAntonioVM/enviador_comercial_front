import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, SidebarToggle } from '../components/Sidebar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';

export const DashboardLayout: React.FC = () => {
    const token = localStorage.getItem('token');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Si no está autenticado, redirigir al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            
            {/* Main content */}
            <div className="sm:ml-64">
                {/* Mobile header */}
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 sm:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <SidebarToggle onClick={toggleSidebar} />
                            <span className="ml-3 text-lg font-semibold text-gray-900">Enviador</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navbar */}
                <div className="hidden sm:block sticky top-0 z-20">
                    <Navbar />
                </div>

                {/* Page content */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
