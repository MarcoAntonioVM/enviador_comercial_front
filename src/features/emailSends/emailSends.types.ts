export type EmailSendStatus = 
  | 'pending'    // Pendiente de envío
  | 'sent'       // Enviado
  | 'delivered'  // Entregado al servidor destino
  | 'opened'     // Abierto por el destinatario
  | 'clicked'    // El destinatario hizo click en un enlace
  | 'bounced'    // Rebotado (email no existe)
  | 'failed';    // Falló el envío

export type EmailSend = {
  id: string;
  campaignId?: string;       // ID de la campaña (si aplica)
  campaignName?: string;     // Nombre de la campaña
  templateId?: string;       // ID del template usado
  templateName?: string;     // Nombre del template
  recipientEmail: string;    // Email del destinatario
  recipientName?: string;    // Nombre del destinatario
  subject: string;           // Asunto del email
  status: EmailSendStatus;   // Estado del envío
  sentAt?: string;           // Fecha de envío
  deliveredAt?: string;      // Fecha de entrega
  openedAt?: string;         // Fecha de apertura
  clickedAt?: string;        // Fecha del click
  errorMessage?: string;     // Mensaje de error (si falló)
  createdAt: string;
};
