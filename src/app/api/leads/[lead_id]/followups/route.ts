import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'
import { ICrmLeadFollowup, ICrmLeadFollowupCreateData } from '@/interfaces/lead.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/leads/[lead_id]/followups - Get all followups for a specific lead
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lead_id: string }> }
) {
  try {
    const { lead_id } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    const sortBy = searchParams.get('sort_by') || 'followup_date'
    const sortOrder = searchParams.get('sort_order') === 'asc'

    if (!lead_id) {
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
          message: 'Lead ID is required'
        },
        { status: 400 }
      )
    }

    const result = await databaseService.getPaginated<ICrmLeadFollowup>(
      'crm_lead_followups',
      page,
      perPage,
      '*',
      { lead_id },
      { column: sortBy, ascending: sortOrder }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching lead followups:', error)
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
        message: 'Failed to fetch lead followups'
      },
      { status: 500 }
    )
  }
}

// POST /api/leads/[lead_id]/followups - Create a new followup for a lead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lead_id: string }> }
) {
  try {
    const { lead_id } = await params
    const body: Omit<ICrmLeadFollowupCreateData, 'lead_id'> = await request.json()

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

    // Validate required fields
    if (!body.followup_id || !body.followup_date || !body.status_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Missing required fields: followup_id, followup_date, status_id'
        },
        { status: 400 }
      )
    }

    const followupData: ICrmLeadFollowupCreateData = {
      ...body,
      lead_id,
      stage: body.stage || 'New',
      created_by: body.created_by || 'system'
    }

    const result = await databaseService.create<ICrmLeadFollowup>(
      'crm_lead_followups',
      followupData
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating lead followup:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to create lead followup'
      },
      { status: 500 }
    )
  }
}

