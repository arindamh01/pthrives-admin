'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ListCard from '@/components/common/ListCard';
import TopicForm from '@/components/masters/TopicForm';
import TopicList from '@/components/masters/TopicList';
import { Modal } from '@/components/ui/modal/Modal';
import { SideModal } from '@/components/ui/modal/SideModal';
import { usePageTable } from '@/hooks/usePageTable';
import { ITopic } from '@/interfaces/master.interface';
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

export default function TopicsPage() {
  const {
    // State
    items: topics,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem: selectedTopic,
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
  } = usePageTable<ITopic>({
    fetchService: async (params) => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        per_page: params.per_page.toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
      });

      const response = await fetch(`/api/masters/topics?${queryParams}`);
      return response.json();
    },
    deleteService: async (id) => {
      const response = await fetch(`/api/masters/topics/${id}`, { method: 'DELETE' });
      return response.json();
    },
    createService: async (data) => {
      const response = await fetch('/api/masters/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateService: async (id, data) => {
      const response = await fetch(`/api/masters/topics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getItemId: (topic) => topic.topic_id,
    getItemName: (topic) => topic.topic_name,
    entityName: 'topic',
    defaultSortBy: 'topic_name',
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Topics" />

        <ListCard
          heading="Topic Management"
          description="Manage topics for your courses"
          icon={faBookmark}
          addButton={true}
          onButtonClick={handleAdd}
          addButtonLabel="Add Topic"
        >
          <TopicList
            topics={topics}
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
          title="Delete Topic"
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
              Are you sure you want to delete the topic <b>{getItemName}</b>? This action cannot
              be undone.
            </p>
          </div>
        </Modal>

        {/* Add Topic Side Modal */}
        <SideModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          title="Add New Topic"
          description="Create a new topic"
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
          <TopicForm
            mode="create"
            onSubmit={handleModalSubmit}
            onCancel={closeAddModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>

        {/* Edit Topic Side Modal */}
        <SideModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title="Edit Topic"
          description="Update topic information"
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
          <TopicForm
            mode="edit"
            initialData={selectedTopic || undefined}
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

