import { useEffect, useState } from 'react';
import type { EmailSend } from '../emailSends.types';
import { emailSendsService } from '../emailSends.service';

export default function useEmailSends() {
  const [items, setItems] = useState<EmailSend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emailSendsService.list()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return { 
    items, 
    loading,
    refresh: () => {
      setLoading(true);
      emailSendsService.list()
        .then(setItems)
        .finally(() => setLoading(false));
    }
  };
}
