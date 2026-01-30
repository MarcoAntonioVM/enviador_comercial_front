import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
    return (
        <section className="min-h-dvh bg-gray-200 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh">
                <div className="w-full rounded-lg shadow-lg backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/20 md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black dark:text-white md:text-2xl">
                            Iniciar sesión
                        </h1>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    );
};
