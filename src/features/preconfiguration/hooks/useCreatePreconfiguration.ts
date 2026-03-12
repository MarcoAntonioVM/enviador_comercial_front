import { useState } from 'react';
import type { Preconfiguration } from '../preconfiguration.types';
import { preconfigurationsService } from '../preconfiguration.service';

export default function useCreatePreconfiguration() {
  const [loading, setLoading] = useState(false);

  const create = async (data: Partial<Preconfiguration>) => {
    setLoading(true);
    try {
      return await preconfigurationsService.create(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
