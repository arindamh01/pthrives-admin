import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'
import { ICourse, ICourseCreateData, ICourseFilters } from '@/interfaces/course.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/courses - Get all courses with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    
    // Filter parameters
    const filters: ICourseFilters = {
      course_category_id: searchParams.get('course_category_id') || undefined,
      course_type_id: searchParams.get('course_type_id') || undefined,
      status_id: searchParams.get('status_id') || undefined,
      level: searchParams.get('level') || undefined,
      search: searchParams.get('search') || undefined,
      price_min: searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : undefined,
      price_max: searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : undefined,
      duration_min: searchParams.get('duration_min') ? parseInt(searchParams.get('duration_min')!) : undefined,
      duration_max: searchParams.get('duration_max') ? parseInt(searchParams.get('duration_max')!) : undefined
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof ICourseFilters] === undefined) {
        delete filters[key as keyof ICourseFilters]
      }
    })

    // Ordering parameters
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') === 'asc'

    const result = await databaseService.getPaginated<ICourse>(
      'gbl_courses',
      page,
      perPage,
      '*',
      filters,
      { column: sortBy, ascending: sortOrder },
      'course_name', // Search column
      filters.search
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      {
        data: [],
        pagination: {
          current_page: 1,
          per_page: 10,
          total: 0,
          last_page: 0,
          from: 0,
          to: 0
        },
        success: false,
        message: 'Failed to fetch courses'
      },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body: ICourseCreateData = await request.json()

    // Validate required fields
    if (!body.course_id || !body.course_name || !body.economical_price || 
        !body.standard_price || !body.premium_price || !body.duration_type || 
        !body.duration || !body.status_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Missing required fields: course_id, course_name, economical_price, standard_price, premium_price, duration_type, duration, status_id'
        },
        { status: 400 }
      )
    }

    // Validate price values
    if (body.economical_price <= 0 || body.standard_price <= 0 || body.premium_price <= 0) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'All price values must be greater than 0'
        },
        { status: 400 }
      )
    }

    // Validate duration
    if (body.duration <= 0) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Duration must be greater than 0'
        },
        { status: 400 }
      )
    }

    // Set default values
    const courseData: ICourseCreateData = {
      ...body,
      created_by: body.created_by || 'system'
    }

    const result = await databaseService.create<ICourse>('gbl_courses', courseData)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to create course'
      },
      { status: 500 }
    )
  }
}

