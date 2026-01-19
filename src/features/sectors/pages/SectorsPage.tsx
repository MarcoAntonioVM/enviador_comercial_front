import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import sectors from '@/data/sectors';
import { Button } from 'primereact/button';
import { useAppToast } from '@/components/Toast/ToastProvider';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    {
        field: 'createdAt',
        header: 'Created At',
        body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString(),
    },
];

export const SectorsPage: React.FC = () => {
    const { showInfo } = useAppToast();

    const handleAdd = () => {
        showInfo('Abrir formulario para agregar sector', 'Agregar sector');
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Sectors</h1>

            <div className="card bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Sectores</h2>
                        <p className="text-sm text-gray-600">Listado de sectores</p>
                    </div>

                    <div>
                        <Button label="Agregar sector" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
                    </div>
                </div>

                <PrimeDataTable value={sectors} columns={columns} paginator rows={10} />
            </div>
        </div>
    );
};

export default SectorsPage;
