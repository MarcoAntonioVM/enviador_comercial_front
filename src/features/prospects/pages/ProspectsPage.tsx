import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import useProspects from '../hooks/useProspects';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { useAppToast } from '@/components/Toast/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import useDeleteProspect from '../hooks/useDeleteProspect';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'company', header: 'Empresa' },
    { field: 'sector_name', header: 'Sector', body: (row: any) => row.sector_name ?? '' },
    { field: 'emails', header: 'Correos', body: (row: any) => { const e = row.emails || []; return e.length ? e.join(', ') : 'No hay'; } },
    { field: 'metadata', header: 'Metadatos', body: (row: any) => { const m = row.metadata || []; return m.length ? m.join(', ') : 'No hay'; } },
];

export const ProspectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, refresh } = useProspects();
    const { remove } = useDeleteProspect();
    const { showSuccess, showError } = useAppToast();

    const handleAdd = () => {
        navigate(paths.PROSPECTS_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.PROSPECTS_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el prospecto "${row.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await remove(row.id);
                    refresh();
                    showSuccess(`Prospecto eliminado correctamente`);
                } catch (e: any) {
                    showError(e?.message || 'Error al eliminar prospecto');
                }
            }
        });
    };

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Prospectos</h1>

            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prospectos</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Listado de prospectos</p>
                    </div>
                    <div>
                        <Button label="Agregar prospecto" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
                    </div>
                </div>

                <PrimeDataTable value={items} columns={columns} paginator rows={10} showActions onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default ProspectsPage;

