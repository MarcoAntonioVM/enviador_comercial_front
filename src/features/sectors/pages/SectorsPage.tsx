import React from 'react';
import PrimeDataTable, { type PrimeColumn } from '@/components/PrimeTable/PrimeDataTable';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { confirmDialog } from 'primereact/confirmdialog';
import useSectors from '../hooks/useSectors';
import useDeleteSector from '../hooks/useDeleteSector';
import useCreateMultipleSectors from '../hooks/useCreateMultipleSectors';
import { useAppToast } from '@/components/Toast/ToastProvider';
import { ExcelUploader } from '@/components/ExcelUploader/ExcelUploader';


const columns: PrimeColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción' },
];

export const SectorsPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, refresh } = useSectors();
    const { remove } = useDeleteSector();
    const { createMultiple } = useCreateMultipleSectors();
    const { showSuccess, showError } = useAppToast();

    const handleAdd = () => {
        navigate(paths.SECTORS_NEW);
    };

    const handleEdit = (row: any) => {
        navigate(paths.SECTORS_EDIT.replace(':id', row.id));
    };

    const handleDelete = (row: any) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el sector "${row.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await remove(row.id)
                    showSuccess(`Sector eliminado correctamente`)
                    refresh()
                } catch (e: any) {
                    showError(e?.message || 'Error al eliminar sector')
                }
            }
        });
    };

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Sectores</h1>

            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sectores</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Listado de sectores del sistema</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExcelUploader<{ name: string; description: string }>
                            config={{ 
                                columnMapping: { 
                                    'Nombre': 'name', 
                                    'Descripción': 'description'
                                }, 
                                hasHeader: true,
                                transformRow: (row) => ({
                                    name: String(row.name ?? '').trim(),
                                    description: String(row.description ?? '').trim()
                                }),
                            }}
                            onFileRead={async (data) => {
                                try {
                                    const sectorsData = data.map(item => ({
                                        name: item.name,
                                        description: item.description
                                    }));
                                    const res = await createMultiple(sectorsData);
                                    if (res?.success) {
                                        showSuccess(res.message ?? `Se importaron ${res.created?.length ?? data.length} sector(es)`);
                                    } else {
                                        showError(res?.message ?? 'Error al importar sectores');
                                    }
                                    refresh();
                                } catch (e: any) {
                                    showError(e?.message || 'Error al importar sectores');
                                }
                            }}
                            onError={(msg) => showError(msg)}
                            buttonLabel="Importar Excel"
                            buttonIcon="pi pi-file-excel"
                            asModal={true}
                            modalTitle="Importar Sectores desde Excel"
                            previewColumns={[
                                { field: 'name', header: 'Nombre' },
                                { field: 'description', header: 'Descripción' }
                            ]}
                            modalInfo={
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border dark:border-blue-700">
                                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Formato esperado:</h4>
                                    <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                                        <li>• Primera fila debe contener los encabezados</li>
                                        <li>• Columna "Nombre": Nombre del sector (obligatorio)</li>
                                        <li>• Columna "Descripción": Descripción del sector (opcional)</li>
                                    </ul>
                                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                                        <strong>Nota:</strong> Los sectores se crearán con estado activo por defecto.
                                    </p>
                                </div>
                            }
                        />
                        <Button label="Agregar sector" icon="pi pi-plus" className="p-button-sm" onClick={handleAdd} />
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

export default SectorsPage;
