import { useState } from 'react';
import type { Sector } from '../sectors.types';
import { sectorsService } from '../sectors.service';

export default function useUpdateSector() {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, data: Omit<Sector, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await sectorsService.update(id, data);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
