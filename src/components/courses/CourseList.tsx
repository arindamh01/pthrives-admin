"use client"

import React, { useMemo } from 'react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { ICourse } from '@/interfaces/course.interface'
import { cn } from '@/lib/utils'

const columnHelper = createColumnHelper<ICourse>()

interface CourseListProps {
  courses: ICourse[]
  onEdit: (course: ICourse) => void
  onDelete: (course: ICourse) => void
  onView?: (course: ICourse) => void
  isLoading?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'web-development':
      return 'bg-blue-100 text-blue-800'
    case 'data-science':
      return 'bg-purple-100 text-purple-800'
    case 'design':
      return 'bg-pink-100 text-pink-800'
    case 'mobile-development':
      return 'bg-green-100 text-green-800'
    case 'devops':
      return 'bg-orange-100 text-orange-800'
    case 'business':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function CourseList({
  courses,
  onEdit,
  onDelete,
  onView: _onView,
  isLoading = false,
}: CourseListProps) {

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'serial',
      header: 'S.No',
      enableSorting: false,
      cell: (info) => {
        return info.row.index + 1
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(info.row.original)}
            className="h-8 w-8 p-0 hover:bg-primary/10 text-primary border-primary/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(info.row.original)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive border-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Course
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (info) => (
        <div className="space-y-1">
          <div className="font-medium">{info.getValue()}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {info.row.original.description}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => {
        const category = info.getValue()
        return (
          <Badge className={cn('capitalize', getCategoryColor(category))}>
            {category.replace('-', ' ')}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('trainer', {
      header: 'Trainer',
      cell: (info) => (
        <div className="font-medium">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: (info) => (
        <div className="text-muted-foreground">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('price', {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (info) => {
        const price = Number(info.getValue())
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price)
        return <div className="font-medium">{formatted}</div>
      },
    }),
    columnHelper.accessor('students', {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Students
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (info) => (
        <div className="text-center">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        return (
          <Badge className={cn('capitalize', getStatusColor(status))}>
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created By',
      enableSorting: true,
      cell: (info) => {
        const createdBy = info.row.original.createdBy
        const createdAt = info.getValue()
        return (
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">
              {createdBy || 'N/A'}
            </span>
            {createdAt && (
              <div className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated By',
      enableSorting: true,
      cell: (info) => {
        const updatedBy = info.row.original.updatedBy
        const updatedAt = info.getValue()
        return (
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">
              {updatedBy || 'N/A'}
            </span>
            {updatedAt && (
              <div className="text-xs text-muted-foreground">
                {new Date(updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )
      },
    }),
  ] as ColumnDef<ICourse>[], [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-muted/50 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={courses}
      searchKey="title"
      searchPlaceholder="Search courses..."
      showColumnVisibility={true}
      showPagination={true}
      pageSize={10}
    />
  )
}
