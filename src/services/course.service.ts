import { databaseService } from './database.service'
import { ICourse, ICourseCreateData, ICourseUpdateData, ICoursePagination, ICourseFilters } from '@/interfaces/course.interface'

interface ApiResponse<T> {
  data: T | null
  message: string
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: ICoursePagination
  message: string
  success: boolean
}

class CourseService {
  /**
   * Get all courses from database with pagination and filters
   */
  async getCourses(params: {
    page?: number
    per_page?: number
    search?: string
    course_category_id?: string
    course_type_id?: string
    status_id?: string
    level?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ICourse>> {
    const {
      page = 1,
      per_page = 10,
      search = '',
      course_category_id,
      course_type_id,
      status_id,
      level,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params

    const filters: ICourseFilters = {}
    if (course_category_id) filters.course_category_id = course_category_id
    if (course_type_id) filters.course_type_id = course_type_id
    if (status_id) filters.status_id = status_id
    if (level) filters.level = level
    if (search) filters.search = search

    const result = await databaseService.getPaginated<ICourse>(
      'gbl_courses',
      page,
      per_page,
      '*',
      filters,
      { column: sort_by, ascending: sort_order === 'asc' },
      'course_name',
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
   * Get a specific course by course_id from database
   */
  async getCourse(courseId: string): Promise<ApiResponse<ICourse>> {
    const result = await databaseService.getById<ICourse>(
      'gbl_courses',
      courseId,
      'course_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a new course in database
   */
  async createCourse(data: ICourseCreateData): Promise<ApiResponse<ICourse>> {
    const courseData = {
      ...data,
      created_by: data.created_by || 'Admin',
      created_at: new Date().toISOString()
    }

    const result = await databaseService.create<ICourse>('gbl_courses', courseData)

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Update a course in database
   */
  async updateCourse(courseId: string, data: ICourseUpdateData): Promise<ApiResponse<ICourse>> {
    const updateData = {
      ...data,
      updated_by: data.updated_by || 'Admin',
      updated_at: new Date().toISOString()
    }

    const result = await databaseService.update<ICourse>(
      'gbl_courses',
      courseId,
      updateData,
      'course_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Soft delete a course in database
   */
  async deleteCourse(courseId: string, deletedBy: string = 'Admin'): Promise<ApiResponse<null>> {
    const result = await databaseService.softDelete(
      'gbl_courses',
      courseId,
      deletedBy,
      'course_id'
    )

    return {
      data: null,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Toggle course status (active/inactive)
   */
  async toggleStatus(courseId: string): Promise<ApiResponse<ICourse>> {
    // First, get the current course
    const courseResult = await this.getCourse(courseId)
    
    if (!courseResult.success || !courseResult.data) {
      return {
        data: null,
        message: 'Course not found',
        success: false
      }
    }

    const currentStatus = courseResult.data.status_id
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

    const result = await databaseService.update<ICourse>(
      'gbl_courses',
      courseId,
      {
        status_id: newStatus,
        updated_by: 'Admin',
        updated_at: new Date().toISOString()
      },
      'course_id'
    )

    return {
      data: result.data,
      message: `Course ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
      success: result.success
    }
  }
}

const courseService = new CourseService()
export default courseService
