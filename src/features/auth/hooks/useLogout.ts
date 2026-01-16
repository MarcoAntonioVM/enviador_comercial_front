import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../authService';
import { paths } from '@/routes/paths';

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Limpiar todo el localStorage (token, user, etc.)
            localStorage.clear();
            // Invalidar queries del usuario
            queryClient.removeQueries({ queryKey: ['me'] });
            navigate(paths.LOGIN);
        },
        onError: () => {
            // Aunque falle el logout en el server, limpiamos localmente
            localStorage.clear();
            queryClient.removeQueries({ queryKey: ['me'] });
            navigate(paths.LOGIN);
        },
    });
};
