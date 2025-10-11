'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SortingState } from '@tanstack/react-table';
import toast from 'react-hot-toast';

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface UsePageTableProps<T> {
  fetchService: (params: any) => Promise<any>;
  deleteService: (id: string) => Promise<any>;
  createService: (data: any) => Promise<any>;
  updateService: (id: string, data: any) => Promise<any>;
  toggleStatusService?: (id: string) => Promise<any>;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  entityName: string;
  additionalFilters?: Record<string, any>;
  defaultSortBy?: string;
}

export function usePageTable<T>({
  fetchService,
  deleteService,
  createService,
  updateService,
  toggleStatusService,
  getItemId,
  getItemName,
  entityName,
  additionalFilters = {},
  defaultSortBy = 'created_at',
}: UsePageTableProps<T>) {
  // State
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Table states
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  });

  // Ref to track if component is mounted
  const isMountedRef = useRef(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Fetch items
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: debouncedSearch,
        sort_by: sorting[0]?.id || defaultSortBy,
        sort_order: sorting[0]?.desc ? 'desc' : 'asc',
        ...additionalFilters,
      };

      const response = await fetchService(params);
      
      if (response.success) {
        setItems(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        toast.error(`Failed to fetch ${entityName}s`);
      }
    } catch (error) {
      console.error(`Error fetching ${entityName}s:`, error);
      toast.error(`Failed to fetch ${entityName}s`);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.current_page, pagination.per_page, debouncedSearch, sorting, additionalFilters, fetchService, entityName, defaultSortBy]);

  // Fetch items only when dependencies actually change
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, pagination.per_page, debouncedSearch, JSON.stringify(sorting), JSON.stringify(additionalFilters)]);

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modal handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormValid(false);
    setShowAddModal(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setIsFormValid(false);
    setShowEditModal(true);
  };

  const handleDelete = (item: T) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleView = (item: T) => {
    setSelectedItem(item);
    // Implement view logic if needed
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedItem(null);
    setIsFormValid(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setIsFormValid(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  // CRUD operations
  const handleModalSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await createService(data);
      
      if (response.success) {
        toast.success(`${entityName} created successfully!`);
        closeAddModal();
        fetchItems();
      } else {
        toast.error(response.message || `Failed to create ${entityName}`);
      }
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
      toast.error(`Failed to create ${entityName}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModalSubmit = async (data: any) => {
    console.log('handleEditModalSubmit called with data:', data);
    console.log('selectedItem:', selectedItem);
    
    if (!selectedItem) {
      console.log('No selected item, returning');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const id = getItemId(selectedItem);
      console.log('Updating item with ID:', id);
      
      const response = await updateService(id, data);
      console.log('Update response:', response);
      
      if (response.success) {
        toast.success(`${entityName} updated successfully!`);
        closeEditModal();
        fetchItems();
      } else {
        toast.error(response.message || `Failed to update ${entityName}`);
      }
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);
      toast.error(`Failed to update ${entityName}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    setIsDeleting(true);
    try {
      const id = getItemId(selectedItem);
      const response = await deleteService(id);
      
      if (response.success) {
        toast.success(`${entityName} deleted successfully!`);
        closeDeleteModal();
        fetchItems();
      } else {
        toast.error(response.message || `Failed to delete ${entityName}`);
      }
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      toast.error(`Failed to delete ${entityName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (item: T) => {
    if (!toggleStatusService) return;
    
    try {
      const id = getItemId(item);
      const response = await toggleStatusService(id);
      
      if (response.success) {
        toast.success(`${entityName} status updated!`);
        fetchItems();
      } else {
        toast.error(response.message || `Failed to update status`);
      }
    } catch (error) {
      console.error(`Error updating status:`, error);
      toast.error(`Failed to update status`);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
      per_page: pageSize,
    }));
  };

  // Form submit handler (used to trigger form submission from modal actions)
  const handleFormSubmit = () => {
    // This will be called by the modal's submit button
    // The actual form submission is handled by the form's onSubmit
  };

  const selectedItemName = selectedItem ? getItemName(selectedItem) : '';

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
    getItemName: selectedItemName,
    fetchItems,
  };
}
