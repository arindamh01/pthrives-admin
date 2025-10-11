'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ListCard from '@/components/common/ListCard';
import CourseForm from '@/components/courses/CourseForm';
import CourseList from '@/components/courses/CourseList';
import { Modal } from '@/components/ui/modal/Modal';
import { SideModal } from '@/components/ui/modal/SideModal';
import { usePageTable } from '@/hooks/usePageTable';
import { ICourse } from '@/interfaces/course.interface';
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

export default function CoursesPage() {
  const editFormRef = useRef<HTMLFormElement>(null);
  
  const {
    // State
    items: courses,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem: selectedCourse,
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
  } = usePageTable<ICourse>({
    fetchService: async (params) => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        per_page: params.per_page.toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
      });

      const response = await fetch(`/api/courses?${queryParams}`);
      return response.json();
    },
    deleteService: async (id) => {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      return response.json();
    },
    createService: async (data) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateService: async (id, data) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getItemId: (course) => course.course_id,
    getItemName: (course) => course.course_name,
    entityName: 'course',
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Courses" />

        <ListCard
          heading="Course Management"
          description="Manage your courses and curriculum"
          icon={faBook}
          addButton={true}
          onButtonClick={handleAdd}
          addButtonLabel="Add Course"
        >
          <CourseList
            courses={courses}
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
          title="Delete Course"
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
              Are you sure you want to delete the course <b>{getItemName}</b>? This action
              cannot be undone.
            </p>
          </div>
        </Modal>

        {/* Add Course Side Modal */}
        <SideModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          title="Add New Course"
          description="Create a new course in your catalog"
          side="right"
          size="full"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeAddModal,
            handleFormSubmit
          )}
        >
          <CourseForm
            mode="create"
            onSubmit={handleModalSubmit}
            onCancel={closeAddModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>

        {/* Edit Course Side Modal */}
        <SideModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title={selectedCourse ? `Edit Course #${selectedCourse.course_id}` : 'Edit Course'}
          description="Update course information"
          side="right"
          size="full"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeEditModal,
            () => editFormRef.current?.requestSubmit(),
            'Update'
          )}
        >
          <CourseForm
            ref={editFormRef}
            mode="edit"
            initialData={selectedCourse || undefined}
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

