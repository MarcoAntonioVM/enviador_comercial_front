import { useEffect, useState } from 'react';
import type { Sender } from '../senders.types';
import { sendersService } from '../senders.service';

export default function useSenders() {
  const [items, setItems] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await sendersService.list();
    setItems(data.senders);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { 
    items, 
    loading,
    refresh: fetchData 
  };
}
