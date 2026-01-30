import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { confirmDialog } from 'primereact/confirmdialog';
import useTemplates from '../hooks/useTemplates';

const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'subject', header: 'Asunto' },
];

export const TemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useTemplates();

    const handleAdd = () => {
        navigate(paths.TEMPLATES_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.TEMPLATES_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar la plantilla "${row.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                console.log('Eliminar plantilla (mock):', row.id);
            }
        });
    };

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Plantillas</h1>

            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Plantillas</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Listado de plantillas de email</p>
                    </div>
                    <div>
                        <Button label="Agregar plantilla" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
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

export default TemplatesPage;
