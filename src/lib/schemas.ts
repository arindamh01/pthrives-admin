import { z } from 'zod'

// Course Schema
export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  trainer: z.string().min(1, 'Trainer is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.number().min(0, 'Price must be positive').max(10000, 'Price must be less than $10,000'),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
})

export type CourseFormData = z.infer<typeof courseSchema>

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required').min(5, 'Description must be at least 5 characters'),
  color: z.string().min(1, 'Color is required'),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Trainer Schema
export const trainerSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  specialty: z.string().min(1, 'Specialty is required'),
  experience: z.string().min(1, 'Experience is required'),
  bio: z.string().min(1, 'Bio is required').min(20, 'Bio must be at least 20 characters'),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
})

export type TrainerFormData = z.infer<typeof trainerSchema>

// Student Schema
export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
})

export type StudentFormData = z.infer<typeof studentSchema>
