import { useEffect, useState } from 'react';
import type { Preconfiguration } from '../preconfiguration.types';
import { preconfigurationsService } from '../preconfiguration.service';

export default function usePreconfigurations() {
  const [items, setItems] = useState<Preconfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await preconfigurationsService.list();
    setItems(data.preconfigurations);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    items,
    loading,
    refresh: fetchData,
  };
}
