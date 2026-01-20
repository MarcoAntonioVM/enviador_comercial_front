import { useEffect, useState } from 'react';
import type { Sector } from '../sectors.types';
import { sectorsService } from '../sectors.service';

export default function useSectors() {
  const [items, setItems] = useState<Sector[]>([]);

  useEffect(() => {
    sectorsService.list().then(setItems);
  }, []);

  return { items, refresh: () => sectorsService.list().then(setItems) };
}
