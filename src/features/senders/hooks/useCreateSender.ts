import { useState } from 'react';
import type { Sender } from '../senders.types';
import { sendersService } from '../senders.service';

export default function useCreateSender() {
  const [loading, setLoading] = useState(false);

  const create = async (data: Partial<Sender>) => {
    setLoading(true);
    try {
      return await sendersService.create(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
