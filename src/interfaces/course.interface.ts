// Course interfaces based on the database schema
export interface ICourse {
  id: string
  course_id: string
  course_type_id?: string
  course_category_id?: string
  course_name: string
  slug: string
  banner_image: string
  cover_image: string
  description?: string
  economical_price: number
  standard_price: number
  premium_price: number
  duration_type: string
  duration: number
  level?: string
  status_id: string
  created_by: string
  created_at: string
  updated_by?: string
  updated_at?: string
  deleted_by?: string
  deleted_at?: string
}

// Legacy interface for backward compatibility
export interface ICourseLegacy {
  id: string
  title: string
  description: string
  category: string
  trainer: string
  duration: string
  price: number
  students: number
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  isActive?: boolean
}

export interface ICourseCreateData {
  course_id: string
  course_type_id?: string
  course_category_id?: string
  course_name: string
  slug: string;
  banner_image: string;
  cover_image: string;
  description?: string
  economical_price: number
  standard_price: number
  premium_price: number
  duration_type: string
  duration: number
  level?: string
  status_id: string
  created_by?: string
}

export interface ICourseUpdateData extends Partial<ICourseCreateData> {
  course_id: string
  updated_by?: string
}

// Legacy interfaces for backward compatibility
export interface ICourseCreateDataLegacy {
  title: string
  description: string
  category: string
  trainer: string
  duration: string
  price: number
  status: 'active' | 'inactive' | 'draft'
  isActive?: boolean
}

export interface ICourseUpdateDataLegacy extends ICourseCreateDataLegacy {
  id: string
}

export interface ICourseFilters {
  course_category_id?: string
  course_type_id?: string
  status_id?: string
  level?: string
  search?: string
  price_min?: number
  price_max?: number
  duration_min?: number
  duration_max?: number
}

export interface ICoursePagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}
