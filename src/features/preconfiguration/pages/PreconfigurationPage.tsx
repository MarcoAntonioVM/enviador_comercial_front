import React, { useState } from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { confirmDialog } from 'primereact/confirmdialog';
import usePreconfigurations from '../hooks/usePreconfigurations';
import useDeletePreconfiguration from '../hooks/useDeletePreconfiguration';
import { useAppToast } from '@/components/Toast/ToastProvider';

const columns: PrimeColumn[] = [
    {
        field: 'sender_email',
        header: 'Remitente',
        body: (row: any) => row.sender_email ?? row.sender_name ?? '-',
    },
    { field: 'template_name', header: 'Plantilla' },
    { field: 'days_week_display', header: 'Días' },
    { field: 'hour_display', header: 'Hora' },
];

export const PreconfigurationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, refresh } = usePreconfigurations();
    const { remove } = useDeletePreconfiguration();
    const { showSuccess, showError } = useAppToast();
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const handleAdd = () => {
        navigate(paths.PRECONFIGURATIONS_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.PRECONFIGURATIONS_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar la preconfiguración "${row.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await remove(row.id);
                    showSuccess('Preconfiguración eliminada correctamente');
                    refresh();
                } catch (e: any) {
                    showError(e?.message || 'Error al eliminar preconfiguración');
                }
            },
        });
    };

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Preconfiguraciones</h1>
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preconfiguraciones</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Configuraciones predefinidas para envíos de email
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            label="Agregar preconfiguración"
                            icon="pi pi-plus"
                            className="p-button-sm"
                            onClick={handleAdd}
                        />
                    </div>
                </div>
                <PrimeDataTable
                    value={items}
                    columns={columns}
                    paginator
                    rows={10}
                    showActions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectionMode="checkbox"
                    selection={selectedItems}
                    onSelectionChange={setSelectedItems}
                    dataKey="id"
                />
            </div>
        </div>
    );
};

export default PreconfigurationsPage;