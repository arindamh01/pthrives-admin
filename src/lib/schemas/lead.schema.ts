import { z } from 'zod';

// Lead Create Schema
export const leadCreateSchema = z.object({
  lead_id: z.string().min(1, 'Lead ID is required'),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  course_id: z.string().optional(),
  page_url: z.string().optional(),
  stage: z.string().min(1, 'Stage is required'),
  status_id: z.string().min(1, 'Status is required'),
  created_by: z.string().default('Admin'),
});

// Lead Update Schema (same as create but lead_id is optional)
export const leadUpdateSchema = z.object({
  lead_id: z.string().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  course_id: z.string().optional(),
  page_url: z.string().optional(),
  stage: z.string().min(1, 'Stage is required'),
  status_id: z.string().min(1, 'Status is required'),
  updated_by: z.string().default('Admin'),
});

export type LeadCreateFormData = z.infer<typeof leadCreateSchema>;
export type LeadUpdateFormData = z.infer<typeof leadUpdateSchema>;

