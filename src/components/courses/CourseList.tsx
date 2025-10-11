'use client';

import { useState, memo } from 'react';
import { ICourse } from '@/interfaces/course.interface';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { ReactTable, TableHeader, PaginationInfo } from '@/components/ui/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { faBook, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Clock } from 'lucide-react';
import { PriceDisplay } from '@/components/common/CurrencyDisplay';

interface CourseListProps {
  courses: ICourse[];
  onEdit: (course: ICourse) => void;
  onDelete: (course: ICourse) => void;
  isLoading?: boolean;
  paginationData: PaginationInfo;
  setSearchingvalue: (value: string) => void;
  setSortingvalue?: (value: SortingState) => void;
  handlePageChange?: (page: number, pageSize: number) => void;
}

const columnHelper = createColumnHelper<ICourse>();

const CourseList = memo(function CourseList({
  courses,
  onEdit,
  onDelete,
  isLoading = false,
  paginationData,
  setSearchingvalue,
  setSortingvalue,
  handlePageChange,
}: CourseListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

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
    columnHelper.accessor('status_id', {
      header: 'Status',
      enableSorting: true,
      cell: (info) => {
        const status = info.getValue();
        const isActive = status === 'ACTIVE';
        return (
          <Badge 
            className={isActive 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-gray-100 text-gray-800 border-gray-200'
            }
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('course_id', {
      header: 'Course ID',
      enableSorting: true,
      cell: (info) => (
        <div className="font-mono text-sm text-gray-900">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('course_name', {
      header: 'Course Name',
      enableSorting: true,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('course_category_id', {
      header: 'Category',
      enableSorting: true,
      cell: (info) => (
        <Badge variant="outline" className="text-xs">
          {info.getValue() || 'N/A'}
        </Badge>
      ),
    }),
    columnHelper.accessor('level', {
      header: 'Level',
      enableSorting: true,
      cell: (info) => {
        const level = info.getValue() || '';
        const levelColors: Record<string, string> = {
          Beginner: 'bg-green-100 text-green-800',
          Intermediate: 'bg-yellow-100 text-yellow-800',
          Advanced: 'bg-red-100 text-red-800',
          'All Levels': 'bg-blue-100 text-blue-800',
        };
        return (
          <Badge className={`${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
            {level || 'N/A'}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      enableSorting: true,
      cell: (info) => {
        const duration = info.getValue();
        const durationType = info.row.original.duration_type;
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {duration || 0} {durationType || 'hours'}
          </div>
        );
      },
    }),
    columnHelper.accessor('standard_price', {
      header: 'Price',
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-1">
          <PriceDisplay 
            amount={info.getValue() || 0} 
            className="text-sm font-medium"
          />
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      enableSorting: true,
      cell: (info) => {
        const createdBy = info.row.original.created_by;
        const createdAt = info.getValue();
        return (
          <div className="text-sm">
            <div className="text-gray-900">{createdBy || 'N/A'}</div>
            <div className="text-xs text-gray-500">
              {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        );
      },
    }),
  ];

  // Handle search
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setSearchingvalue(value);
  };

  // Handle sorting
  const handleSorting = (value: SortingState) => {
    setSorting(value);
    setSortingvalue?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <TableHeader
        searchValue={globalFilter}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search courses..."
        pagination={paginationData}
        onPageSizeChange={handlePageChange}
      />

      {/* Table */}
      <ReactTable
        data={courses}
        columns={columns}
        sorting={sorting}
        onSortingChange={handleSorting}
        emptyStateMessage="No courses found"
        emptyStateIcon={<FontAwesomeIcon icon={faBook} className="text-6xl text-gray-300" />}
        onPageChange={handlePageChange}
        pagination={paginationData}
        isLoading={isLoading}
      />
    </div>
  );
});

export default CourseList;

