import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../authService';
import type { LoginPayload } from '../auth.types';
import { paths } from '@/routes/paths';

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: (data) => {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate(paths.DASHBOARD);
        },
        onError: (error: Error) => {
            console.error('Error en login:', error.message);
        },
    });
};
