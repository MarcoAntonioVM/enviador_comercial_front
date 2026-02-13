import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Megaphone,
    Users,
    Briefcase,
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
    { icon: BarChart3, label: 'Analíticas', path: paths.ANALYTICS },
    // { icon: LayoutDashboard, label: 'Dashboard', path: paths.DASHBOARD },
    // { icon: Megaphone, label: 'Campañas', path: paths.CAMPAIGNS },
    { icon: Users, label: 'Prospectos', path: paths.PROSPECTS },
    { icon: FileText, label: 'Plantillas', path: paths.TEMPLATES },
    { icon: Send, label: 'Remitentes', path: paths.SENDERS },
    // { icon: Briefcase, label: 'Sectores', path: paths.SECTORS },
    // { icon: FileBox, label: 'Documentos', path: paths.DOCUMENTS },
    { icon: Mail, label: 'Envíos', path: paths.EMAIL_SENDS },
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
                <div className="h-full flex flex-col overflow-y-auto bg-slate-900 dark:bg-gray-900 border-r border-slate-800 dark:border-gray-700">
                    {/* Header con logo */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <Send className="w-5 h-5" />
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    Enviador
                                </h1>
                            </div>
                            <button 
                                onClick={onToggle}
                                className="sm:hidden p-1 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800"
                            >
                                <X className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => window.innerWidth < 640 && onToggle()}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive 
                                            ? 'text-white bg-blue-500/10 dark:bg-blue-500/20 border-r-4 border-blue-500' 
                                            : 'text-slate-400 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 hover:bg-white/5 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-colors ${
                                        isActive ? 'text-blue-500' : ''
                                    }`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button at bottom */}
                    <div className="p-4 border-t border-slate-800 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 dark:text-red-300 hover:text-red-300 dark:hover:text-red-200 hover:bg-red-400/10 dark:hover:bg-red-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Cerrar sesión</span>
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
            className="inline-flex items-center p-2 text-slate-400 dark:text-gray-400 rounded-lg sm:hidden hover:bg-slate-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-700 dark:focus:ring-gray-600"
        >
            <span className="sr-only">Abrir menú</span>
            <Menu className="w-6 h-6" />
        </button>
    );
};
