import { useEffect, useState } from 'react';
import type { Sender } from '../senders.types';
import { sendersService } from '../senders.service';

export default function useSender(id?: string) {
  const [item, setItem] = useState<Sender | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    sendersService.getById(id).then((res) => {
      setItem(res || null);
      setLoading(false);
    });
  }, [id]);

  return { 
    item, 
    loading,
    refresh: () => (id ? sendersService.getById(id).then((r) => setItem(r || null)) : Promise.resolve(null)) 
  };
}
