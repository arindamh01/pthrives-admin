import { ModalAction } from '@/components/ui/modal/Modal';

export function createModalActions(
  isSubmitting: boolean,
  isFormValid: boolean,
  onCancel: () => void,
  onSubmit: () => void,
  submitLabel: string = 'Submit',
  cancelLabel: string = 'Cancel'
): ModalAction[] {
  return [
    {
      label: cancelLabel,
      onClick: onCancel,
      variant: 'outline',
      disabled: isSubmitting,
    },
    {
      label: isSubmitting ? 'Saving...' : submitLabel,
      onClick: onSubmit,
      variant: 'primary',
      disabled: !isFormValid || isSubmitting,
      loading: isSubmitting,
    },
  ];
}

export function createDeleteModalActions(
  isDeleting: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  confirmLabel: string = 'Delete',
  cancelLabel: string = 'Cancel'
): ModalAction[] {
  return [
    {
      label: cancelLabel,
      onClick: onCancel,
      variant: 'outline',
      disabled: isDeleting,
    },
    {
      label: isDeleting ? 'Deleting...' : confirmLabel,
      onClick: onConfirm,
      variant: 'destructive',
      disabled: isDeleting,
      loading: isDeleting,
    },
  ];
}
