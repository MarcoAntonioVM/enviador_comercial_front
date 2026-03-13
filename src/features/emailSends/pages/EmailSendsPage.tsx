import React, { useState } from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Tag } from 'primereact/tag';
import useEmailSends from '../hooks/useEmailSends';
import useEmailSendsStats from '../hooks/useEmailSendsStats';
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

// Formato: HH:mm DD/MM/YYYY
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${time} ${day}`;
};

export const EmailSendsPage: React.FC = () => {
  const { items, loading, pagination, setPage } = useEmailSends();
  const { stats } = useEmailSendsStats();
  const [first, setFirst] = useState(0);

  const handlePage = (e: { first: number; rows: number; page: number }) => {
    setFirst(e.first);
    setPage(e.page + 1); // PrimeReact paginea en base 0, la API en base 1
  };

  const columns: PrimeColumn[] = [
    { field: 'recipientEmail', header: 'Destinatario' },
    { field: 'subject', header: 'Asunto' },
    // {
    //   field: 'nextSendAt',
    //   header: 'Próximo envío',
    //   body: (row: any) => {
    //     const nextAt = row.nextSendAt || row.scheduledAt || null;
    //     if (!nextAt) return '-';
    //     return `${formatDate(nextAt)} ${formatTime(nextAt)}`;
    //   }
    // },
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
            showActions={false}
            lazy
            totalRecords={pagination.total}
            first={first}
            onPage={handlePage}
          />
        )}
      </div>
    </div>
  );
};

export default EmailSendsPage;
