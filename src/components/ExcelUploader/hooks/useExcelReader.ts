
import { useState } from 'react';
import * as XLSX from 'xlsx';

export type ExcelRow = Record<string, any>;

export type ExcelReaderConfig<T = ExcelRow> = {
  /**
   * Mapeo de columnas del Excel a propiedades del objeto resultante
   * Ejemplo: { 'Nombre': 'name', 'Descripción': 'description' }
   */
  columnMapping: Record<string, string>;
  
  /**
   * Función opcional para transformar cada fila antes de retornarla
   */
  transformRow?: (row: ExcelRow) => T;
  
  /**
   * Índice de la hoja a leer (0 = primera hoja)
   */
  sheetIndex?: number;
  
  /**
   * Si true, la primera fila se considera encabezado
   */
  hasHeader?: boolean;
};

export function useExcelReader<T extends ExcelRow = ExcelRow>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFile = async (
    file: File,
    config: ExcelReaderConfig<T>
  ): Promise<T[]> => {
    setLoading(true);
    setError(null);

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              throw new Error('No se pudo leer el archivo');
            }

            // Usar ArrayBuffer para evitar problemas con caracteres y tipos
            const workbook = XLSX.read(data as ArrayBuffer, { type: 'array' });
            const sheetIndex = config.sheetIndex ?? 0;
            const sheetName = workbook.SheetNames[sheetIndex];
            
            if (!sheetName) {
              throw new Error(`No se encontró la hoja en el índice ${sheetIndex}`);
            }

            const worksheet = workbook.Sheets[sheetName];

            // Obtener filas con tipado según si hay encabezado
            let rowsUnknown: any;
            if (config.hasHeader !== false) {
              rowsUnknown = XLSX.utils.sheet_to_json<string[]>(worksheet, {
                header: 1,
                defval: '',
              }) as unknown as string[][];
            } else {
              rowsUnknown = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
                defval: '',
              }) as unknown as Record<string, unknown>[];
            }
            if (!rowsUnknown || (Array.isArray(rowsUnknown) && rowsUnknown.length === 0)) {
              throw new Error('El archivo Excel está vacío');
            }

            // Si tiene encabezado, rowsUnknown es string[][]
            let headers: string[] = [];
            let dataRows: any[] = [];

            if (config.hasHeader !== false && Array.isArray(rowsUnknown) && Array.isArray(rowsUnknown[0])) {
              headers = rowsUnknown[0] as string[];
              dataRows = (rowsUnknown as string[][]).slice(1);
            } else {
              // Si no tiene encabezado, usar la salida objeto de sheet_to_json
              headers = Object.keys(config.columnMapping);
              dataRows = rowsUnknown as Record<string, unknown>[];
            }

            // Mapear las filas según la configuración
            const mappedRows: T[] = dataRows
              .map((row, index) => {
                const mappedRow: ExcelRow = {};
                
                headers.forEach((header, colIndex) => {
                  const mappedKey = config.columnMapping[header];
                  if (mappedKey) {
                    const value = Array.isArray(row) ? (row as any[])[colIndex] : (row as Record<string, any>)[header];
                    mappedRow[mappedKey] = value ?? '';
                  }
                });

                // Aplicar transformación si existe
                if (config.transformRow) {
                  return config.transformRow(mappedRow) as T;
                }
                return mappedRow as T;
              })
              .filter((row) => {
                // Filtrar filas vacías
                return Object.values(row).some((val) => val !== '' && val != null);
              });

            resolve(mappedRows);
          } catch (err: any) {
            reject(new Error(err.message || 'Error al procesar el archivo Excel'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Error al leer el archivo'));
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Error al leer el archivo Excel';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { readFile, loading, error };
}