import { useState } from 'react';
import { templatesService } from '../templates.service';

export default function useDeleteTemplate() {
  const [loading, setLoading] = useState(false);

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await templatesService.delete(id);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}
