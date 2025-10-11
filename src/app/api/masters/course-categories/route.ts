import { NextRequest, NextResponse } from 'next/server'
import courseCategoryService from '@/services/course-category.service'
import { ICourseCategoryCreateData } from '@/interfaces/master.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/masters/course-categories
 * Get all course categories with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const search = searchParams.get('search') || ''
    const sort_by = searchParams.get('sort_by') || 'course_category_name'
    const sort_order = (searchParams.get('sort_order') || 'asc') as 'asc' | 'desc'

    const result = await courseCategoryService.getCourseCategories({
      page,
      per_page,
      search,
      sort_by,
      sort_order
    })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error fetching course categories:', error)
    return NextResponse.json(
      {
        data: [],
        pagination: {
          current_page: 1,
          per_page: 10,
          total: 0,
          last_page: 1,
          from: 0,
          to: 0
        },
        message: 'Failed to fetch course categories',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/masters/course-categories
 * Create a new course category
 */
export async function POST(request: NextRequest) {
  try {
    const body: ICourseCategoryCreateData = await request.json()

    // Validate required fields
    if (!body.course_category_id || !body.course_category_name) {
      return NextResponse.json(
        {
          data: null,
          message: 'course_category_id and course_category_name are required',
          success: false
        },
        { status: 400 }
      )
    }

    const result = await courseCategoryService.createCourseCategory(body)

    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch (error) {
    console.error('Error creating course category:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to create course category',
        success: false
      },
      { status: 500 }
    )
  }
}

