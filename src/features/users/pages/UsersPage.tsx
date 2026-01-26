import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import useUsers from '../hooks/useUsers';
import useDeleteUser from '../hooks/useDeleteUser';
import { useAppToast } from '@/components/Toast/ToastProvider';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { paths } from '@/routes/paths';

export const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const { items: users, refresh } = useUsers();
    const { remove, loading: deleting } = useDeleteUser();
    const { showSuccess, showError } = useAppToast();

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
            accept: async () => {
                try {
                    await remove(user.id)
                    showSuccess(`Usuario eliminado correctamente`)
                    refresh()
                } catch (e: any) {
                    showError(e?.message || 'Error al eliminar usuario')
                }
            }
        });
    };

    const columns: PrimeColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Nombre' },
        { field: 'email', header: 'Correo Electrónico' },
        { field: 'role', header: 'Rol' },
        { 
            field: 'active', 
            header: 'Estado',
            body: (rowData: any) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${rowData.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rowData.active ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
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
