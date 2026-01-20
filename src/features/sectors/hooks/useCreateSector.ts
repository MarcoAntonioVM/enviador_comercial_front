import { useState } from 'react';
import type { Sector } from '../sectors.types';
import { sectorsService } from '../sectors.service';

export default function useCreateSector() {
  const [loading, setLoading] = useState(false);

  const create = async (data: Omit<Sector, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await sectorsService.create(data);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
