import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth';
import type { User as UserType } from '@/features/auth/auth.types';

interface NavbarProps {
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    // Obtener usuario del localStorage
    const getUserFromStorage = (): UserType | null => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                return JSON.parse(userStr) as UserType;
            }
        } catch {
            console.error('Error al parsear usuario del localStorage');
        }
        return null;
    };

    const user = getUserFromStorage();

    // Obtener iniciales del nombre
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <nav className={`h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between ${className}`}>
            {/* Lado izquierdo - Título */}
            <div className="flex items-center">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                    Panel de Control
                </h2>
            </div>

            {/* Lado derecho - Info del usuario */}
            <div className="relative flex items-center gap-4" ref={dropdownRef}>
                {/* Nombre y rol */}
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-slate-900">
                        {user?.name || 'Usuario'}
                    </span>
                    <span className="text-xs text-slate-500">
                        {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                </div>

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative group"
                >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-blue-500/20 ring-2 ring-transparent group-hover:ring-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-500/20">
                        {user?.name ? getInitials(user.name) : <User className="w-5 h-5" />}
                    </div>
                    {/* Indicador de estado online */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 py-1 z-50">
                        {/* Header del dropdown */}
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {user?.name || 'Usuario'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || 'Sin correo'}
                            </p>
                        </div>

                        {/* Opciones del menú */}
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
