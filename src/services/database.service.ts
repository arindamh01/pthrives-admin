import { supabaseAdmin } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

export interface DatabaseResponse<T> {
  data: T | null
  error: PostgrestError | null
  success: boolean
  message: string
}

export interface DatabaseResponseArray<T> {
  data: T[] | null
  error: PostgrestError | null
  success: boolean
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number
    to: number
  }
  success: boolean
  message: string
}

export class DatabaseService {
  // Schema is now configured in the Supabase client

  /**
   * Generic method to handle database responses
   */
  private handleResponse<T>(
    data: T | null,
    error: PostgrestError | null,
    successMessage: string,
    errorMessage?: string
  ): DatabaseResponse<T> {
    if (error) {
      console.error('Database error:', error)
      return {
        data: null,
        error,
        success: false,
        message: errorMessage || error.message
      }
    }

    return {
      data,
      error: null,
      success: true,
      message: successMessage
    }
  }

  /**
   * Generic method to handle paginated responses
   */
  private handlePaginatedResponse<T>(
    data: T[],
    error: PostgrestError | null,
    page: number,
    perPage: number,
    successMessage: string,
    errorMessage?: string
  ): PaginatedResponse<T> {
    if (error) {
      console.error('Database error:', error)
      return {
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
        message: errorMessage || error.message
      }
    }

    const total = data.length
    const lastPage = Math.ceil(total / perPage)
    const from = (page - 1) * perPage + 1
    const to = Math.min(page * perPage, total)

    return {
      data,
      pagination: {
        current_page: page,
        per_page: perPage,
        total,
        last_page: lastPage,
        from,
        to
      },
      success: true,
      message: successMessage
    }
  }

  /**
   * Generic method to get all records from a table
   */
  async getAll<T>(
    tableName: string,
    columns: string = '*',
    filters: Record<string, any> = {},
    orderBy?: { column: string; ascending?: boolean }
  ): Promise<DatabaseResponseArray<T>> {
    try {
      let query = supabaseAdmin
        .from(tableName)
        .select(columns)

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }

      const { data, error } = await query

      return {
        data: data as T[] | null,
        error,
        success: !error,
        message: error ? error.message : `${tableName} records fetched successfully`
      }
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        success: false,
        message: `Failed to fetch ${tableName} records`
      }
    }
  }

  /**
   * Generic method to get a single record by ID
   */
  async getById<T>(
    tableName: string,
    id: string,
    idColumn: string = 'id',
    columns: string = '*'
  ): Promise<DatabaseResponse<T>> {
    try {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select(columns)
        .eq(idColumn, id)
        .single()

      return {
        data: data as T | null,
        error,
        success: !error,
        message: error ? error.message : `${tableName} record fetched successfully`
      }
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        success: false,
        message: `Failed to fetch ${tableName} record`
      }
    }
  }

  /**
   * Generic method to create a new record
   */
  async create<T>(
    tableName: string,
    data: Partial<T>
  ): Promise<DatabaseResponse<T>> {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(tableName)
        .insert(data)
        .select()
        .single()

      return {
        data: result as T | null,
        error,
        success: !error,
        message: error ? error.message : `${tableName} record created successfully`
      }
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        success: false,
        message: `Failed to create ${tableName} record`
      }
    }
  }

  /**
   * Generic method to update a record
   */
  async update<T>(
    tableName: string,
    id: string,
    data: Partial<T>,
    idColumn: string = 'id'
  ): Promise<DatabaseResponse<T>> {
    try {
      const { data: result, error } = await supabaseAdmin
        .from(tableName)
        .update(data)
        .eq(idColumn, id)
        .select()
        .single()

      return {
        data: result as T | null,
        error,
        success: !error,
        message: error ? error.message : `${tableName} record updated successfully`
      }
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        success: false,
        message: `Failed to update ${tableName} record`
      }
    }
  }

  /**
   * Generic method to delete a record (soft delete)
   */
  async softDelete(
    tableName: string,
    id: string,
    deletedBy: string,
    idColumn: string = 'id'
  ): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabaseAdmin
        .from(tableName)
        .update({
          deleted_by: deletedBy,
          deleted_at: new Date().toISOString()
        })
        .eq(idColumn, id)

      return {
        data: null,
        error,
        success: !error,
        message: error ? error.message : `${tableName} record deleted successfully`
      }
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        success: false,
        message: `Failed to delete ${tableName} record`
      }
    }
  }

  /**
   * Generic method to hard delete a record
   */
  async hardDelete(
    tableName: string,
    id: string,
    idColumn: string = 'id'
  ): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq(idColumn, id)

      return this.handleResponse(
        null,
        error,
        `${tableName} record deleted successfully`
      )
    } catch (error) {
      return this.handleResponse(
        null,
        error as PostgrestError,
        '',
        `Failed to delete ${tableName} record`
      )
    }
  }

  /**
   * Generic method to get paginated results
   */
  async getPaginated<T>(
    tableName: string,
    page: number = 1,
    perPage: number = 10,
    columns: string = '*',
    filters: Record<string, any> = {},
    orderBy?: { column: string; ascending?: boolean },
    searchColumn?: string,
    searchTerm?: string
  ): Promise<PaginatedResponse<T>> {
    try {
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabaseAdmin
        .from(tableName)
        .select(columns, { count: 'exact', head: false })

      // Apply filters (skip 'search' key as it's handled separately)
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== 'search' && value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })

      // Apply search with proper handling
      if (searchColumn && searchTerm && searchTerm.trim() !== '') {
        query = query.ilike(searchColumn, `%${searchTerm.trim()}%`)
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }

      // Apply pagination
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return this.handlePaginatedResponse(
          [],
          error,
          page,
          perPage,
          '',
          `Failed to fetch ${tableName} records`
        )
      }

      const total = count || 0
      const lastPage = Math.ceil(total / perPage)
      const fromCount = (page - 1) * perPage + 1
      const toCount = Math.min(page * perPage, total)

      return {
        data: (data as T[]) || [],
        pagination: {
          current_page: page,
          per_page: perPage,
          total,
          last_page: lastPage,
          from: fromCount,
          to: toCount
        },
        success: true,
        message: `${tableName} records fetched successfully`
      }
    } catch (error) {
      return this.handlePaginatedResponse(
        [],
        error as PostgrestError,
        page,
        perPage,
        '',
        `Failed to fetch ${tableName} records`
      )
    }
  }
}

export const databaseService = new DatabaseService()
