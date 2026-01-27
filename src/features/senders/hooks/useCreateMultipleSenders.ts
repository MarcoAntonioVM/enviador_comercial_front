import { useState } from 'react';
import { sendersService } from '../senders.service';

type CreateMultipleSendersData = {
  name: string;
  email: string;
  reply_to?: string;
  signature?: string;
  daily_limit?: number;
}[];

const useCreateMultipleSenders = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createMultiple = async (data: CreateMultipleSendersData): Promise<any> => {
    setIsLoading(true);
    try {
      const result = await sendersService.createMultiple(data as any);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMultiple,
    isLoading,
  };
};

export default useCreateMultipleSenders;