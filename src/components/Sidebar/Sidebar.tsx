import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Megaphone,
    Users,
    FileText,
    Send,
    FileBox,
    BarChart3,
    UserCircle,
    LogOut,
    Mail,
    Menu,
    X
} from 'lucide-react';
import { paths } from '../../routes/paths';
import { useLogout } from '@/features/auth';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: paths.DASHBOARD },
    { icon: Megaphone, label: 'Campañas', path: paths.CAMPAIGNS },
    { icon: Users, label: 'Prospectos', path: paths.PROSPECTS },
    { icon: FileText, label: 'Plantillas', path: paths.TEMPLATES },
    { icon: Send, label: 'Remitentes', path: paths.SENDERS },
    { icon: FileBox, label: 'Documentos', path: paths.DOCUMENTS },
    { icon: Mail, label: 'Envíos', path: paths.EMAIL_SENDS },
    { icon: BarChart3, label: 'Analíticas', path: paths.ANALYTICS },
    { icon: UserCircle, label: 'Usuarios', path: paths.USERS },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 sm:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } sm:translate-x-0`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 border-r border-gray-200">
                    {/* Header con logo */}
                    <div className="flex items-center justify-between mb-5 px-2">
                        <span className="text-xl font-semibold text-gray-900">
                            Enviador
                        </span>
                        <button 
                            onClick={onToggle}
                            className="sm:hidden p-1 rounded hover:bg-gray-200"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Menu items */}
                    <ul className="space-y-1 font-medium">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => window.innerWidth < 640 && onToggle()}
                                        className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${
                                            isActive 
                                                ? 'bg-gray-200 text-gray-900' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <item.icon className={`w-5 h-5 transition-colors ${
                                            isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'
                                        }`} />
                                        <span className="ms-3">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Logout button at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center w-full px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                            <span className="ms-3">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Botón para abrir el sidebar en móvil
export const SidebarToggle: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className="inline-flex items-center p-2 text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
            <span className="sr-only">Abrir menú</span>
            <Menu className="w-6 h-6" />
        </button>
    );
};
