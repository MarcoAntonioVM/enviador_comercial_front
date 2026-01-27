import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import useProspects from '../hooks/useProspects';
import useSectors from '@/features/sectors/hooks/useSectors';
import { Button } from 'primereact/button';
import { useAppToast } from '@/components/Toast/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';

const columns = (sectors: { id: string; name: string }[]): PrimeColumn[] => [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'company', header: 'Empresa' },
    { field: 'sector_id', header: 'Sector', body: (row: any) => (sectors.find(s => s.id === row.sector_id)?.name ?? row.sector_id ?? '') },
    { field: 'status', header: 'Estado' },
    { field: 'emails', header: 'Correos', body: (row: any) => (row.emails || []).join(', ') },
    { field: 'metadata', header: 'Metadatos', body: (row: any) => (row.metadata || []).join(', ') },
];

export const ProspectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useProspects();
    const { items: sectors } = useSectors();

    const handleAdd = () => {
        navigate(paths.PROSPECTS_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.PROSPECTS_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        if (!window.confirm(`Eliminar prospecto ${row.name}?`)) return;
        console.log('Eliminar prospecto (mock):', row.id);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Prospectos</h1>

            <div className="card bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Prospectos</h2>
                        <p className="text-sm text-gray-600">Listado de prospectos</p>
                    </div>
                    <div>
                        <Button label="Agregar prospecto" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
                    </div>
                </div>

                <PrimeDataTable value={items} columns={columns(sectors)} paginator rows={10} showActions onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default ProspectsPage;

