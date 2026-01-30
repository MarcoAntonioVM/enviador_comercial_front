import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordFormData } from '../auth.schema';
import { paths } from '@/routes/paths';

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        // TODO: Implementar con useResetPassword hook
        console.log('Reset password:', { ...data, token });
    };

    if (!token) {
        return (
            <section className="min-h-dvh bg-gray-200 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh">
                    <div className="w-full rounded-lg shadow-lg backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/20 md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
                            <h1 className="text-xl font-bold text-black dark:text-white md:text-2xl">
                                Enlace inválido
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                El enlace de recuperación es inválido o ha expirado.
                            </p>
                            <Link
                                to={paths.FORGOT_PASSWORD}
                                className="inline-block text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline"
                            >
                                Solicitar nuevo enlace
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-dvh bg-gray-200 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh">
                <div className="w-full rounded-lg shadow-lg backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/20 md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black dark:text-white md:text-2xl">
                            Nueva contraseña
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                            Ingresa tu nueva contraseña.
                        </p>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black dark:text-white">
                                    Nueva contraseña
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

                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-black dark:text-white">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 block w-full p-2.5 placeholder-gray-400 dark:placeholder-gray-300"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Restablecer contraseña
                            </button>

                            <div className="text-center">
                                <Link
                                    to={paths.LOGIN}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline"
                                >
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
