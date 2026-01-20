import type { EmailSend } from './emailSends.types';
import { emailSendsMock } from './emailSends.mock';

export const emailSendsService = {
  // Obtener todos los envíos de email
  list: async (): Promise<EmailSend[]> => {
    // Simula un delay de red
    return Promise.resolve(emailSendsMock);
  },

  // Obtener un envío por ID (por si lo necesitas en el futuro)
  get: async (id: string): Promise<EmailSend | undefined> => {
    return emailSendsMock.find((e) => e.id === id);
  },
};
