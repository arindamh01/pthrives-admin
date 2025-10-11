import { databaseService } from './database.service'
import { ICourseCategory, ICourseCategoryCreateData, ICourseCategoryUpdateData, IMasterPagination, IMasterFilters } from '@/interfaces/master.interface'

interface ApiResponse<T> {
  data: T | null
  message: string
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: IMasterPagination
  message: string
  success: boolean
}

class CourseCategoryService {
  /**
   * Get all course categories from database with pagination and filters
   */
  async getCourseCategories(params: {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ICourseCategory>> {
    const {
      page = 1,
      per_page = 10,
      search = '',
      sort_by = 'course_category_name',
      sort_order = 'asc'
    } = params

    const filters: IMasterFilters = {}
    if (search) filters.search = search

    const result = await databaseService.getPaginated<ICourseCategory>(
      'mst_course_categories',
      page,
      per_page,
      '*',
      filters,
      { column: sort_by, ascending: sort_order === 'asc' },
      'course_category_name',
      search
    )

    return {
      data: result.data || [],
      pagination: result.pagination,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get a specific course category by course_category_id from database
   */
  async getCourseCategory(courseCategoryId: string): Promise<ApiResponse<ICourseCategory>> {
    const result = await databaseService.getById<ICourseCategory>(
      'mst_course_categories',
      courseCategoryId,
      'course_category_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a new course category in database
   */
  async createCourseCategory(data: ICourseCategoryCreateData): Promise<ApiResponse<ICourseCategory>> {
    const result = await databaseService.create<ICourseCategory>('mst_course_categories', data)

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Update a course category in database
   */
  async updateCourseCategory(courseCategoryId: string, data: ICourseCategoryUpdateData): Promise<ApiResponse<ICourseCategory>> {
    const result = await databaseService.update<ICourseCategory>(
      'mst_course_categories',
      courseCategoryId,
      data,
      'course_category_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Delete a course category from database
   */
  async deleteCourseCategory(courseCategoryId: string): Promise<ApiResponse<null>> {
    const result = await databaseService.hardDelete(
      'mst_course_categories',
      courseCategoryId,
      'course_category_id'
    )

    return {
      data: null,
      message: result.message,
      success: result.success
    }
  }
}

const courseCategoryService = new CourseCategoryService()
export default courseCategoryService

