import { useState } from 'react';
import { templatesService } from '../templates.service';

type CreateTemplatePayload = {
  name: string;
  subject?: string;
  html_content: string;
  active?: boolean;
};

export default function useCreateTemplate() {
  const [loading, setLoading] = useState(false);

  const create = async (data: CreateTemplatePayload) => {
    setLoading(true);
    try {
      return await templatesService.create(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
