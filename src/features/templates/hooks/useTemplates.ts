import { useEffect, useState } from 'react';
import type { Template, TemplatesPagination } from '../templates.types';
import { templatesService } from '../templates.service';

export default function useTemplates() {
  const [items, setItems] = useState<Template[]>([]);
  const [pagination, setPagination] = useState<TemplatesPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await templatesService.list({ page, limit });
      setItems(res.templates ?? []);
      setPagination(res.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return {
    items,
    pagination,
    loading,
    error,
    refresh: () => load(pagination.page, pagination.limit),
  };
}
