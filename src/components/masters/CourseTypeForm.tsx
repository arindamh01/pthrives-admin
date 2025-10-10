'use client';

import InputField from '@/components/form/input/InputField';
import { ICourseType, ICourseTypeCreateData } from '@/interfaces/master.interface';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CourseTypeFormProps {
  initialData?: ICourseType;
  onSubmit: (data: ICourseTypeCreateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onValidityChange?: (isValid: boolean) => void;
}

export default function CourseTypeForm({
  initialData,
  onSubmit,
  mode,
  onValidityChange,
}: CourseTypeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ICourseTypeCreateData>({
    defaultValues: initialData || {
      course_type_id: '',
      course_type_name: '',
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
        label="Course Type ID"
        placeholder="e.g., CT001"
        error={errors.course_type_id?.message}
        disabled={mode === 'edit'}
        required
        {...register('course_type_id', { required: 'Course Type ID is required' })}
      />

      <InputField
        label="Course Type Name"
        placeholder="e.g., Online, Offline, Hybrid"
        error={errors.course_type_name?.message}
        required
        {...register('course_type_name', { required: 'Course Type Name is required' })}
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

