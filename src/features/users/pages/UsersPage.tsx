import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import users from '@/data/users';
import { Button } from 'primereact/button';
import { useAppToast } from '@/components/Toast/ToastProvider';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
    { field: 'status', header: 'Status' },
    {
        field: 'createdAt',
        header: 'Created At',
        body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString(),
    },
];

export const UsersPage: React.FC = () => {
    const { showInfo } = useAppToast();

    const handleAdd = () => {
        showInfo('Abrir formulario para agregar usuario', 'Agregar usuario');
    };
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <div className="card bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Usuarios</h2>
                        <p className="text-sm text-gray-600">Listado de usuarios del sistema</p>
                    </div>
                    {/* Add button on the right */}
                    <div>
                        <Button label="Agregar usuario" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
                    </div>
                </div>

                <PrimeDataTable value={users} columns={columns} paginator rows={10} />
            </div>
        </div>
    );
};

export default UsersPage;
