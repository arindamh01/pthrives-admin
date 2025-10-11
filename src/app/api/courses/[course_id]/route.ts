import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'
import { ICourse, ICourseUpdateData } from '@/interfaces/course.interface'

<<<<<<< HEAD
=======
// Force dynamic rendering
export const dynamic = 'force-dynamic'

>>>>>>> main
// GET /api/courses/[course_id] - Get a specific course by course_id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course_id: string }> }
) {
  try {
    const { course_id } = await params

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

    const result = await databaseService.getById<ICourse>(
      'gbl_courses',
      course_id,
      'course_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to fetch course'
      },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[course_id] - Update a specific course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ course_id: string }> }
) {
  try {
    const { course_id } = await params
    const body: ICourseUpdateData = await request.json()

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

    // Validate price values if provided
    if (body.economical_price !== undefined && body.economical_price <= 0) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Economical price must be greater than 0'
        },
        { status: 400 }
      )
    }

    if (body.standard_price !== undefined && body.standard_price <= 0) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Standard price must be greater than 0'
        },
        { status: 400 }
      )
    }

    if (body.premium_price !== undefined && body.premium_price <= 0) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Premium price must be greater than 0'
        },
        { status: 400 }
      )
    }

    // Validate duration if provided
    if (body.duration !== undefined && body.duration <= 0) {
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

    // Add updated_by and updated_at
    const updateData = {
      ...body,
      updated_by: body.updated_by || 'system',
      updated_at: new Date().toISOString()
    }

    const result = await databaseService.update<ICourse>(
      'gbl_courses',
      course_id,
      updateData,
      'course_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to update course'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[course_id] - Soft delete a specific course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ course_id: string }> }
) {
  try {
    const { course_id } = await params
    const { searchParams } = new URL(request.url)
    const deletedBy = searchParams.get('deleted_by') || 'system'

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

    const result = await databaseService.softDelete(
      'gbl_courses',
      course_id,
      deletedBy,
      'course_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to delete course'
      },
      { status: 500 }
    )
  }
}

