'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ListCard from '@/components/common/ListCard';
import LeadForm from '@/components/leads/LeadForm';
import LeadList from '@/components/leads/LeadList';
import { Modal } from '@/components/ui/modal/Modal';
import { SideModal } from '@/components/ui/modal/SideModal';
import { usePageTable } from '@/hooks/usePageTable';
import { ICrmLead } from '@/interfaces/lead.interface';
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default function LeadsPage() {
  const {
    // State
    items: leads,
    isLoading,
    showDeleteModal,
    showAddModal,
    showEditModal,
    selectedItem: selectedLead,
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
  } = usePageTable<ICrmLead>({
    fetchService: async (params) => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        per_page: params.per_page.toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
      });

      const response = await fetch(`/api/leads?${queryParams}`);
      return response.json();
    },
    deleteService: async (id) => {
      const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      return response.json();
    },
    createService: async (data) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateService: async (id, data) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getItemId: (lead) => lead.lead_id,
    getItemName: (lead) => lead.full_name,
    entityName: 'lead',
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Leads" />

        <ListCard
          heading="Lead Management"
          description="Manage your CRM leads and track conversions"
          icon={faUsers}
          addButton={true}
          onButtonClick={handleAdd}
          addButtonLabel="Add Lead"
        >
          <LeadList
            leads={leads}
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
          title="Delete Lead"
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
              Are you sure you want to delete the lead <b>{getItemName}</b>? This action
              cannot be undone.
            </p>
          </div>
        </Modal>

        {/* Add Lead Side Modal */}
        <SideModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          title="Add New Lead"
          description="Create a new lead in your CRM system"
          side="right"
          size="lg"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeAddModal,
            handleFormSubmit
          )}
        >
          <LeadForm
            mode="create"
            onSubmit={handleModalSubmit}
            onCancel={closeAddModal}
            isLoading={isSubmitting}
            onValidityChange={setIsFormValid}
          />
        </SideModal>

        {/* Edit Lead Side Modal */}
        <SideModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title="Edit Lead"
          description="Update lead information"
          side="right"
          size="lg"
          showActions={true}
          actions={createModalActions(
            isSubmitting,
            isFormValid,
            closeEditModal,
            handleFormSubmit,
            'Update'
          )}
        >
          <LeadForm
            mode="edit"
            initialData={selectedLead || undefined}
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

