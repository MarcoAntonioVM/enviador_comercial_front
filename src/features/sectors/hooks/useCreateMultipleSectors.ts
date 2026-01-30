import { useState } from 'react';
import { sectorsService } from '../sectors.service';

type CreateMultipleSectorsData = {
  name: string;
  description?: string;
  active?: boolean;
}[];

const useCreateMultipleSectors = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createMultiple = async (data: CreateMultipleSectorsData): Promise<any> => {
    setIsLoading(true);
    try {
      const result = await sectorsService.createMultiple(data as any);
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

export default useCreateMultipleSectors;
