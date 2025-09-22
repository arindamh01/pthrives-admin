"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import ListCard from '@/components/common/ListCard'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CourseForm from '@/components/courses/CourseForm'
import CourseList from '@/components/courses/CourseList'
import { usePageTable } from '@/hooks/usePageTable'
import { ICourse } from '@/interfaces/course.interface'
import { createDeleteModalActions, createModalActions } from '@/lib/modal-actions'
import CourseService from '@/services/course.service'
import { BookOpen } from 'lucide-react'

export default function AdvancedCoursesPage() {

  // All the complex state management and logic is now handled by the hook
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
  } = usePageTable<ICourse>({
    fetchService: CourseService.getCourses.bind(CourseService),
    deleteService: CourseService.deleteCourse.bind(CourseService),
    createService: CourseService.createCourse.bind(CourseService),
    updateService: CourseService.updateCourse.bind(CourseService),
    toggleStatusService: CourseService.toggleStatus.bind(CourseService),
    getItemId: (course) => course.id,
    getItemName: (course) => course.title,
    entityName: 'course',
    additionalFilters: {}
  })

  return (
    <DashboardLayout>
      <div>
        <PageBreadcrumb 
          pageTitle="Courses" 
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Management' }
          ]}
        />

        <ListCard
          heading="Course Management"
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          addButton={true}
          onButtonClick={handleAdd}
        >
          <CourseList
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isLoading={isLoading}
          />
        </ListCard>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={closeDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the course <b>{getItemName}</b>? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {createDeleteModalActions(
                isDeleting,
                closeDeleteModal,
                handleDeleteConfirm
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Course Modal */}
        <Dialog open={showAddModal} onOpenChange={closeAddModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm
              mode="create"
              onSubmit={handleModalSubmit}
              onCancel={closeAddModal}
              isLoading={isSubmitting}
              onValidityChange={setIsFormValid}
            />
            <DialogFooter>
              {createModalActions(
                isSubmitting,
                isFormValid,
                closeAddModal,
                handleFormSubmit
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Modal */}
        <Dialog open={showEditModal} onOpenChange={closeEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <CourseForm
              mode="edit"
              initialData={selectedCourse || undefined}
              onSubmit={handleEditModalSubmit}
              onCancel={closeEditModal}
              isLoading={isSubmitting}
              onValidityChange={setIsFormValid}
            />
            <DialogFooter>
              {createModalActions(
                isSubmitting,
                isFormValid,
                closeEditModal,
                handleFormSubmit
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
