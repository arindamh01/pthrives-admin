"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseFormData } from '@/lib/schemas'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ICourse } from '@/interfaces/course.interface'

interface CourseFormProps {
  initialData?: ICourse
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
  onValidityChange?: (isValid: boolean) => void
}

export default function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
  onValidityChange,
}: CourseFormProps) {
  const [originalData, setOriginalData] = useState<Omit<CourseFormData, 'isActive'> | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      trainer: '',
      duration: '',
      price: 0,
      status: 'draft',
    },
    mode: 'all',
  })

  const watchedValues = useWatch({ control: form.control })

  useEffect(() => {
    if (initialData && !isInitialized) {
      const formData = {
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        trainer: initialData.trainer,
        duration: initialData.duration,
        price: initialData.price,
        status: initialData.status,
      }
      
      form.reset(formData)
      
      const originalDataForComparison = {
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        trainer: initialData.trainer,
        duration: initialData.duration,
        price: initialData.price,
        status: initialData.status,
      }
      setOriginalData(originalDataForComparison)
      setIsInitialized(true)
    }
  }, [initialData, form.reset, mode, isInitialized])

  // Only run after initialized
  const hasDataChanged = useMemo(() => {
    if (!isInitialized) return false
    if (mode !== 'edit' || !originalData) return false
    
    const currentData = {
      title: watchedValues?.title || '',
      description: watchedValues?.description || '',
      category: watchedValues?.category || '',
      trainer: watchedValues?.trainer || '',
      duration: watchedValues?.duration || '',
      price: watchedValues?.price || 0,
      status: watchedValues?.status || 'draft',
    }
    
    return JSON.stringify(currentData) !== JSON.stringify(originalData)
  }, [mode, originalData, watchedValues, isInitialized])

  // Call onValidityChange when form validity changes
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(mode === 'create' ? form.formState.isValid : form.formState.isValid && hasDataChanged)
    }
  }, [form.formState.isValid, onValidityChange, mode, hasDataChanged])

  const handleFormSubmit = (data: CourseFormData) => {
    onSubmit(data)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      form.handleSubmit(handleFormSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} onKeyDown={handleKeyPress}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Course Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter course title" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive title for your course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="devops">DevOps & Cloud</SelectItem>
                    <SelectItem value="business">Business & Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the course category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter course description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of what students will learn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <FormField
            control={form.control}
            name="trainer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Trainer <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter trainer name" {...field} />
                </FormControl>
                <FormDescription>
                  Course instructor name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Duration <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 8 weeks" {...field} />
                </FormControl>
                <FormDescription>
                  Course duration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price ($) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Course price in USD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>
                Status <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Course publication status
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
