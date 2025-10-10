import { databaseService } from './database.service'
import { ICourseType, ICourseTypeCreateData, ICourseTypeUpdateData, IMasterPagination, IMasterFilters } from '@/interfaces/master.interface'

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

class CourseTypeService {
  /**
   * Get all course types from database with pagination and filters
   */
  async getCourseTypes(params: {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ICourseType>> {
    const {
      page = 1,
      per_page = 10,
      search = '',
      sort_by = 'course_type_name',
      sort_order = 'asc'
    } = params

    const filters: IMasterFilters = {}
    if (search) filters.search = search

    const result = await databaseService.getPaginated<ICourseType>(
      'mst_course_types',
      page,
      per_page,
      '*',
      filters,
      { column: sort_by, ascending: sort_order === 'asc' },
      'course_type_name',
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
   * Get a specific course type by course_type_id from database
   */
  async getCourseType(courseTypeId: string): Promise<ApiResponse<ICourseType>> {
    const result = await databaseService.getById<ICourseType>(
      'mst_course_types',
      courseTypeId,
      'course_type_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a new course type in database
   */
  async createCourseType(data: ICourseTypeCreateData): Promise<ApiResponse<ICourseType>> {
    const result = await databaseService.create<ICourseType>('mst_course_types', data)

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Update a course type in database
   */
  async updateCourseType(courseTypeId: string, data: ICourseTypeUpdateData): Promise<ApiResponse<ICourseType>> {
    const result = await databaseService.update<ICourseType>(
      'mst_course_types',
      courseTypeId,
      data,
      'course_type_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Delete a course type from database
   */
  async deleteCourseType(courseTypeId: string): Promise<ApiResponse<null>> {
    const result = await databaseService.hardDelete(
      'mst_course_types',
      courseTypeId,
      'course_type_id'
    )

    return {
      data: null,
      message: result.message,
      success: result.success
    }
  }
}

const courseTypeService = new CourseTypeService()
export default courseTypeService

