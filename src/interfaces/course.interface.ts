export interface ICourse {
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
  title: string
  description: string
  category: string
  trainer: string
  duration: string
  price: number
  status: 'active' | 'inactive' | 'draft'
  isActive?: boolean
}

export interface ICourseUpdateData extends ICourseCreateData {
  id: string
}

export interface ICourseFilters {
  category?: string
  status?: string
  trainer?: string
  search?: string
}

export interface ICoursePagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}
