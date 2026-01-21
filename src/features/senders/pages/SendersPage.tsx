import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { confirmDialog } from 'primereact/confirmdialog';
import useSenders from '../hooks/useSenders';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'email', header: 'Email' },
];

export const SendersPage: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useSenders();

    const handleAdd = () => {
        navigate(paths.SENDERS_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.SENDERS_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el remitente "${row.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                console.log('Eliminar remitente (mock):', row.id);
            }
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Remitentes</h1>
            <div className="card bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Remitentes</h2>
                        <p className="text-sm text-gray-600">Listado de direcciones de email para envío</p>
                    </div>
                    <div>
                        <Button 
                            label="Agregar remitente" 
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
                />
            </div>
        </div>
    );
};

export default SendersPage;
