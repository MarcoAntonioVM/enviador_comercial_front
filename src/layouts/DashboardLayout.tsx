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
        <div className="min-h-screen bg-slate-100">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            
            {/* Main content */}
            <div className="sm:ml-64 flex flex-col min-h-screen">
                {/* Mobile header */}
                <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 sm:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <SidebarToggle onClick={toggleSidebar} />
                            <span className="ml-3 text-lg font-semibold text-white">Enviador</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navbar */}
                <div className="hidden sm:block sticky top-0 z-20">
                    <Navbar />
                </div>

                {/* Page content */}
                <main className="p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
