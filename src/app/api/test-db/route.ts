import { NextRequest, NextResponse } from 'next/server'
import { supabase, DB_SCHEMA, hasServiceRoleKey } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/test-db - Test database connection
export async function GET(_request: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
    console.log('Service Key:', hasServiceRoleKey ? 'Set' : 'Not set (using anon key)')
    console.log('Schema:', DB_SCHEMA)

    // Test 1: Check if we can connect to Supabase by testing our schema
    // Use anon client first to avoid service role key issues
    const { error: connectionError } = await supabase
      .from('crm_leads')
      .select('id')
      .limit(1)

    if (connectionError) {
      console.error('Connection test failed:', connectionError)
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: connectionError.message,
        environment: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: hasServiceRoleKey,
          schema: DB_SCHEMA
        },
        connection: {
          connected: false,
          error: connectionError.message
        },
        schema: {
          exists: false,
          error: connectionError.message
        },
        tables: {
          crm_leads: false,
          gbl_courses: false,
          mst_status: false,
          errors: { general: connectionError.message }
        },
        sampleData: {
          leads: 0,
          courses: 0,
          statuses: 0,
          error: connectionError.message
        }
      }, { status: 500 })
    }

    // Test 2: Check if our schema exists by testing a table query
    const { error: schemaError } = await supabase
      .from('gbl_courses')
      .select('id')
      .limit(1)

    if (schemaError) {
      console.error('Schema test failed:', schemaError)
      return NextResponse.json({
        success: false,
        message: 'Schema test failed',
        environment: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: hasServiceRoleKey,
          schema: DB_SCHEMA
        },
        connection: {
          connected: true,
          error: null
        },
        schema: {
          exists: false,
          error: schemaError.message
        },
        tables: {
          crm_leads: false,
          gbl_courses: false,
          mst_status: false,
          errors: { general: schemaError.message }
        },
        sampleData: {
          leads: 0,
          courses: 0,
          statuses: 0,
          error: schemaError.message
        }
      }, { status: 500 })
    }

    // Test 3: Check if our main tables exist by testing each one
    const tablesToTest = ['crm_leads', 'gbl_courses', 'mst_status']
    const tableResults: Record<string, boolean> = {}
    const tableErrors: Record<string, string> = {}

    for (const table of tablesToTest) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        tableResults[table] = !error
        if (error) {
          tableErrors[table] = error.message
        }
      } catch (err) {
        tableResults[table] = false
        tableErrors[table] = err instanceof Error ? err.message : 'Unknown error'
      }
    }

    const allTablesExist = Object.values(tableResults).every(exists => exists)

    // Test 4: Get sample data counts
    let leadsCount = 0
    let coursesCount = 0
    let statusesCount = 0
    let sampleError = null

    try {
      if (tableResults.crm_leads) {
        const { count } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true })
        leadsCount = count || 0
      }

      if (tableResults.gbl_courses) {
        const { count } = await supabase
          .from('gbl_courses')
          .select('*', { count: 'exact', head: true })
        coursesCount = count || 0
      }

      if (tableResults.mst_status) {
        const { count } = await supabase
          .from('mst_status')
          .select('*', { count: 'exact', head: true })
        statusesCount = count || 0
      }
    } catch (err) {
      sampleError = err instanceof Error ? err.message : 'Unknown error'
    }

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist ? 'Database connection successful!' : 'Some tables are missing',
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: hasServiceRoleKey,
        schema: DB_SCHEMA
      },
      connection: {
        connected: true,
        error: null
      },
      schema: {
        exists: true,
        error: null
      },
      tables: {
        crm_leads: tableResults.crm_leads,
        gbl_courses: tableResults.gbl_courses,
        mst_status: tableResults.mst_status,
        errors: Object.keys(tableErrors).length > 0 ? tableErrors : undefined
      },
      sampleData: {
        leads: leadsCount,
        courses: coursesCount,
        statuses: statusesCount,
        error: sampleError
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: hasServiceRoleKey,
        schema: DB_SCHEMA
      },
      connection: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      schema: {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      tables: {
        crm_leads: false,
        gbl_courses: false,
        mst_status: false,
        errors: { general: error instanceof Error ? error.message : 'Unknown error' }
      },
      sampleData: {
        leads: 0,
        courses: 0,
        statuses: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}
