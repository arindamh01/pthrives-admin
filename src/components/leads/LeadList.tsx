'use client';

import { useState, memo } from 'react';
import { ICrmLead } from '@/interfaces/lead.interface';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { ReactTable, TableHeader, PaginationInfo } from '@/components/ui/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mail, Phone } from 'lucide-react';

interface LeadListProps {
  leads: ICrmLead[];
  onEdit: (lead: ICrmLead) => void;
  onDelete: (lead: ICrmLead) => void;
  isLoading?: boolean;
  paginationData: PaginationInfo;
  setSearchingvalue: (value: string) => void;
  setSortingvalue?: (value: SortingState) => void;
  handlePageChange?: (page: number, pageSize: number) => void;
}

const columnHelper = createColumnHelper<ICrmLead>();

const LeadList = memo(function LeadList({
  leads,
  onEdit,
  onDelete,
  isLoading = false,
  paginationData,
  setSearchingvalue,
  setSortingvalue,
  handlePageChange,
}: LeadListProps) {
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
    columnHelper.accessor('lead_id', {
      header: 'Lead ID',
      enableSorting: true,
      cell: (info) => (
        <div className="font-mono text-sm text-gray-900">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('full_name', {
      header: 'Name',
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
            {info.getValue().charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      enableSorting: false,
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {info.getValue() || 'N/A'}
        </div>
      ),
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      enableSorting: true,
      cell: (info) => (
        <Badge variant="outline" className="text-xs">
          {info.getValue() || 'N/A'}
        </Badge>
      ),
    }),
    columnHelper.accessor('stage', {
      header: 'Stage',
      enableSorting: true,
      cell: (info) => {
        const stage = info.getValue();
        const stageColors: Record<string, string> = {
          New: 'bg-blue-100 text-blue-800',
          Contacted: 'bg-purple-100 text-purple-800',
          Qualified: 'bg-green-100 text-green-800',
          Proposal: 'bg-yellow-100 text-yellow-800',
          Negotiation: 'bg-orange-100 text-orange-800',
          Won: 'bg-emerald-100 text-emerald-800',
          Lost: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={`${stageColors[stage] || 'bg-gray-100 text-gray-800'}`}>
            {stage}
          </Badge>
        );
      },
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
        searchPlaceholder="Search leads..."
        pagination={paginationData}
        onPageSizeChange={handlePageChange}
      />

      {/* Table */}
      <ReactTable
        data={leads}
        columns={columns}
        sorting={sorting}
        onSortingChange={handleSorting}
        emptyStateMessage="No leads found"
        emptyStateIcon={<FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300" />}
        onPageChange={handlePageChange}
        pagination={paginationData}
        isLoading={isLoading}
      />
    </div>
  );
});

export default LeadList;

