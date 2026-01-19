import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth.service';
import { paths } from '@/routes/paths';
import { useAppToast } from '@/components/Toast/ToastProvider';

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAppToast();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Limpiar todo el localStorage (token, user, etc.)
            localStorage.clear();
            // Invalidar queries del usuario
            queryClient.removeQueries({ queryKey: ['me'] });
            try {
                showSuccess('Sesión finalizada', 'Hasta luego');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
            navigate(paths.LOGIN);
        },
        onError: () => {
            // Aunque falle el logout en el server, limpiamos localmente
            localStorage.clear();
            queryClient.removeQueries({ queryKey: ['me'] });
            try {
                showError('No se pudo cerrar la sesión', 'Error');
            } catch (e) {
                // Silenciar si el provider no está disponible
            }
            navigate(paths.LOGIN);
        },
    });
};
