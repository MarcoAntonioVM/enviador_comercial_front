import { useEffect, useState } from 'react';
import type { Template } from '../templates.types';
import { templatesService } from '../templates.service';

export default function useTemplate(id?: string) {
  const [item, setItem] = useState<Template | null>(null);

  const load = async () => {
    if (!id) return;
    const res = await templatesService.getById(id);
    setItem(res);
  };

  useEffect(() => {
    load();
  }, [id]);

  return { item, refresh: load };
}
