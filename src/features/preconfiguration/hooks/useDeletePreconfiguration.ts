import { useState } from 'react';
import { preconfigurationsService } from '../preconfiguration.service';

export default function useDeletePreconfiguration() {
  const [loading, setLoading] = useState(false);

  const remove = async (id: string) => {
    setLoading(true);
    try {
      return await preconfigurationsService.delete(id);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}
