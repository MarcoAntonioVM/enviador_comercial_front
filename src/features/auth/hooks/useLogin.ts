import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth.service';
import type { LoginPayload } from '../auth.types';
import { paths } from '@/routes/paths';
import { useAppToast } from '@/components/Toast/ToastProvider';

export const useLogin = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useAppToast();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            // Guardar refreshToken sólo si viene; eliminar si no
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }

            // Guardar campos necesarios unicamente
            const minimalUser = {
                id: data.user.id,
                name: data.user.name,
                role: data.user.role ?? 'user',
                email: data.user.email ?? '',
                createdAt: data.user.createdAt ?? new Date().toISOString(),
            };

            localStorage.setItem('user', JSON.stringify(minimalUser));
            // Mostrar toast de éxito
            try {
                showSuccess(`Bienvenido ${data.user.name}`, 'Sesión iniciada');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
            navigate(paths.DASHBOARD);
        },
        onError: (error: Error) => {
            // console.error('Error en login:', error.message);
            try {
                showError(error.message || 'Error al iniciar sesión', 'Error');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
        },
    });
};
