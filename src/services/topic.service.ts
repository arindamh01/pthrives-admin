import { databaseService } from './database.service'
import { ITopic, ITopicCreateData, ITopicUpdateData, IMasterPagination, IMasterFilters } from '@/interfaces/master.interface'

interface ApiResponse<T> {
  data: T | null
  message: string
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: IMasterPagination
  message: string
  success: boolean
}

class TopicService {
  /**
   * Get all topics from database with pagination and filters
   */
  async getTopics(params: {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ITopic>> {
    const {
      page = 1,
      per_page = 10,
      search = '',
      sort_by = 'topic_name',
      sort_order = 'asc'
    } = params

    const filters: IMasterFilters = {}
    if (search) filters.search = search

    const result = await databaseService.getPaginated<ITopic>(
      'mst_topics',
      page,
      per_page,
      '*',
      filters,
      { column: sort_by, ascending: sort_order === 'asc' },
      'topic_name',
      search
    )

    return {
      data: result.data || [],
      pagination: result.pagination,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get a specific topic by topic_id from database
   */
  async getTopic(topicId: string): Promise<ApiResponse<ITopic>> {
    const result = await databaseService.getById<ITopic>(
      'mst_topics',
      topicId,
      'topic_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a new topic in database
   */
  async createTopic(data: ITopicCreateData): Promise<ApiResponse<ITopic>> {
    const result = await databaseService.create<ITopic>('mst_topics', data)

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Update a topic in database
   */
  async updateTopic(topicId: string, data: ITopicUpdateData): Promise<ApiResponse<ITopic>> {
    const result = await databaseService.update<ITopic>(
      'mst_topics',
      topicId,
      data,
      'topic_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Delete a topic from database
   */
  async deleteTopic(topicId: string): Promise<ApiResponse<null>> {
    const result = await databaseService.hardDelete(
      'mst_topics',
      topicId,
      'topic_id'
    )

    return {
      data: null,
      message: result.message,
      success: result.success
    }
  }
}

const topicService = new TopicService()
export default topicService

