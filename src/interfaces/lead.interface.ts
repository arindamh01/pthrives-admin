// CRM Lead interfaces based on the database schema
export interface ICrmLead {
  id: string
  lead_id: string
  old_lead_id?: string
  full_name: string
  email: string
  phone?: string
  source?: string
  campaign?: string
  course_id?: string
  page_url?: string
  stage: string
  status_id: string
  created_by: string
  created_at: string
  updated_by?: string
  updated_at?: string
  deleted_by?: string
  deleted_at?: string
}

export interface ICrmLeadCreateData {
  lead_id: string
  old_lead_id?: string
  full_name: string
  email: string
  phone?: string
  source?: string
  campaign?: string
  course_id?: string
  page_url?: string
  stage?: string
  status_id: string
  created_by?: string
}

export interface ICrmLeadUpdateData extends Partial<ICrmLeadCreateData> {
  lead_id: string
  updated_by?: string
}
export interface ICrmLeadFilters {
  stage?: string
  status_id?: string
  source?: string
  course_id?: string
  search?: string
  created_from?: string
  created_to?: string
}

export interface ICrmLeadPagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

// Lead Followup interfaces
export interface ICrmLeadFollowup {
  id: string
  followup_id: string
  lead_id: string
  followup_date: string
  mode?: string
  deal_value?: number
  notes?: string
  next_followup_date?: string
  expected_closing_date?: string
  probability_percentage?: number
  stage: string
  status_id: string
  created_by: string
  created_at: string
  updated_by?: string
  updated_at?: string
  deleted_by?: string
  deleted_at?: string
}

export interface ICrmLeadFollowupCreateData {
  followup_id: string
  lead_id: string
  followup_date: string
  mode?: string
  deal_value?: number
  notes?: string
  next_followup_date?: string
  expected_closing_date?: string
  probability_percentage?: number
  stage?: string
  status_id: string
  created_by?: string
}
// Lead Assignment interfaces
export interface ICrmLeadAssignment {
  id: string
  assignment_id: string
  lead_id: string
  user_id: string
  assigned_date: string
}

export interface ICrmLeadAssignmentCreateData {
  assignment_id: string
  lead_id: string
  user_id: string
}



