import { useState } from 'react';
import type { Sender } from '../senders.types';
import { sendersService } from '../senders.service';

export default function useUpdateSender() {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, data: Partial<Sender>) => {
    setLoading(true);
    try {
      return await sendersService.update(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
