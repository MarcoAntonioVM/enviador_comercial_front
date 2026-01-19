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
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Mostrar toast de éxito
            try {
                showSuccess(`Bienvenido ${data.user.name}`, 'Sesión iniciada');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
            navigate(paths.DASHBOARD);
        },
        onError: (error: Error) => {
            console.error('Error en login:', error.message);
            try {
                showError(error.message || 'Error al iniciar sesión', 'Error');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
        },
    });
};
