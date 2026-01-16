import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../auth.schema';
import { paths } from '@/routes/paths';

export const ForgotPasswordPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        // TODO: Implementar con useForgotPassword hook
        console.log('Forgot password:', data);
    };

    return (
        <section className="min-h-dvh bg-gray-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh">
                <div className="w-full rounded-lg shadow-lg backdrop-blur-lg bg-white/90 border border-white/20 md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl">
                            Recuperar contraseña
                        </h1>
                        <p className="text-sm text-gray-600 text-center">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="correo@ejemplo.com"
                                    className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 placeholder-gray-400"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Enviar enlace
                            </button>

                            <div className="text-center">
                                <Link
                                    to={paths.LOGIN}
                                    className="text-sm font-medium text-gray-600 hover:underline"
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
