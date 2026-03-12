import { useState } from 'react';
import type { Preconfiguration } from '../preconfiguration.types';
import { preconfigurationsService } from '../preconfiguration.service';

export default function useUpdatePreconfiguration() {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, data: Partial<Preconfiguration>) => {
    setLoading(true);
    try {
      return await preconfigurationsService.update(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
