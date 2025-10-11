'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ListCard from '@/components/common/ListCard';
import CourseTypeForm from '@/components/masters/CourseTypeForm';
import CourseTypeList from '@/components/masters/CourseTypeList';
import { Modal } from '@/components/ui/modal/Modal';
import { SideModal } from '@/components/ui/modal/SideModal';
import { usePageTable } from '@/hooks/usePageTable';
import { ICourseType } from '@/interfaces/master.interface';
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function CourseTypesPage() {
  const {
    // State
    items: courseTypes,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem: selectedCourseType,
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
  } = usePageTable<ICourseType>({
    fetchService: async (params) => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        per_page: params.per_page.toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
      });

      const response = await fetch(`/api/masters/course-types?${queryParams}`);
      return response.json();
    },
    deleteService: async (id) => {
      const response = await fetch(`/api/masters/course-types/${id}`, { method: 'DELETE' });
      return response.json();
    },
    createService: async (data) => {
      const response = await fetch('/api/masters/course-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateService: async (id, data) => {
      const response = await fetch(`/api/masters/course-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getItemId: (courseType) => courseType.course_type_id,
    getItemName: (courseType) => courseType.course_type_name,
    entityName: 'course type',
    defaultSortBy: 'course_type_name',
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Course Types" />

        <ListCard
          heading="Course Type Management"
          description="Manage course types for your courses"
          icon={faTag}
          addButton={true}
          onButtonClick={handleAdd}
          addButtonLabel="Add Course Type"
        >
          <CourseTypeList
            courseTypes={courseTypes}
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
          title="Delete Course Type"
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
              Are you sure you want to delete the course type <b>{getItemName}</b>? This action
              cannot be undone.
            </p>
          </div>
        </Modal>

        {/* Add Course Type Side Modal */}
        <SideModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          title="Add New Course Type"
          description="Create a new course type"
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
          <CourseTypeForm
            mode="create"
            onSubmit={handleModalSubmit}
            onCancel={closeAddModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>

        {/* Edit Course Type Side Modal */}
        <SideModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title="Edit Course Type"
          description="Update course type information"
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
          <CourseTypeForm
            mode="edit"
            initialData={selectedCourseType || undefined}
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

