'use client';

import InputField from '@/components/form/input/InputField';
import { ICourseCategory, ICourseCategoryCreateData } from '@/interfaces/master.interface';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CourseCategoryFormProps {
  initialData?: ICourseCategory;
  onSubmit: (data: ICourseCategoryCreateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onValidityChange?: (isValid: boolean) => void;
}

export default function CourseCategoryForm({
  initialData,
  onSubmit,
  mode,
  onValidityChange,
}: CourseCategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ICourseCategoryCreateData>({
    defaultValues: initialData || {
      course_category_id: '',
      course_category_name: '',
      description: '',
    },
    mode: 'all',
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <InputField
        label="Course Category ID"
        placeholder="e.g., CC001"
        error={errors.course_category_id?.message}
        disabled={mode === 'edit'}
        required
        {...register('course_category_id', { required: 'Course Category ID is required' })}
      />

      <InputField
        label="Course Category Name"
        placeholder="e.g., Programming, Design, Marketing"
        error={errors.course_category_name?.message}
        required
        {...register('course_category_name', { required: 'Course Category Name is required' })}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description (optional)"
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
    </form>
  );
}

