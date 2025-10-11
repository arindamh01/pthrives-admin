import { NextRequest, NextResponse } from 'next/server'
import courseTypeService from '@/services/course-type.service'
import { ICourseTypeUpdateData } from '@/interfaces/master.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/masters/course-types/[type_id]
 * Get a specific course type by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type_id: string }> }
) {
  try {
    const { type_id } = await params;
    const result = await courseTypeService.getCourseType(type_id)

    return NextResponse.json(result, { status: result.success ? 200 : 404 })
  } catch (error) {
    console.error('Error fetching course type:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to fetch course type',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/masters/course-types/[type_id]
 * Update a course type
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type_id: string }> }
) {
  try {
    const { type_id } = await params;
    const body: ICourseTypeUpdateData = await request.json()

    const result = await courseTypeService.updateCourseType(type_id, body)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error updating course type:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to update course type',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/masters/course-types/[type_id]
 * Delete a course type
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type_id: string }> }
) {
  try {
    const { type_id } = await params;
    const result = await courseTypeService.deleteCourseType(type_id)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error deleting course type:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to delete course type',
        success: false
      },
      { status: 500 }
    )
  }
}
