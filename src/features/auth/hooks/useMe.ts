import { useQuery } from '@tanstack/react-query';
import { authService } from '../authService';

// export const useMe = () => {
//     return useQuery({
//         queryKey: ['me'],
//         queryFn: () => authService.me(),
//         retry: false,
//         staleTime: 1000 * 60 * 5, // 5 minutos
//     });
// };
