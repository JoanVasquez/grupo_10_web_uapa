import React from "react";
import { Button } from "../../index";

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

interface DynamicDataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
}

function DynamicDataTable<T>({
  columns,
  data,
  getRowId,
  emptyMessage = "No hay registros disponibles.",
  onEdit,
  onDelete,
  isLoading = false,
}: DynamicDataTableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 md:hidden">
        Desliza para ver todos los campos
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Cargando datos...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={getRowId(row)} className="align-top hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                      {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "-")}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-4">
                      <div className="flex min-w-[180px] flex-col justify-end gap-2 sm:flex-row">
                        {onEdit && (
                          <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(row)} className="w-full sm:w-auto">
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button type="button" variant="danger" size="sm" onClick={() => onDelete(row)} className="w-full sm:w-auto">
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DynamicDataTable;
