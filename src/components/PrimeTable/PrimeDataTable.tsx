import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export type PrimeColumn = {
    field: string;
    header?: string;
    body?: (rowData: any) => React.ReactNode;
    style?: React.CSSProperties;
};

interface PrimeDataTableProps {
    value: any[];
    columns: PrimeColumn[];
    tableStyle?: React.CSSProperties;
    paginator?: boolean;
    rows?: number;
    // Actions
    showActions?: boolean;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
}

export const PrimeDataTable: React.FC<PrimeDataTableProps> = ({
    value,
    columns,
    tableStyle,
    paginator = false,
    rows = 10,
    showActions = true,
    onEdit,
    onDelete,
}) => {

    const actionsBody = (rowData: any) => {
        return (
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text btn-edit"
                    aria-label="Editar"
                    onClick={() => onEdit && onEdit(rowData)}
                    disabled={!onEdit}
                />
                <Button
                    type="button"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger btn-delete"
                    aria-label="Eliminar"
                    onClick={() => onDelete && onDelete(rowData)}
                    disabled={!onDelete}
                />
            </div>
        );
    };
    return (
        <div className="card bg-white dark:bg-gray-800 border border-transparent dark:border-gray-600 rounded-lg">
            <DataTable className="p-datatable-custom" value={value} tableStyle={tableStyle} paginator={paginator} rows={rows}>
                {columns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body} style={col.style} />
                ))}

                {showActions && <Column header="Acciones" body={actionsBody} style={{ width: '120px' }} />}
            </DataTable>
        </div>
    );
};

export default PrimeDataTable;
