import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { users } from '@/data/users';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { paths } from '@/routes/paths';

export const UsersPage: React.FC = () => {
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate(paths.USERS_NEW);
    };

    const handleEdit = (user: any) => {
        navigate(paths.USERS_EDIT.replace(':id', user.id));
    };

    const handleDelete = (user: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar a ${user.name}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                console.log('Eliminar usuario (mock):', user.id);
            }
        });
    };

    const columns: PrimeColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Nombre' },
        { field: 'email', header: 'Correo Electrónico' },
        { field: 'role', header: 'Rol' },
        { field: 'status', header: 'Estado' },
        // acciones manejadas por PrimeDataTable vía onEdit / onDelete
    ];


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

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

                <PrimeDataTable
                    value={users}
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

export default UsersPage;
