import { NextRequest, NextResponse } from 'next/server'
import topicService from '@/services/topic.service'
import { ITopicUpdateData } from '@/interfaces/master.interface'

/**
 * GET /api/masters/topics/[topic_id]
 * Get a specific topic by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topic_id: string }> }
) {
  try {
    const { topic_id } = await params;
    const result = await topicService.getTopic(topic_id)

    return NextResponse.json(result, { status: result.success ? 200 : 404 })
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to fetch topic',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/masters/topics/[topic_id]
 * Update a topic
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ topic_id: string }> }
) {
  try {
    const { topic_id } = await params;
    const body: ITopicUpdateData = await request.json()

    const result = await topicService.updateTopic(topic_id, body)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to update topic',
        success: false
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/masters/topics/[topic_id]
 * Delete a topic
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ topic_id: string }> }
) {
  try {
    const { topic_id } = await params;
    const result = await topicService.deleteTopic(topic_id)

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to delete topic',
        success: false
      },
      { status: 500 }
    )
  }
}
