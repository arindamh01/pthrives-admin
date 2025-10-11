'use client';

import { memo, useState } from 'react';
import { ICourseType } from '@/interfaces/master.interface';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { ReactTable, PaginationInfo } from '@/components/ui/react-table';
import { Button } from '@/components/ui/button';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CourseTypeListProps {
  courseTypes: ICourseType[];
  onEdit: (courseType: ICourseType) => void;
  onDelete: (courseType: ICourseType) => void;
  isLoading?: boolean;
  paginationData: PaginationInfo;
  setSearchingvalue: (value: string) => void;
  setSortingvalue?: (value: SortingState) => void;
  handlePageChange?: (page: number, pageSize: number) => void;
}

const columnHelper = createColumnHelper<ICourseType>();

const CourseTypeList = memo(function CourseTypeList({
  courseTypes,
  onEdit,
  onDelete,
  isLoading = false,
  paginationData,
  setSearchingvalue: _setSearchingvalue,
  setSortingvalue,
  handlePageChange,
}: CourseTypeListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSorting = (value: SortingState) => {
    setSorting(value);
    setSortingvalue?.(value);
  };

  const columns: any = [
    columnHelper.display({
      id: 'serial',
      header: 'S.No',
      enableSorting: false,
      cell: (info) => {
        const rowIndex = info.row.index;
        const pageIndex = paginationData.current_page;
        const pageSize = paginationData.per_page;
        return (
          <div className="text-sm font-medium text-gray-900">
            {(pageIndex - 1) * pageSize + rowIndex + 1}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(info.row.original)}
            className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300 transition-all"
          >
            <FontAwesomeIcon icon={faEdit} className="text-sm" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(info.row.original)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
          >
            <FontAwesomeIcon icon={faTrash} className="text-sm" />
          </Button>
        </div>
      ),
    }),
    columnHelper.accessor('course_type_id', {
      header: 'Type ID',
      cell: (info) => (
        <div className="text-sm text-gray-900 font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('course_type_name', {
      header: 'Type Name',
      cell: (info) => (
        <div className="text-sm text-gray-900 font-semibold">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      enableSorting: false,
      cell: (info) => (
        <div className="text-sm text-gray-600 max-w-md truncate">
          {info.getValue() || '-'}
        </div>
      ),
    }),
  ];

  return (
    <ReactTable
      data={courseTypes}
      columns={columns}
      sorting={sorting}
      onSortingChange={handleSorting}
      pagination={paginationData}
      isLoading={isLoading}
      onPageChange={handlePageChange}
    />
  );
});

export default CourseTypeList;

