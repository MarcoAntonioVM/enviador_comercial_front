import { useQuery } from '@tanstack/react-query';
import type { EmailSendsStats } from '../emailSends.types';
import { emailSendsService } from '../emailSends.service';

const defaultStats: EmailSendsStats = {
  total: 0,
  sent: 0,
  delivered: 0,
  opened: 0,
  clicked: 0,
  bounced: 0,
  failed: 0,
  pending: 0,
};

export default function useEmailSendsStats() {
  const { data, isLoading, refetch } = useQuery<EmailSendsStats>({
    queryKey: ['emailSendsStats'],
    queryFn: () => emailSendsService.getStats(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    stats: data ?? defaultStats,
    loading: isLoading,
    refresh: () => refetch(),
  };
}
