'use client';

import InputField from '@/components/form/input/InputField';
import { ICrmLead } from '@/interfaces/lead.interface';
import {
  LeadCreateFormData,
  leadCreateSchema,
  LeadUpdateFormData,
  leadUpdateSchema,
} from '@/lib/schemas/lead.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadFormProps {
  initialData?: ICrmLead;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onValidityChange?: (isValid: boolean) => void;
}

export default function LeadForm({
  initialData,
  onSubmit,
  mode,
  onValidityChange,
}: LeadFormProps) {
  const schema = mode === 'create' ? leadCreateSchema : leadUpdateSchema;

  const [originalData, setOriginalData] = useState<Partial<LeadCreateFormData> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<LeadCreateFormData | LeadUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      lead_id: '',
      full_name: '',
      email: '',
      phone: '',
      source: '',
      campaign: '',
      course_id: '',
      page_url: '',
      stage: 'New',
      status_id: 'ACTIVE',
    },
    mode: 'all',
  });

  // Watch form values for change detection
  const watchedValues = useWatch({ control });

  // Initialize form with lead data if editing
  useEffect(() => {
    if (initialData) {
      const formData = {
        ...initialData,
      };
      reset(formData);
      setOriginalData({
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        source: initialData.source,
        campaign: initialData.campaign,
        course_id: initialData.course_id,
        stage: initialData.stage,
        status_id: initialData.status_id,
      });
    } else {
      setOriginalData(null);
    }
    setIsInitialized(true);
  }, [initialData, reset]);

  // Check if form data has changed (only for edit mode)
  const hasDataChanged = useMemo(() => {
    if (!isInitialized || mode !== 'edit' || !originalData) {
      return false;
    }

    const currentData = {
      full_name: watchedValues?.full_name || '',
      email: watchedValues?.email || '',
      phone: watchedValues?.phone || '',
      source: watchedValues?.source || '',
      campaign: watchedValues?.campaign || '',
      course_id: watchedValues?.course_id || '',
      stage: watchedValues?.stage || '',
      status_id: watchedValues?.status_id || '',
    };

    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  }, [mode, originalData, watchedValues, isInitialized]);

  // Report form validity to parent
  useEffect(() => {
    if (onValidityChange) {
      const shouldEnableSubmit = mode === 'create' ? isValid : isValid && hasDataChanged;
      onValidityChange(shouldEnableSubmit);
    }
  }, [isValid, onValidityChange, mode, hasDataChanged]);

  const handleFormSubmit = (data: LeadCreateFormData | LeadUpdateFormData) => {
    const formData = {
      ...data,
      created_by: 'Admin',
      updated_by: 'Admin',
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Lead ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label={<>Lead ID <span className="text-red-500">*</span></>}
          placeholder="e.g., LEAD-001"
          {...register('lead_id')}
          error={errors.lead_id?.message}
          className="uppercase"
          disabled={mode === 'edit'}
        />

        <div className="space-y-2">
          <Label>
            Stage <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watchedValues?.stage || 'New'}
            onValueChange={(value) => setValue('stage', value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          {errors.stage && <p className="text-sm text-red-500">{errors.stage.message}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label={<>Full Name <span className="text-red-500">*</span></>}
          placeholder="e.g., John Doe"
          {...register('full_name')}
          error={errors.full_name?.message}
        />

        <InputField
          label={<>Email <span className="text-red-500">*</span></>}
          type="email"
          placeholder="e.g., john@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Phone"
          type="tel"
          placeholder="e.g., +1234567890"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <InputField
          label="Source"
          placeholder="e.g., Website, Referral"
          {...register('source')}
          error={errors.source?.message}
        />
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Campaign"
          placeholder="e.g., Summer 2024"
          {...register('campaign')}
          error={errors.campaign?.message}
        />

        <InputField
          label="Course ID"
          placeholder="e.g., PTE-001"
          {...register('course_id')}
          error={errors.course_id?.message}
        />
      </div>

      <InputField
        label="Page URL"
        placeholder="e.g., https://example.com/page"
        {...register('page_url')}
        error={errors.page_url?.message}
      />

      {/* Status */}
      <div className="space-y-2">
        <Label>
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={watchedValues?.status_id || 'ACTIVE'}
          onValueChange={(value) => setValue('status_id', value, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.status_id && <p className="text-sm text-red-500">{errors.status_id.message}</p>}
      </div>
    </form>
  );
}

