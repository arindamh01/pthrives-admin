import { NextRequest, NextResponse } from 'next/server'
import courseTypeService from '@/services/course-type.service'
import { ICourseTypeCreateData } from '@/interfaces/master.interface'

<<<<<<< HEAD
=======
// Force dynamic rendering
export const dynamic = 'force-dynamic'

>>>>>>> main
/**
 * GET /api/masters/course-types
 * Get all course types with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const search = searchParams.get('search') || ''
    const sort_by = searchParams.get('sort_by') || 'course_type_name'
    const sort_order = (searchParams.get('sort_order') || 'asc') as 'asc' | 'desc'

    const result = await courseTypeService.getCourseTypes({
      page,
      per_page,
      search,
      sort_by,
      sort_order
    })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error fetching course types:', error)
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
        message: 'Failed to fetch course types',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/masters/course-types
 * Create a new course type
 */
export async function POST(request: NextRequest) {
  try {
    const body: ICourseTypeCreateData = await request.json()

    // Validate required fields
    if (!body.course_type_id || !body.course_type_name) {
      return NextResponse.json(
        {
          data: null,
          message: 'course_type_id and course_type_name are required',
          success: false
        },
        { status: 400 }
      )
    }

    const result = await courseTypeService.createCourseType(body)

    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch (error) {
    console.error('Error creating course type:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to create course type',
        success: false
      },
      { status: 500 }
    )
  }
}

