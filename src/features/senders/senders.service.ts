import type { Sender } from './senders.types';
import { sendersMock } from './senders.mock';

export const sendersService = {
  // Obtener todos los remitentes
  list: async (): Promise<Sender[]> => {
    return Promise.resolve(sendersMock);
  },

  // Obtener un remitente por ID
  get: async (id: string): Promise<Sender | undefined> => {
    return sendersMock.find((s) => s.id === id);
  },

  // Crear un nuevo remitente
  create: async (data: Partial<Sender>): Promise<Sender> => {
    const newSender: Sender = {
      id: `snd-${Date.now()}`,
      name: data.name || 'Sin nombre',
      email: data.email || '',
      reply_to: data.reply_to,
      signature: data.signature,
      daily_limit: data.daily_limit,
      createdAt: new Date().toISOString(),
    };
    sendersMock.push(newSender);
    return newSender;
  },

  // Actualizar un remitente existente
  update: async (id: string, data: Partial<Sender>): Promise<Sender | undefined> => {
    const idx = sendersMock.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    const updated = { 
      ...sendersMock[idx], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    sendersMock[idx] = updated;
    return updated;
  },
};
