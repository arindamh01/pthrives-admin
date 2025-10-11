import { NextRequest, NextResponse } from 'next/server'
import courseCategoryService from '@/services/course-category.service'
import { ICourseCategoryUpdateData } from '@/interfaces/master.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/masters/course-categories/[category_id]
 * Get a specific course category by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;
    const result = await courseCategoryService.getCourseCategory(category_id)

    return NextResponse.json(result, { status: result.success ? 200 : 404 })
  } catch (error) {
    console.error('Error fetching course category:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to fetch course category',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/masters/course-categories/[category_id]
 * Update a course category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;
    const body: ICourseCategoryUpdateData = await request.json()

    const result = await courseCategoryService.updateCourseCategory(category_id, body)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error updating course category:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to update course category',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/masters/course-categories/[category_id]
 * Delete a course category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  try {
    const { category_id } = await params;
    const result = await courseCategoryService.deleteCourseCategory(category_id)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error deleting course category:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to delete course category',
        success: false
      },
      { status: 500 }
    )
  }
}

