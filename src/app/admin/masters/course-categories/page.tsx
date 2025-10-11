'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ListCard from '@/components/common/ListCard';
import CourseCategoryForm from '@/components/masters/CourseCategoryForm';
import CourseCategoryList from '@/components/masters/CourseCategoryList';
import { Modal } from '@/components/ui/modal/Modal';
import { SideModal } from '@/components/ui/modal/SideModal';
import { usePageTable } from '@/hooks/usePageTable';
import { ICourseCategory } from '@/interfaces/master.interface';
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

export default function CourseCategoriesPage() {
  const {
    // State
    items: courseCategories,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem: selectedCourseCategory,
    pagination,
    isSubmitting,
    isFormValid,
    isDeleting,
    // Actions
    handleEdit,
    handleDelete,
    handleAdd,
    handleDeleteConfirm,
    handleModalSubmit,
    handleEditModalSubmit,
    handleFormSubmit,
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
    getItemName,
  } = usePageTable<ICourseCategory>({
    fetchService: async (params) => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        per_page: params.per_page.toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
      });

      const response = await fetch(`/api/masters/course-categories?${queryParams}`);
      return response.json();
    },
    deleteService: async (id) => {
      const response = await fetch(`/api/masters/course-categories/${id}`, { method: 'DELETE' });
      return response.json();
    },
    createService: async (data) => {
      const response = await fetch('/api/masters/course-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateService: async (id, data) => {
      const response = await fetch(`/api/masters/course-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getItemId: (courseCategory) => courseCategory.course_category_id,
    getItemName: (courseCategory) => courseCategory.course_category_name,
    entityName: 'course category',
    defaultSortBy: 'course_category_name',
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Course Categories" />

        <ListCard
          heading="Course Category Management"
          description="Manage course categories for your courses"
          icon={faFolderOpen}
          addButton={true}
          onButtonClick={handleAdd}
          addButtonLabel="Add Course Category"
        >
          <CourseCategoryList
            courseCategories={courseCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            paginationData={pagination}
            setSearchingvalue={setSearchValue}
            setSortingvalue={setSorting}
            handlePageChange={handlePageChange}
          />
        </ListCard>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          title="Delete Course Category"
          size="sm"
          showActions={true}
          actions={createDeleteModalActions(
            isDeleting,
            closeDeleteModal,
            handleDeleteConfirm
          )}
        >
          <div className="p-6">
            <p className="text-gray-600">
              Are you sure you want to delete the course category <b>{getItemName}</b>? This
              action cannot be undone.
            </p>
          </div>
        </Modal>

        {/* Add Course Category Side Modal */}
        <SideModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          title="Add New Course Category"
          description="Create a new course category"
          side="right"
          size="md"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeAddModal,
            handleFormSubmit
          )}
        >
          <CourseCategoryForm
            mode="create"
            onSubmit={handleModalSubmit}
            onCancel={closeAddModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>

        {/* Edit Course Category Side Modal */}
        <SideModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title="Edit Course Category"
          description="Update course category information"
          side="right"
          size="md"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeEditModal,
            handleFormSubmit,
            'Update'
          )}
        >
          <CourseCategoryForm
            mode="edit"
            initialData={selectedCourseCategory || undefined}
            onSubmit={handleEditModalSubmit}
            onCancel={closeEditModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>
      </div>
    </AdminLayout>
  );
}

