import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/courses/[course_id]/topics - Get all topics for a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course_id: string }> }
) {
  try {
    const { course_id } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    const sortBy = searchParams.get('sort_by') || 'sequence_no'
    const sortOrder = searchParams.get('sort_order') === 'asc'

    if (!course_id) {
      return NextResponse.json(
        {
          data: [],
          pagination: {
            current_page: page,
            per_page: perPage,
            total: 0,
            last_page: 0,
            from: 0,
            to: 0
          },
          success: false,
          message: 'Course ID is required'
        },
        { status: 400 }
      )
    }

    const result = await databaseService.getPaginated(
      'gbl_course_topics',
      page,
      perPage,
      '*',
      { course_id },
      { column: sortBy, ascending: sortOrder }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching course topics:', error)
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
        message: 'Failed to fetch course topics'
      },
      { status: 500 }
    )
  }
}

// POST /api/courses/[course_id]/topics - Create a new topic for a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ course_id: string }> }
) {
  try {
    const { course_id } = await params
    const body = await request.json()

    if (!course_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Course ID is required'
        },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.topic_id || !body.status_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Missing required fields: topic_id, status_id'
        },
        { status: 400 }
      )
    }

    const topicData = {
      ...body,
      course_id,
      created_by: body.created_by || 'system'
    }

    const result = await databaseService.create(
      'gbl_course_topics',
      topicData
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating course topic:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to create course topic'
      },
      { status: 500 }
    )
  }
}

