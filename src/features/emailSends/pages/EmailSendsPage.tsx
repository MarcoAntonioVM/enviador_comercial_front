import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import useEmailSends from '../hooks/useEmailSends';
import type { EmailSendStatus } from '../emailSends.types';

// Componente para mostrar el estado con colores
const StatusTag: React.FC<{ status: EmailSendStatus }> = ({ status }) => {
  const config: Record<EmailSendStatus, { label: string; severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary'; icon: string }> = {
    pending: { label: 'Pendiente', severity: 'secondary', icon: 'pi pi-clock' },
    sent: { label: 'Enviado', severity: 'info', icon: 'pi pi-send' },
    delivered: { label: 'Entregado', severity: 'success', icon: 'pi pi-check' },
    opened: { label: 'Abierto', severity: 'success', icon: 'pi pi-eye' },
    clicked: { label: 'Click', severity: 'success', icon: 'pi pi-external-link' },
    bounced: { label: 'Rebotado', severity: 'warning', icon: 'pi pi-exclamation-triangle' },
    failed: { label: 'Fallido', severity: 'danger', icon: 'pi pi-times' },
  };

  const { label, severity, icon } = config[status] || { label: status, severity: 'secondary', icon: 'pi pi-question' };
  
  return <Tag value={label} severity={severity} icon={icon} />;
};

// Formato de fecha amigable
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const columns: PrimeColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'recipientEmail', header: 'Destinatario' },
  { field: 'subject', header: 'Asunto' },
  { field: 'campaignName', header: 'Campaña' },
  { 
    field: 'status', 
    header: 'Estado',
    body: (row: any) => <StatusTag status={row.status} />
  },
  { 
    field: 'sentAt', 
    header: 'Enviado',
    body: (row: any) => formatDate(row.sentAt)
  },
  { 
    field: 'openedAt', 
    header: 'Abierto',
    body: (row: any) => formatDate(row.openedAt)
  },
];

export const EmailSendsPage: React.FC = () => {
  const { items, loading, refresh } = useEmailSends();

  // Estadísticas rápidas
  const stats = {
    total: items.length,
    opened: items.filter(i => i.status === 'opened' || i.status === 'clicked').length,
    bounced: items.filter(i => i.status === 'bounced').length,
    failed: items.filter(i => i.status === 'failed').length,
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Envíos de Email</h1>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-500 dark:border dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total enviados</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-500 dark:border dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">Abiertos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.opened}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-yellow-500 dark:border dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">Rebotados</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.bounced}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-red-500 dark:border dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">Fallidos</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
        </div>
      </div>

      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Historial de Envíos</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Todos los emails enviados desde la plataforma
            </p>
          </div>
          <Button 
            label="Actualizar" 
            icon="pi pi-refresh" 
            className="p-button-sm p-button-outlined"
            onClick={refresh}
            loading={loading}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <i className="pi pi-spin pi-spinner text-2xl text-gray-400 dark:text-gray-500"></i>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Cargando envíos...</span>
          </div>
        ) : (
          <PrimeDataTable 
            value={items} 
            columns={columns} 
            paginator 
            rows={10}
          />
        )}
      </div>
    </div>
  );
};

export default EmailSendsPage;
