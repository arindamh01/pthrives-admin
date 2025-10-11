import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/services/database.service'
import { ICrmLead, ICrmLeadCreateData, ICrmLeadFilters } from '@/interfaces/lead.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/leads - Get all leads with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    
    // Filter parameters
    const filters: ICrmLeadFilters = {
      stage: searchParams.get('stage') || undefined,
      status_id: searchParams.get('status_id') || undefined,
      source: searchParams.get('source') || undefined,
      course_id: searchParams.get('course_id') || undefined,
      search: searchParams.get('search') || undefined,
      created_from: searchParams.get('created_from') || undefined,
      created_to: searchParams.get('created_to') || undefined
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof ICrmLeadFilters] === undefined) {
        delete filters[key as keyof ICrmLeadFilters]
      }
    })

    // Ordering parameters
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') === 'asc'

    // Build the query
    const query = databaseService.getPaginated<ICrmLead>(
      'crm_leads',
      page,
      perPage,
      '*',
      filters,
      { column: sortBy, ascending: sortOrder },
      'full_name', // Search column
      filters.search
    )

    // If date range filters are provided, we need to handle them separately
    if (filters.created_from || filters.created_to) {
      // For date range filtering, we'll need to use a more complex query
      // This is a simplified version - you might want to implement date range filtering
      // in the database service or use raw SQL
    }

    const result = await query

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching leads:', error)
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
        message: 'Failed to fetch leads'
      },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body: ICrmLeadCreateData = await request.json()

    // Validate required fields
    if (!body.lead_id || !body.full_name || !body.email || !body.status_id) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          success: false,
          message: 'Missing required fields: lead_id, full_name, email, status_id'
        },
        { status: 400 }
      )
    }

    // Set default values
    const leadData: ICrmLeadCreateData = {
      ...body,
      stage: body.stage || 'New',
      created_by: body.created_by || 'system'
    }

    const result = await databaseService.create<ICrmLead>('crm_leads', leadData)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      {
        data: null,
        error: null,
        success: false,
        message: 'Failed to create lead'
      },
      { status: 500 }
    )
  }
}

