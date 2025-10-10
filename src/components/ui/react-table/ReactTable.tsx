'use client';

import {
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from './Pagination';
import { PaginationInfo } from '@/hooks/usePageTable';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: PaginationInfo;
  onPageChange?: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
  emptyStateIcon?: ReactNode;
}

export function ReactTable<T>({
  data,
  columns,
  sorting,
  onSortingChange,
  pagination,
  onPageChange,
  isLoading = false,
  emptyStateMessage = 'No data found',
  emptyStateIcon,
}: ReactTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column: any, index) => (
                <TableHead
                  key={column.id || index}
                  onClick={column.enableSorting !== false ? () => {
                    const currentSort = sorting.find((s) => s.id === column.id);
                    const newSorting: SortingState = currentSort
                      ? [{ id: column.id, desc: !currentSort.desc }]
                      : [{ id: column.id, desc: false }];
                    onSortingChange(newSorting);
                  } : undefined}
                  className={column.enableSorting !== false ? 'cursor-pointer select-none hover:bg-gray-50' : ''}
                >
                  <div className="flex items-center gap-2">
                    {typeof column.header === 'function'
                      ? column.header({ column } as any)
                      : column.header}
                    {column.enableSorting !== false && sorting.find((s) => s.id === column.id) && (
                      <span className="ml-auto">
                        {sorting.find((s) => s.id === column.id)?.desc ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <p className="text-gray-500">Loading...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-4">
                    {emptyStateIcon}
                    <p className="text-gray-500">{emptyStateMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row: any, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column: any, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell
                        ? column.cell({ row: { original: row, index: rowIndex }, getValue: () => row[column.accessorKey] })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => onPageChange?.(page, pagination.per_page)}
        />
      )}
    </div>
  );
}

// Export types
export type { PaginationInfo };

