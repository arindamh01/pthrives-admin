import React from 'react'
import { Button } from '@/components/ui/button'

export const createModalActions = (
  isSubmitting: boolean,
  isFormValid: boolean,
  onCancel: () => void,
  onSubmit: () => void
) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || !isFormValid}
        className="bg-gradient-to-r from-pthrives-teal to-pthrives-green hover:from-pthrives-teal/90 hover:to-pthrives-green/90"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </>
  )
}

export const createDeleteModalActions = (
  isDeleting: boolean,
  onCancel: () => void,
  onConfirm: () => void
) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </>
  )
}
