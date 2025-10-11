import { NextRequest, NextResponse } from 'next/server'
import topicService from '@/services/topic.service'
import { ITopicCreateData } from '@/interfaces/master.interface'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/masters/topics
 * Get all topics with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const search = searchParams.get('search') || ''
    const sort_by = searchParams.get('sort_by') || 'topic_name'
    const sort_order = (searchParams.get('sort_order') || 'asc') as 'asc' | 'desc'

    const result = await topicService.getTopics({
      page,
      per_page,
      search,
      sort_by,
      sort_order
    })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error fetching topics:', error)
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
        message: 'Failed to fetch topics',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/masters/topics
 * Create a new topic
 */
export async function POST(request: NextRequest) {
  try {
    const body: ITopicCreateData = await request.json()

    // Validate required fields
    if (!body.topic_id || !body.topic_name) {
      return NextResponse.json(
        {
          data: null,
          message: 'topic_id and topic_name are required',
          success: false
        },
        { status: 400 }
      )
    }

    const result = await topicService.createTopic(body)

    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to create topic',
        success: false
      },
      { status: 500 }
    )
  }
}

