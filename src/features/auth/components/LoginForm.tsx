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
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-white">
                    Correo electrónico o usuario
                </label>
                <input
                    type="text"
                    id="email"
                    placeholder="correo@ejemplo.com o usuario"
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 block w-full p-2.5 placeholder-gray-400 dark:placeholder-gray-300"
                    {...register('email')}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black dark:text-white">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 block w-full p-2.5 placeholder-gray-400 dark:placeholder-gray-300"
                    {...register('password')}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link
                    to={paths.FORGOT_PASSWORD}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
        </form>
    );
};
