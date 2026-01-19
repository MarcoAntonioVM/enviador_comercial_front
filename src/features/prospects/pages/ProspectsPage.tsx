import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { prospects } from '@/data/prospects';
import { Button } from 'primereact/button';
import { useAppToast } from '@/components/Toast/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'email', header: 'Email' },
    { field: 'name', header: 'Name' },
    { field: 'company', header: 'Company' },
    { field: 'sector_id', header: 'Sector ID' },
    { field: 'status', header: 'Status' },
    { field: 'metadata', header: 'Metadata', body: (row: any) => JSON.stringify(row.metadata || {}) },
    {
        field: 'createdAt',
        header: 'Created At',
        body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString(),
    },
];

export const ProspectsPage: React.FC = () => {
    const { showInfo } = useAppToast();
    const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold mb-4">Prospects</h1>

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

                <PrimeDataTable value={prospects} columns={columns} paginator rows={10} showActions onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default ProspectsPage;

