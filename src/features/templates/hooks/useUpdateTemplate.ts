import { useState } from 'react';
import { templatesService } from '../templates.service';

type UpdateTemplatePayload = {
  name?: string;
  subject?: string;
  html_content?: string;
  active?: boolean;
};

export default function useUpdateTemplate() {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, data: UpdateTemplatePayload) => {
    setLoading(true);
    try {
      return await templatesService.update(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
