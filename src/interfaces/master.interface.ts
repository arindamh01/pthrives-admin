// Master module interfaces based on the database schema

// Course Type interfaces
export interface ICourseType {
  id: string
  course_type_id: string
  course_type_name: string
  description?: string
}

export interface ICourseTypeCreateData {
  course_type_id: string
  course_type_name: string
  description?: string
}

export interface ICourseTypeUpdateData extends Partial<ICourseTypeCreateData> {
  course_type_id: string
}

// Course Category interfaces
export interface ICourseCategory {
  id: string
  course_category_id: string
  course_category_name: string
  description?: string
}

export interface ICourseCategoryCreateData {
  course_category_id: string
  course_category_name: string
  description?: string
}

export interface ICourseCategoryUpdateData extends Partial<ICourseCategoryCreateData> {
  course_category_id: string
}

// Topic interfaces
export interface ITopic {
  id: string
  topic_id: string
  topic_name: string
  description?: string
}

export interface ITopicCreateData {
  topic_id: string
  topic_name: string
  description?: string
}

export interface ITopicUpdateData extends Partial<ITopicCreateData> {
  topic_id: string
}

// Generic pagination interface for masters
export interface IMasterPagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

// Generic filters interface for masters
export interface IMasterFilters {
  search?: string
}

