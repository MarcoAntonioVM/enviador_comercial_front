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
    // Selection
    selectionMode?: 'single' | 'multiple' | 'checkbox';
    selection?: any[];
    onSelectionChange?: (selection: any[]) => void;
    dataKey?: string;
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
    selectionMode,
    selection,
    onSelectionChange,
    dataKey = 'id',
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
    const handleSelectionChange = (e: any) => {
        if (onSelectionChange) {
            onSelectionChange(e.value);
        }
    };

    const dataTableProps: any = {
        className: "p-datatable-custom",
        value: value,
        tableStyle: tableStyle,
        paginator: paginator,
        rows: rows,
    };

    if (selectionMode) {
        if (selectionMode === 'checkbox') {
            dataTableProps.selectionMode = 'checkbox';
            dataTableProps.cellSelection = false;
        } else {
            dataTableProps.selectionMode = selectionMode;
        }
        dataTableProps.selection = selection;
        dataTableProps.onSelectionChange = handleSelectionChange;
        dataTableProps.dataKey = dataKey;
    }

    return (
        <div className="card bg-white dark:bg-gray-800 border border-transparent dark:border-gray-600 rounded-lg">
            <DataTable {...dataTableProps}>
                {selectionMode && (
                    <Column 
                        selectionMode={selectionMode === 'checkbox' ? 'multiple' : selectionMode}
                        headerStyle={{ width: '3rem' }}
                        style={{ width: '3rem' }}
                    />
                )}
                {columns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body} style={col.style} />
                ))}

                {showActions && <Column header="Acciones" body={actionsBody} style={{ width: '120px' }} />}
            </DataTable>
        </div>
    );
};

export default PrimeDataTable;
