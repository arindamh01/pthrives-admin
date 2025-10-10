'use client';

import InputField from '@/components/form/input/InputField';
import SunEditorComponent from '@/components/form/input/SunEditorComponent';
import ImageUpload from '@/components/form/input/ImageUpload';
import CurrencyInput from '@/components/form/input/CurrencyInput';
import { ICourse } from '@/interfaces/course.interface';
import {
  CourseCreateFormData,
  courseCreateSchema,
  CourseUpdateFormData,
  courseUpdateSchema,
} from '@/lib/schemas/course.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useMemo, useCallback, forwardRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config/app.config';

interface CourseFormProps {
  initialData?: ICourse;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  onValidityChange?: (isValid: boolean) => void;
}

const CourseForm = forwardRef<HTMLFormElement, CourseFormProps>(({
  initialData,
  onSubmit,
  mode,
  onValidityChange,
}, ref) => {
  const schema = mode === 'create' ? courseCreateSchema : courseUpdateSchema;

  const [originalData, setOriginalData] = useState<Partial<CourseCreateFormData> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // State for master data
  const [courseCategories, setCourseCategories] = useState<ComboboxOption[]>([]);
  const [courseTypes, setCourseTypes] = useState<ComboboxOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Slug validation state
  const [slugValidation, setSlugValidation] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({ isChecking: false, isAvailable: null, message: '' });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CourseCreateFormData | CourseUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      course_name: '',
      slug: '',
      banner_image: undefined,
      cover_image: undefined,
      description: '',
      course_category_id: '',
      course_type_id: '',
      economical_price: APP_CONFIG.defaults.course.defaultEconomicalPrice,
      standard_price: APP_CONFIG.defaults.course.defaultStandardPrice,
      premium_price: APP_CONFIG.defaults.course.defaultPremiumPrice,
      duration_type: 'hours',
      duration: 1,
      level: 'Beginner',
      status_id: 'ACTIVE',
      created_by: 'Admin',
      updated_by: 'Admin',
    },
    mode: 'all',
  });

  // Watch form values
  const watchedValues = useWatch({ control });
  const courseName = watch('course_name');
  const slug = watch('slug');
  const statusId = watch('status_id');
  const courseCategoryId = watch('course_category_id');
  const courseTypeId = watch('course_type_id');
  const durationType = watch('duration_type');
  const level = watch('level');

  // Generate slug from course name
  const generateSlug = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, []);

  // Auto-generate slug when course name changes
  useEffect(() => {
    if (courseName && mode === 'create') {
      const generatedSlug = generateSlug(courseName);
      setValue('slug', generatedSlug, { shouldValidate: false });
    }
  }, [courseName, mode, generateSlug, setValue]);

  // Validate slug in real-time with debouncing
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugValidation({ isChecking: false, isAvailable: null, message: '' });
      clearErrors('slug');
      return;
    }

    // In edit mode, if slug hasn't changed from original, mark as available
    if (mode === 'edit' && initialData?.slug === slug) {
      setSlugValidation({
        isChecking: false,
        isAvailable: true,
        message: 'Slug is available',
      });
      clearErrors('slug');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSlugValidation({ isChecking: true, isAvailable: null, message: 'Checking availability...' });

      try {
        const params = new URLSearchParams({ slug });
        if (mode === 'edit' && initialData?.course_id) {
          params.append('course_id', initialData.course_id);
        }

        const response = await fetch(`/api/courses/validate-slug?${params}`);
        const result = await response.json();

        if (result.success) {
          setSlugValidation({
            isChecking: false,
            isAvailable: result.available,
            message: result.available ? 'Slug is available' : 'This slug is already taken',
          });

          if (!result.available) {
            setError('slug', { type: 'manual', message: 'This slug is already taken' });
          } else {
            clearErrors('slug');
          }
        } else {
          setSlugValidation({
            isChecking: false,
            isAvailable: null,
            message: 'Error checking slug availability',
          });
        }
      } catch (error) {
        console.error('Error validating slug:', error);
        setSlugValidation({
          isChecking: false,
          isAvailable: null,
          message: 'Error checking slug availability',
        });
      }
    }, 800); // Increased debounce time to 800ms

    return () => clearTimeout(timeoutId);
  }, [slug, mode, initialData, setError, clearErrors]);

  // Fetch course categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('/api/masters/course-categories?per_page=100');
        const result = await response.json();
        
        if (result.success && result.data) {
          const options: ComboboxOption[] = result.data.map((cat: any) => ({
            value: cat.course_category_id,
            label: cat.course_category_name,
          }));
          setCourseCategories(options);
        }
      } catch (error) {
        console.error('Error fetching course categories:', error);
        toast.error('Failed to load course categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch course types
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const response = await fetch('/api/masters/course-types?per_page=100');
        const result = await response.json();
        
        if (result.success && result.data) {
          const options: ComboboxOption[] = result.data.map((type: any) => ({
            value: type.course_type_id,
            label: type.course_type_name,
          }));
          setCourseTypes(options);
        }
      } catch (error) {
        console.error('Error fetching course types:', error);
        toast.error('Failed to load course types');
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  // Initialize form
  useEffect(() => {
    if (initialData) {
      const formData = {
        ...initialData,
        updated_by: 'Admin', // Ensure updated_by is always set
      };
      reset(formData);
      setOriginalData({
        course_name: initialData.course_name,
        slug: initialData.slug,
        banner_image: initialData.banner_image,
        cover_image: initialData.cover_image,
        description: initialData.description,
        course_category_id: initialData.course_category_id,
        course_type_id: initialData.course_type_id,
        economical_price: initialData.economical_price,
        standard_price: initialData.standard_price,
        premium_price: initialData.premium_price,
        duration_type: initialData.duration_type,
        duration: initialData.duration,
        level: initialData.level,
        status_id: initialData.status_id,
      });
      // Trigger validation after resetting form in edit mode
      setTimeout(() => trigger(), 100);
    } else {
      setOriginalData(null);
    }
    setIsInitialized(true);
  }, [initialData, reset, trigger]);

  // Check for changes
  const hasDataChanged = useMemo(() => {
    if (!isInitialized || mode !== 'edit' || !originalData) {
      return false;
    }

    const currentData = {
      course_name: watchedValues?.course_name || '',
      slug: watchedValues?.slug || '',
      banner_image: watchedValues?.banner_image || '',
      cover_image: watchedValues?.cover_image || '',
      description: watchedValues?.description || '',
      course_category_id: watchedValues?.course_category_id || '',
      course_type_id: watchedValues?.course_type_id || '',
      economical_price: watchedValues?.economical_price || 0,
      standard_price: watchedValues?.standard_price || 0,
      premium_price: watchedValues?.premium_price || 0,
      duration_type: watchedValues?.duration_type || 'hours',
      duration: watchedValues?.duration || 0,
      level: watchedValues?.level || '',
      status_id: watchedValues?.status_id || '',
    };

    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  }, [mode, originalData, watchedValues, isInitialized]);

  // Report validity
  useEffect(() => {
    if (onValidityChange) {
      // For edit mode, enable submit if form is valid and either data has changed OR slug is available
      const shouldEnableSubmit = mode === 'create' 
        ? isValid && slugValidation.isAvailable !== false
        : isValid && (hasDataChanged || slugValidation.isAvailable === true) && slugValidation.isAvailable !== false;
      
      // Debug logging
      console.log('Form validation state:', {
        mode,
        isValid,
        hasDataChanged,
        slugValidation: slugValidation.isAvailable,
        shouldEnableSubmit,
        errors: Object.keys(errors).length > 0 ? errors : 'No errors'
      });
      
      onValidityChange(shouldEnableSubmit);
    }
  }, [isValid, onValidityChange, mode, hasDataChanged, slugValidation.isAvailable, errors]);

  const handleFormSubmit = (data: CourseCreateFormData | CourseUpdateFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Current errors:', errors);
    console.log('Form is valid:', isValid);
    
    const formData = {
      ...data,
      created_by: mode === 'create' ? 'Admin' : 'Admin',
      updated_by: mode === 'edit' ? 'Admin' : 'Admin',
    };
    
    console.log('Sending to onSubmit:', formData);
    onSubmit(formData);
  };


  return (
    <form ref={ref} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Course ID (only shown in edit mode) */}
      {/* {mode === 'edit' && initialData && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Label className="text-xs font-medium text-gray-500">Course ID</Label>
          <p className="text-sm font-semibold text-gray-900 mt-1">{initialData.course_id}</p>
        </div>
      )} */}

      {/* Row 1: Course Name, Slug, Status - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InputField
          label={<>Course Name <span className="text-red-500">*</span></>}
          placeholder="e.g., PTE Academic Preparation"
          {...register('course_name')}
          error={errors.course_name?.message}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Slug <span className="text-red-500">*</span></Label>
            {courseName && (
              <button
                type="button"
                onClick={() => setValue('slug', generateSlug(courseName), { shouldValidate: true })}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Generate from name
              </button>
            )}
          </div>
          <div className="relative">
            <InputField
              placeholder="e.g., pte-academic-preparation"
              {...register('slug')}
              error={errors.slug?.message}
            />
            {slug && slug.length >= 3 && (
              <div className="absolute right-2 top-2">
                {slugValidation.isChecking ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : slugValidation.isAvailable === true ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : slugValidation.isAvailable === false ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          {slug && slug.length >= 3 && (
            <p className={`text-xs ${
              slugValidation.isChecking 
                ? 'text-blue-600' 
                : slugValidation.isAvailable === true 
                  ? 'text-green-600' 
                  : slugValidation.isAvailable === false 
                    ? 'text-red-600' 
                    : 'text-gray-500'
            }`}>
              {slugValidation.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Status <span className="text-red-500">*</span></Label>
          <div className="flex items-center justify-between p-3 border rounded-lg h-10">
            <span className="text-sm text-gray-700">
              {statusId === 'ACTIVE' ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={statusId === 'ACTIVE'}
              onCheckedChange={(checked) => setValue('status_id', checked ? 'ACTIVE' : 'INACTIVE', { shouldValidate: true })}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ImageUpload
          label="Banner Image"
          value={watch('banner_image') || ''}
          onChange={(value) => setValue('banner_image', value || undefined, { shouldValidate: true })}
          error={errors.banner_image?.message as string}
          aspectRatio={16 / 9}
          enableCropper={true}
          height="180px"
          recommendedRatio="16:9 aspect ratio recommended (optional)"
        />

        <ImageUpload
          label="Cover Image"
          value={watch('cover_image') || ''}
          onChange={(value) => setValue('cover_image', value || undefined, { shouldValidate: true })}
          error={errors.cover_image?.message as string}
          aspectRatio={4 / 3}
          enableCropper={true}
          height="180px"
          recommendedRatio="4:3 aspect ratio recommended (optional)"
        />
      </div>

      {/* Row 3: Description */}
      <SunEditorComponent
        label="Description"
        value={watch('description') || ''}
        onChange={(content) => setValue('description', content, { shouldValidate: true })}
        placeholder="Enter course description..."
        minHeight="180px"
        error={errors.description?.message}
        enableImageUpload={true}
      />

      {/* Row 4: Category, Type, Level - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Course Category</Label>
          <Combobox
            options={courseCategories}
            value={courseCategoryId}
            onValueChange={(value) => setValue('course_category_id', value, { shouldValidate: true })}
            placeholder={loadingCategories ? "Loading..." : "Select category"}
            searchPlaceholder="Search categories..."
            emptyText="No categories found."
            disabled={loadingCategories}
          />
          {errors.course_category_id && <p className="text-xs text-red-500">{errors.course_category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Course Type</Label>
          <Combobox
            options={courseTypes}
            value={courseTypeId}
            onValueChange={(value) => setValue('course_type_id', value, { shouldValidate: true })}
            placeholder={loadingTypes ? "Loading..." : "Select type"}
            searchPlaceholder="Search types..."
            emptyText="No types found."
            disabled={loadingTypes}
          />
          {errors.course_type_id && <p className="text-xs text-red-500">{errors.course_type_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Level</Label>
          <Select
            value={level || 'Beginner'}
            onValueChange={(value) => setValue('level', value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="All Levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && <p className="text-xs text-red-500">{errors.level.message}</p>}
        </div>
      </div>

      {/* Row 5: Pricing - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CurrencyInput
          label={<>Economical Price <span className="text-red-500">*</span></>}
          value={watch('economical_price') || 0}
          onChange={(value) => setValue('economical_price', value, { shouldValidate: true })}
          error={errors.economical_price?.message}
          placeholder="Enter economical price"
          minValue={0}
        />

        <CurrencyInput
          label={<>Standard Price <span className="text-red-500">*</span></>}
          value={watch('standard_price') || 0}
          onChange={(value) => setValue('standard_price', value, { shouldValidate: true })}
          error={errors.standard_price?.message}
          placeholder="Enter standard price"
          minValue={0}
        />

        <CurrencyInput
          label={<>Premium Price <span className="text-red-500">*</span></>}
          value={watch('premium_price') || 0}
          onChange={(value) => setValue('premium_price', value, { shouldValidate: true })}
          error={errors.premium_price?.message}
          placeholder="Enter premium price"
          minValue={0}
        />
      </div>

      {/* Row 6: Duration & Duration Type - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InputField
          label={<>Duration <span className="text-red-500">*</span></>}
          type="number"
          placeholder="e.g., 40"
          {...register('duration', { valueAsNumber: true })}
          error={errors.duration?.message}
        />

        <div className="space-y-2">
          <Label>Duration Type <span className="text-red-500">*</span></Label>
          <Select
            value={durationType || 'hours'}
            onValueChange={(value) => setValue('duration_type', value, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
          {errors.duration_type && <p className="text-xs text-red-500">{errors.duration_type.message}</p>}
        </div>
      </div>
    </form>
  );
});

CourseForm.displayName = 'CourseForm';

export default CourseForm;
