import { databaseService } from './database.service'
import { 
  ICrmLead, 
  ICrmLeadCreateData, 
  ICrmLeadUpdateData, 
  ICrmLeadFilters,
  ICrmLeadPagination,
  ICrmLeadFollowup,
  ICrmLeadFollowupCreateData,
  ICrmLeadAssignment,
  ICrmLeadAssignmentCreateData
} from '@/interfaces/lead.interface'

interface ApiResponse<T> {
  data: T | null
  message: string
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: ICrmLeadPagination
  message: string
  success: boolean
}

export class LeadService {
  /**
   * Get all leads with pagination and filters
   */
  async getLeads(params: {
    page?: number
    per_page?: number
    search?: string
    stage?: string
    status_id?: string
    source?: string
    course_id?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<PaginatedResponse<ICrmLead>> {
    const {
      page = 1,
      per_page = 10,
      search = '',
      stage,
      status_id,
      source,
      course_id,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params

    const filters: ICrmLeadFilters = {}
    if (stage) filters.stage = stage
    if (status_id) filters.status_id = status_id
    if (source) filters.source = source
    if (course_id) filters.course_id = course_id
    if (search) filters.search = search

    const result = await databaseService.getPaginated<ICrmLead>(
      'crm_leads',
      page,
      per_page,
      '*',
      filters,
      { column: sort_by, ascending: sort_order === 'asc' },
      'full_name',
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
   * Get a specific lead by lead_id
   */
  async getLead(leadId: string): Promise<ApiResponse<ICrmLead>> {
    const result = await databaseService.getById<ICrmLead>(
      'crm_leads',
      leadId,
      'lead_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a new lead
   */
  async createLead(data: ICrmLeadCreateData): Promise<ApiResponse<ICrmLead>> {
    const leadData = {
      ...data,
      stage: data.stage || 'New',
      created_by: data.created_by || 'Admin',
      created_at: new Date().toISOString()
    }

    const result = await databaseService.create<ICrmLead>('crm_leads', leadData)

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Update a lead
   */
  async updateLead(leadId: string, data: ICrmLeadUpdateData): Promise<ApiResponse<ICrmLead>> {
    const updateData = {
      ...data,
      updated_by: data.updated_by || 'Admin',
      updated_at: new Date().toISOString()
    }

    const result = await databaseService.update<ICrmLead>(
      'crm_leads',
      leadId,
      updateData,
      'lead_id'
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Soft delete a lead
   */
  async deleteLead(leadId: string, deletedBy: string = 'Admin'): Promise<ApiResponse<null>> {
    const result = await databaseService.softDelete(
      'crm_leads',
      leadId,
      deletedBy,
      'lead_id'
    )

    return {
      data: null,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get lead followups
   */
  async getLeadFollowups(
    leadId: string,
    params: {
      page?: number
      perPage?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    } = {}
  ): Promise<PaginatedResponse<ICrmLeadFollowup>> {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'followup_date',
      sortOrder = 'desc'
    } = params

    const result = await databaseService.getPaginated<ICrmLeadFollowup>(
      'crm_lead_followups',
      page,
      perPage,
      '*',
      { lead_id: leadId },
      { column: sortBy, ascending: sortOrder === 'asc' }
    )

    return {
      data: result.data,
      pagination: result.pagination,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a lead followup
   */
  async createLeadFollowup(data: ICrmLeadFollowupCreateData): Promise<ApiResponse<ICrmLeadFollowup>> {
    const followupData = {
      ...data,
      stage: data.stage || 'New',
      created_by: data.created_by || 'system'
    }

    const result = await databaseService.create<ICrmLeadFollowup>(
      'crm_lead_followups',
      followupData
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get lead assignments
   */
  async getLeadAssignments(leadId: string): Promise<ApiResponse<ICrmLeadAssignment[]>> {
    const result = await databaseService.getAll<ICrmLeadAssignment>(
      'crm_lead_assignments',
      '*',
      { lead_id: leadId },
      { column: 'assigned_date', ascending: false }
    )

    return {
      data: result.data || [],
      message: result.message,
      success: result.success
    }
  }

  /**
   * Create a lead assignment
   */
  async createLeadAssignment(data: ICrmLeadAssignmentCreateData): Promise<ApiResponse<ICrmLeadAssignment>> {
    const result = await databaseService.create<ICrmLeadAssignment>(
      'crm_lead_assignments',
      data
    )

    return {
      data: result.data,
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get leads by stage
   */
  async getLeadsByStage(stage: string): Promise<ApiResponse<ICrmLead[]>> {
    const result = await databaseService.getAll<ICrmLead>(
      'crm_leads',
      '*',
      { stage },
      { column: 'created_at', ascending: false }
    )

    return {
      data: result.data || [],
      message: result.message,
      success: result.success
    }
  }

  /**
   * Get leads by source
   */
  async getLeadsBySource(source: string): Promise<ApiResponse<ICrmLead[]>> {
    const result = await databaseService.getAll<ICrmLead>(
      'crm_leads',
      '*',
      { source },
      { column: 'created_at', ascending: false }
    )

    return {
      data: result.data || [],
      message: result.message,
      success: result.success
    }
  }
}

export const leadService = new LeadService()

