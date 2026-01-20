import { useEffect, useState } from 'react';
import type { Sector } from '../sectors.types';
import { sectorsService } from '../sectors.service';

export default function useSector(id?: string) {
  const [item, setItem] = useState<Sector | null>(null);

  useEffect(() => {
    if (!id) return;
    sectorsService.get(id).then((res) => setItem(res || null));
  }, [id]);

  return { item, refresh: () => (id ? sectorsService.get(id).then((r) => setItem(r || null)) : Promise.resolve(null)) };
}
