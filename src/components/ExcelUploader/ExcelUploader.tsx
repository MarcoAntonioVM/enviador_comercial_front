import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useExcelReader, type ExcelReaderConfig, type ExcelRow } from './hooks/useExcelReader';

type ExcelUploaderProps<T extends ExcelRow = ExcelRow> = {
  /**
   * Configuración para leer el archivo Excel
   */
  config: ExcelReaderConfig<T>;
  
  /**
   * Callback cuando se lee exitosamente el archivo
   */
  onFileRead: (data: T[]) => void | Promise<void>;
  
  /**
   * Callback cuando hay un error
   */
  onError?: (error: string) => void;
  
  /**
   * Texto del botón
   */
  buttonLabel?: string;
  
  /**
   * Icono del botón
   */
  buttonIcon?: string;
  
  /**
   * Tipos de archivo aceptados
   */
  accept?: string;
  
  /**
   * Si está deshabilitado
   */
  disabled?: boolean;
  
  /**
   * Si mostrar solo el botón (sin drag and drop)
   */
  buttonOnly?: boolean;
  
  /**
   * Si mostrar como modal que se abre con un botón
   */
  asModal?: boolean;
  
  /**
   * Título del modal (solo cuando asModal=true)
   */
  modalTitle?: string;
  
  /**
   * Información adicional a mostrar en el modal
   */
  modalInfo?: React.ReactNode;
  
  /**
   * Si mostrar vista previa antes de procesar
   */
  showPreview?: boolean;
  
  /**
   * Columnas para mostrar en la vista previa
   */
  previewColumns?: { field: string; header: string }[];
};

export function ExcelUploader<T extends ExcelRow = ExcelRow>({
  config,
  onFileRead,
  onError,
  buttonLabel = 'Subir Excel',
  buttonIcon = 'pi pi-upload',
  accept = '.xlsx,.xls',
  disabled = false,
  buttonOnly = false,
  asModal = false,
  modalTitle = 'Importar desde Excel',
  modalInfo,
  showPreview = false,
  previewColumns = [],
}: ExcelUploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<T[] | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = React.useState(false);
  const { readFile } = useExcelReader<T>();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const processFile = async (file: File) => {
    // Validar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      const errorMessage = 'Solo se permiten archivos Excel (.xlsx, .xls)';
      if (onError) {
        onError(errorMessage);
      } else {
        console.error('Error:', errorMessage);
      }
      return;
    }

    setIsProcessing(true);

    try {
      const data = await readFile(file, config);
      
      if (data.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo');
      }

      // Si es modal, siempre mostrar vista previa para confirmación
      if (asModal) {
        // Este caso no debería ejecutarse ya que el componente modal usa un componente anidado
        setPreviewData(data);
        setShowModal(false);
        setShowPreviewDialog(true);
      } else {
        // Procesar directamente cuando no es modal o es el componente anidado
        await onFileRead(data);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al procesar el archivo Excel';
      if (onError) {
        onError(errorMessage);
      } else {
        console.error('Error al leer Excel:', errorMessage);
      }
    } finally {
      setIsProcessing(false);
      // Resetear el input para permitir subir el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmData = async () => {
    if (previewData) {
      try {
        await onFileRead(previewData);
        setShowPreviewDialog(false);
        setPreviewData(null);
      } catch (error: any) {
        const errorMessage = error.message || 'Error al procesar los datos';
        if (onError) {
          onError(errorMessage);
        }
      }
    }
  };

  const handleCancelPreview = () => {
    setShowPreviewDialog(false);
    setPreviewData(null);
    setShowModal(true);
  };

  const handleButtonClick = () => {
    if (asModal) {
      setShowModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isProcessing) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;

    await processFile(file);
  };

  // Si es modal, renderizar botón que abre modal
  if (asModal) {
    return (
      <>
        <Button
          label={buttonLabel}
          icon={buttonIcon}
          className="p-button-sm"
          onClick={handleButtonClick}
          disabled={disabled}
        />
        
        <Dialog 
          header={modalTitle} 
          visible={showModal} 
          style={{ width: '450px' }} 
          onHide={() => setShowModal(false)}
          modal
        >
          <div className="p-4">
            <ExcelUploader<T>
              config={config}
              onFileRead={async (data) => {
                // En lugar de llamar directamente onFileRead, mostrar vista previa
                setPreviewData(data);
                setShowModal(false);
                setShowPreviewDialog(true);
              }}
              onError={onError}
              buttonLabel="Seleccionar Archivo"
              buttonIcon="pi pi-file"
              accept={accept}
              disabled={disabled}
              asModal={false}
            />
            
            {modalInfo && (
              <div className="mt-4">
                {modalInfo}
              </div>
            )}
          </div>
        </Dialog>

        {/* Modal de vista previa */}
        <Dialog
          header="Confirmar Datos a Importar"
          visible={showPreviewDialog}
          style={{ width: '70vw' }}
          onHide={handleCancelPreview}
          modal
          footer={
            <div className="flex justify-end gap-2">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={handleCancelPreview}
              />
              <Button
                label="Agregar"
                icon="pi pi-check"
                onClick={handleConfirmData}
              />
            </div>
          }
        >
          <div className="p-4">
            <p className="mb-4 text-gray-600">
              Se importarán {previewData?.length || 0} remitente(s). Revisa los datos antes de continuar:
            </p>
            
            {previewData && (
              <DataTable value={previewData} scrollable scrollHeight="400px" className="mt-4">
                {previewColumns.map((col) => (
                  <Column 
                    key={col.field} 
                    field={col.field} 
                    header={col.header}
                    style={{ minWidth: '150px' }}
                  />
                ))}
              </DataTable>
            )}
          </div>
        </Dialog>
      </>
    );
  }

  // Si es buttonOnly, renderizar solo el botón
  if (buttonOnly) {
    return (
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled || isProcessing}
        />
        <Button
          label={buttonLabel}
          icon={buttonIcon}
          className="p-button-sm"
          onClick={handleButtonClick}
          disabled={disabled || isProcessing}
          loading={isProcessing}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 min-w-[200px]
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled || isProcessing 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:bg-gray-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled || isProcessing}
      />
      
      <div className="space-y-2">
        <div className="text-3xl text-gray-400">
          <i className={isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-cloud-upload'}></i>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">
            {isProcessing ? 'Procesando archivo...' : 'Arrastra tu archivo Excel aquí'}
          </p>
          <p className="text-xs text-gray-500">
            o haz clic para seleccionar
          </p>
        </div>

        <Button
          label={buttonLabel}
          icon={buttonIcon}
          className="p-button-sm p-button-outlined"
          disabled={disabled || isProcessing}
          loading={isProcessing}
          size="small"
        />
      </div>
    </div>
  );
}