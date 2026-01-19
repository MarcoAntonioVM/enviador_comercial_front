import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings } from 'lucide-react';
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
        <nav className={`h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between ${className}`}>
            {/* Lado izquierdo - Título o breadcrumb */}
            <div className="flex items-center">
                <h1 className="text-lg font-medium text-gray-700">
                    Panel de Control
                </h1>
            </div>

            {/* Lado derecho - Info del usuario */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {user?.name ? getInitials(user.name) : <User className="w-5 h-5" />}
                    </div>

                    {/* Nombre y rol */}
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">
                            {user?.name || 'Usuario'}
                        </span>
                        {/* <span className="text-xs text-gray-500 capitalize">
                            {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span> */}
                    </div>

                    {/* Chevron */}
                    <ChevronDown 
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                        }`} 
                    />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Header del dropdown */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || 'Usuario'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || 'Sin correo'}
                            </p>
                        </div>

                        {/* Opciones del menú */}
                        <div className="py-1">

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
