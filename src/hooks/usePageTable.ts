import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { SortingState } from '@tanstack/react-table'
import toast from 'react-hot-toast'

interface PaginationInfo {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

interface UsePageTableOptions<T> {
  fetchService: (params: any) => Promise<{ data: T[]; pagination: PaginationInfo }>
  deleteService: (id: string) => Promise<{ message: string }>
  createService: (data: any) => Promise<{ data: T; message: string }>
  updateService: (id: string, data: any) => Promise<{ data: T; message: string }>
  toggleStatusService?: (id: string) => Promise<{ data: T; message: string }>
  getItemId: (item: T) => string
  getItemName: (item: T) => string
  entityName: string
  additionalFilters?: Record<string, any>
  initialPageSize?: number
}

interface UsePageTableReturn<T> {
  // State
  items: T[]
  isLoading: boolean
  showDeleteModal: boolean
  showAddModal: boolean
  showEditModal: boolean
  selectedItem: T | null
  pagination: PaginationInfo
  isSubmitting: boolean
  isFormValid: boolean
  isDeleting: boolean
  searchValue: string
  sorting: SortingState

  // Actions
  handleEdit: (item: T) => void
  handleDelete: (item: T) => void
  handleView: (item: T) => void
  handleAdd: () => void
  handleDeleteConfirm: () => Promise<void>
  handleModalSubmit: (data: any) => Promise<void>
  handleEditModalSubmit: (data: any) => Promise<void>
  handleFormSubmit: () => void
  handleToggleStatus: (item: T) => Promise<void>
  handlePageChange: (page: number, pageSize: number) => void

  // Modal handlers
  closeDeleteModal: () => void
  closeAddModal: () => void
  closeEditModal: () => void

  // State setters
  setSearchValue: (value: string) => void
  setSorting: (value: SortingState) => void
  setIsFormValid: (value: boolean) => void

  // Utility
  getItemName: string
}

export function usePageTable<T extends Record<string, any>>({
  fetchService,
  deleteService,
  createService,
  updateService,
  toggleStatusService,
  getItemId,
  getItemName: getItemNameFn,
  entityName,
  additionalFilters = {},
  initialPageSize = 10
}: UsePageTableOptions<T>): UsePageTableReturn<T> {
  // State
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: initialPageSize,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  // Use refs to avoid infinite loops
  const fetchServiceRef = useRef(fetchService)
  const entityNameRef = useRef(entityName)
  const additionalFiltersRef = useRef(additionalFilters)

  // Update refs when props change
  useEffect(() => {
    fetchServiceRef.current = fetchService
    entityNameRef.current = entityName
    additionalFiltersRef.current = additionalFilters
  }, [fetchService, entityName, additionalFilters])

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const sortBy = sorting[0]?.id || 'createdAt'
      const sortOrder = sorting[0]?.desc ? 'desc' : 'asc'
      
      const params = {
        page: pagination.current_page,
        perPage: pagination.per_page,
        search: searchValue,
        sortBy,
        sortOrder,
        ...additionalFiltersRef.current
      }

      const response = await fetchServiceRef.current(params)
      setItems(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error(`Error fetching ${entityNameRef.current}s:`, error)
      toast.error(`Failed to fetch ${entityNameRef.current}s`)
    } finally {
      setIsLoading(false)
    }
  }, [pagination.current_page, pagination.per_page, searchValue, sorting])

  // Initial load and when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== undefined) {
        setPagination(prev => ({ ...prev, current_page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  // Actions
  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }, [])

  const handleDelete = useCallback((item: T) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }, [])

  const handleView = useCallback((item: T) => {
    setSelectedItem(item)
    // You can implement view functionality here
    console.log('View item:', item)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedItem(null)
    setShowAddModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedItem) return

    setIsDeleting(true)
    try {
      await deleteService(getItemId(selectedItem))
      toast.success(`${entityName} deleted successfully`)
      setShowDeleteModal(false)
      setSelectedItem(null)
      await fetchData()
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error)
      toast.error(`Failed to delete ${entityName}`)
    } finally {
      setIsDeleting(false)
    }
  }, [selectedItem, deleteService, getItemId, entityName, fetchData])

  const handleModalSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true)
    try {
      await createService(data)
      toast.success(`${entityName} created successfully`)
      setShowAddModal(false)
      await fetchData()
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error)
      toast.error(`Failed to create ${entityName}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [createService, entityName, fetchData])

  const handleEditModalSubmit = useCallback(async (data: any) => {
    if (!selectedItem) return

    setIsSubmitting(true)
    try {
      await updateService(getItemId(selectedItem), data)
      toast.success(`${entityName} updated successfully`)
      setShowEditModal(false)
      setSelectedItem(null)
      await fetchData()
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error)
      toast.error(`Failed to update ${entityName}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedItem, updateService, getItemId, entityName, fetchData])

  const handleFormSubmit = useCallback(() => {
    // This will be handled by the form component
  }, [])

  const handleToggleStatus = useCallback(async (item: T) => {
    if (!toggleStatusService) return

    try {
      await toggleStatusService(getItemId(item))
      toast.success(`${entityName} status updated successfully`)
      await fetchData()
    } catch (error) {
      console.error(`Error toggling ${entityName} status:`, error)
      toast.error(`Failed to update ${entityName} status`)
    }
  }, [toggleStatusService, getItemId, entityName, fetchData])

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current_page: page,
      per_page: pageSize
    }))
  }, [])

  // Modal handlers
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedItem(null)
  }, [])

  const closeAddModal = useCallback(() => {
    setShowAddModal(false)
    setSelectedItem(null)
  }, [])

  const closeEditModal = useCallback(() => {
    setShowEditModal(false)
    setSelectedItem(null)
  }, [])

  // Utility
  const getItemName = useMemo(() => {
    return selectedItem ? getItemNameFn(selectedItem) : ''
  }, [selectedItem, getItemNameFn])

  return {
    // State
    items,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem,
    pagination,
    isSubmitting,
    isFormValid,
    isDeleting,
    searchValue,
    sorting,

    // Actions
    handleEdit,
    handleDelete,
    handleView,
    handleAdd,
    handleDeleteConfirm,
    handleModalSubmit,
    handleEditModalSubmit,
    handleFormSubmit,
    handleToggleStatus,
    handlePageChange,

    // Modal handlers
    closeDeleteModal,
    closeAddModal,
    closeEditModal,

    // State setters
    setSearchValue,
    setSorting,
    setIsFormValid,

    // Utility
    getItemName
  }
}
