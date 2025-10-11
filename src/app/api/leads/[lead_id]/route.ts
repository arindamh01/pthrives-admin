import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'
import { ICrmLead, ICrmLeadUpdateData } from '@/interfaces/lead.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/leads/[lead_id] - Get a specific lead by lead_id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lead_id: string }> }
) {
  try {
    const { lead_id } = await params

    if (!lead_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Lead ID is required'
        },
        { status: 400 }
      )
    }

    const result = await databaseService.getById<ICrmLead>(
      'crm_leads',
      lead_id,
      'lead_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to fetch lead'
      },
      { status: 500 }
    )
  }
}

// PUT /api/leads/[lead_id] - Update a specific lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lead_id: string }> }
) {
  try {
    const { lead_id } = await params
    const body: ICrmLeadUpdateData = await request.json()

    if (!lead_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Lead ID is required'
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

    const result = await databaseService.update<ICrmLead>(
      'crm_leads',
      lead_id,
      updateData,
      'lead_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to update lead'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[lead_id] - Soft delete a specific lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lead_id: string }> }
) {
  try {
    const { lead_id } = await params
    const { searchParams } = new URL(request.url)
    const deletedBy = searchParams.get('deleted_by') || 'system'

    if (!lead_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Lead ID is required'
        },
        { status: 400 }
      )

    }

    const result = await databaseService.softDelete(
      'crm_leads',
      lead_id,
      deletedBy,
      'lead_id'
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to delete lead'
      },
      { status: 500 }
    )
  }
}


