import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../auth.schema';
import { useLogin } from '../hooks/useLogin';
import { paths } from '@/routes/paths';

export const LoginForm: React.FC = () => {
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                    Correo electrónico o usuario
                </label>
                <input
                    type="text"
                    id="email"
                    placeholder="correo@ejemplo.com o usuario"
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 placeholder-gray-400"
                    {...register('email')}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 placeholder-gray-400"
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link
                    to={paths.FORGOT_PASSWORD}
                    className="text-sm font-medium text-gray-600 hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
        </form>
    );
};
