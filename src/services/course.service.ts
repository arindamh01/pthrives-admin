import { ICourse, ICourseCreateData, ICourseUpdateData, ICoursePagination } from '@/interfaces/course.interface'

// Mock data for demonstration
const mockCourses: ICourse[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    category: 'web-development',
    trainer: 'John Doe',
    duration: '8 weeks',
    price: 99,
    students: 156,
    status: 'active',
    createdAt: '2024-01-15',
    createdBy: 'Admin',
    updatedAt: '2024-01-20',
    updatedBy: 'Admin',
    isActive: true
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Master Python for data analysis and visualization',
    category: 'data-science',
    trainer: 'Dr. Emily Chen',
    duration: '12 weeks',
    price: 149,
    students: 89,
    status: 'active',
    createdAt: '2024-01-10',
    createdBy: 'Admin',
    updatedAt: '2024-01-18',
    updatedBy: 'Admin',
    isActive: true
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'Design beautiful and user-friendly interfaces',
    category: 'design',
    trainer: 'Sarah Wilson',
    duration: '6 weeks',
    price: 79,
    students: 234,
    status: 'active',
    createdAt: '2024-01-08',
    createdBy: 'Admin',
    updatedAt: '2024-01-15',
    updatedBy: 'Admin',
    isActive: true
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts',
    category: 'data-science',
    trainer: 'Dr. Michael Rodriguez',
    duration: '10 weeks',
    price: 199,
    students: 67,
    status: 'draft',
    createdAt: '2024-01-20',
    createdBy: 'Admin',
    isActive: true
  }
]

interface ApiResponse<T> {
  data: T
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
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getCourses(params: {
    page?: number
    perPage?: number
    search?: string
    category?: string
    status?: string
    trainer?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ICourse>> {
    await this.delay(500) // Simulate API delay

    const {
      page = 1,
      perPage = 10,
      search = '',
      category = '',
      status = '',
      trainer = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    let filteredCourses = [...mockCourses]

    // Apply filters
    if (search) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.trainer.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filteredCourses = filteredCourses.filter(course => course.category === category)
    }

    if (status) {
      filteredCourses = filteredCourses.filter(course => course.status === status)
    }

    if (trainer) {
      filteredCourses = filteredCourses.filter(course => course.trainer === trainer)
    }

    // Apply sorting
    filteredCourses.sort((a, b) => {
      const aValue = a[sortBy as keyof ICourse] || ''
      const bValue = b[sortBy as keyof ICourse] || ''
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const total = filteredCourses.length
    const lastPage = Math.ceil(total / perPage)
    const from = (page - 1) * perPage + 1
    const to = Math.min(page * perPage, total)
    const paginatedCourses = filteredCourses.slice((page - 1) * perPage, page * perPage)

    return {
      data: paginatedCourses,
      pagination: {
        current_page: page,
        per_page: perPage,
        total,
        last_page: lastPage,
        from,
        to
      },
      message: 'Courses fetched successfully',
      success: true
    }
  }

  async getCourse(id: string): Promise<ApiResponse<ICourse>> {
    await this.delay(300)
    
    const course = mockCourses.find(c => c.id === id)
    if (!course) {
      throw new Error('Course not found')
    }

    return {
      data: course,
      message: 'Course fetched successfully',
      success: true
    }
  }

  async createCourse(data: ICourseCreateData): Promise<ApiResponse<ICourse>> {
    await this.delay(800)
    
    const newCourse: ICourse = {
      ...data,
      id: Date.now().toString(),
      students: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      isActive: data.isActive ?? true
    }

    mockCourses.unshift(newCourse)

    return {
      data: newCourse,
      message: 'Course created successfully',
      success: true
    }
  }

  async updateCourse(id: string, data: ICourseUpdateData): Promise<ApiResponse<ICourse>> {
    await this.delay(800)
    
    const courseIndex = mockCourses.findIndex(c => c.id === id)
    if (courseIndex === -1) {
      throw new Error('Course not found')
    }

    const updatedCourse: ICourse = {
      ...mockCourses[courseIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Current User'
    }

    mockCourses[courseIndex] = updatedCourse

    return {
      data: updatedCourse,
      message: 'Course updated successfully',
      success: true
    }
  }

  async deleteCourse(id: string): Promise<ApiResponse<null>> {
    await this.delay(600)
    
    const courseIndex = mockCourses.findIndex(c => c.id === id)
    if (courseIndex === -1) {
      throw new Error('Course not found')
    }

    mockCourses.splice(courseIndex, 1)

    return {
      data: null,
      message: 'Course deleted successfully',
      success: true
    }
  }

  async toggleStatus(id: string): Promise<ApiResponse<ICourse>> {
    await this.delay(500)
    
    const courseIndex = mockCourses.findIndex(c => c.id === id)
    if (courseIndex === -1) {
      throw new Error('Course not found')
    }

    const course = mockCourses[courseIndex]
    const newStatus = course.status === 'active' ? 'inactive' : 'active'
    
    const updatedCourse: ICourse = {
      ...course,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Current User'
    }

    mockCourses[courseIndex] = updatedCourse

    return {
      data: updatedCourse,
      message: `Course ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      success: true
    }
  }
}

const courseService = new CourseService()
export default courseService
