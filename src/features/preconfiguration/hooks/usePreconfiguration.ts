import { useEffect, useState } from 'react';
import type { Preconfiguration } from '../preconfiguration.types';
import { preconfigurationsService } from '../preconfiguration.service';

export default function usePreconfiguration(id?: string) {
  const [item, setItem] = useState<Preconfiguration | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    preconfigurationsService.getById(id).then((res) => {
      setItem(res || null);
      setLoading(false);
    });
  }, [id]);

  return {
    item,
    loading,
    refresh: () =>
      id
        ? preconfigurationsService.getById(id).then((r) => setItem(r || null))
        : Promise.resolve(null),
  };
}
