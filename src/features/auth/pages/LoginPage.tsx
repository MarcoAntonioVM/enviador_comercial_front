import React from 'react';

export const LoginPage: React.FC = () => {
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('auth', 'true');
        window.location.href = '/';
    };

    return (
        <section className="min-h-dvh bg-gray-200 ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh">

                <div className="w-full rounded-lg shadow-lg backdrop-blur-lg bg-white/90 border border-white/20 md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl">
                            Iniciar sesión
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Correo electrónico</label>
                                <input type="email" name="email" id="email" className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 placeholder-gray-400" placeholder="correo@ejemplo.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Contraseña</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 placeholder-gray-400" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <a href="#" className="text-sm font-medium text-gray-600 hover:underline dark:text-gray-400">¿Olvidaste tu contraseña?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Iniciar sesión</button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
