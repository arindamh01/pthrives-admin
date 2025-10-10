'use client';

import InputField from '@/components/form/input/InputField';
import { ITopic, ITopicCreateData } from '@/interfaces/master.interface';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TopicFormProps {
  initialData?: ITopic;
  onSubmit: (data: ITopicCreateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onValidityChange?: (isValid: boolean) => void;
}

export default function TopicForm({
  initialData,
  onSubmit,
  mode,
  onValidityChange,
}: TopicFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ITopicCreateData>({
    defaultValues: initialData || {
      topic_id: '',
      topic_name: '',
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
        label="Topic ID"
        placeholder="e.g., TP001"
        error={errors.topic_id?.message}
        disabled={mode === 'edit'}
        required
        {...register('topic_id', { required: 'Topic ID is required' })}
      />

      <InputField
        label="Topic Name"
        placeholder="e.g., JavaScript, React, Node.js"
        error={errors.topic_name?.message}
        required
        {...register('topic_name', { required: 'Topic Name is required' })}
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

