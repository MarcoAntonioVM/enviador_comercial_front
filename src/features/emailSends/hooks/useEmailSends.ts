import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { EmailSend, EmailSendsPagination } from '../emailSends.types';
import { emailSendsService } from '../emailSends.service';

const ROWS_PER_PAGE = 10;

const defaultPagination: EmailSendsPagination = {
  page: 1,
  limit: ROWS_PER_PAGE,
  total: 0,
  totalPages: 1,
};

export default function useEmailSends() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['emailSends', page],
    queryFn: () => emailSendsService.list({ page, limit: ROWS_PER_PAGE }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  return {
    items: data?.emailSends ?? [] as EmailSend[],
    pagination: data?.pagination ?? defaultPagination,
    loading: isLoading,
    page,
    setPage,
    refresh: () => refetch(),
  };
}
