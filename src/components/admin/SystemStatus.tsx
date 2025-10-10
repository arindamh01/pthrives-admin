'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Eye } from 'lucide-react'

interface TestResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'loading'
  message: string
  details?: string
}

interface DatabaseTestResponse {
  success: boolean
  message: string
  results?: TestResult[]
  environment: {
    hasUrl: boolean
    hasAnonKey: boolean
    hasServiceKey: boolean
    schema: string
  }
  connection: {
    connected: boolean
    error?: string
  }
  schema: {
    exists: boolean
    error?: string
  }
  tables: {
    crm_leads: boolean
    gbl_courses: boolean
    mst_status: boolean
    errors?: Record<string, string>
  }
  sampleData: {
    leads: number
    courses: number
    statuses: number
    error?: string
  }
}

export default function SystemStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<DatabaseTestResponse | null>(null)
  const [lastTested, setLastTested] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const runDatabaseTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-db')
      
      if (!response.ok) {
        // Handle HTTP errors (like 500)
        const errorData = await response.json().catch(() => ({}))
        setTestResults({
          success: false,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          environment: {
            hasUrl: false,
            hasAnonKey: false,
            hasServiceKey: false,
            schema: 'pte'
          },
          connection: {
            connected: false,
            error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
          },
          schema: {
            exists: false,
            error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
          },
          tables: {
            crm_leads: false,
            gbl_courses: false,
            mst_status: false,
            errors: { general: errorData.message || `HTTP ${response.status}: ${response.statusText}` }
          },
          sampleData: {
            leads: 0,
            courses: 0,
            statuses: 0,
            error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
          }
        })
        return
      }
      
      const data = await response.json()
      setTestResults(data)
      setLastTested(new Date())
    } catch (error) {
      console.error('Database test error:', error)
      setTestResults({
        success: false,
        message: 'Failed to run database test - Network error or server issue',
        environment: {
          hasUrl: false,
          hasAnonKey: false,
          hasServiceKey: false,
          schema: 'pte'
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
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Connected</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Error</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Warning</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Unknown</Badge>
    }
  }

  const getOverallStatus = () => {
    if (!testResults) return 'unknown'
    if (testResults.success) return 'success'
    if (testResults.connection.connected) return 'warning'
    return 'error'
  }

  // Auto-run on mount for dashboard
  useEffect(() => {
    runDatabaseTest();
    // eslint-disable-next-line
  }, []);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              getOverallStatus() === 'success' ? 'bg-green-500' :
              getOverallStatus() === 'warning' ? 'bg-yellow-500' :
              getOverallStatus() === 'error' ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
            System Status
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runDatabaseTest}
            disabled={isLoading}
            className="h-8"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Database and system health
          {lastTested && (
            <span className="block text-xs text-gray-500 mt-1">
              Last tested: {lastTested.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <span className="text-sm font-medium">Database Connection</span>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-xs text-blue-600">Testing...</span>
              </div>
            ) : (
              getStatusBadge(testResults?.connection.connected ? 'success' : 'error')
            )}
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <span className="text-sm font-medium">Schema Status</span>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-xs text-blue-600">Testing...</span>
              </div>
            ) : (
              getStatusBadge(testResults?.schema.exists ? 'success' : 'error')
            )}
          </div>
        </div>

        {/* Quick Data Overview */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="flex items-center justify-center h-6">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              </div>
              <div className="text-gray-600">Leads</div>
            </div>
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="flex items-center justify-center h-6">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              </div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="flex items-center justify-center h-6">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              </div>
              <div className="text-gray-600">Statuses</div>
            </div>
          </div>
        ) : testResults?.sampleData ? (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="font-semibold text-lg">{testResults.sampleData.leads}</div>
              <div className="text-gray-600">Leads</div>
            </div>
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="font-semibold text-lg">{testResults.sampleData.courses}</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div className="text-center p-2 rounded bg-gray-50">
              <div className="font-semibold text-lg">{testResults.sampleData.statuses}</div>
              <div className="text-gray-600">Statuses</div>
            </div>
          </div>
        ) : null}

        {/* Status Messages */}
        {isLoading ? (
          <Alert className="border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Testing database connection...
            </AlertDescription>
          </Alert>
        ) : testResults && !testResults.success ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              {testResults.message}
            </AlertDescription>
          </Alert>
        ) : testResults && testResults.success ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              Database connection successful! All systems are operational.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* View Details Button */}
        <div className="pt-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full" disabled={isLoading}>
                <Eye className="h-4 w-4 mr-2" />
                {isLoading ? 'Testing...' : 'View Details'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>System Status Details</DialogTitle>
                <DialogDescription>
                  Comprehensive database and system health information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Environment Variables */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Environment Variables</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">Supabase URL</span>
                      {getStatusIcon(testResults?.environment.hasUrl ? 'success' : 'error')}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">Anon Key</span>
                      {getStatusIcon(testResults?.environment.hasAnonKey ? 'success' : 'error')}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">Service Key</span>
                      {getStatusIcon(testResults?.environment.hasServiceKey ? 'success' : 'warning')}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">Schema</span>
                      <span className="text-gray-600 font-mono">{testResults?.environment.schema || 'pte'}</span>
                    </div>
                  </div>
                </div>

                {/* Database Tables */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Database Tables</h4>
                  <div className="space-y-2">
                    {testResults?.tables && Object.entries(testResults.tables).map(([table, exists]) => {
                      if (typeof exists === 'boolean') {
                        return (
                          <div key={table} className="flex items-center justify-between p-3 rounded-lg border">
                            <span className="font-mono text-sm">{table}</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(exists ? 'success' : 'error')}
                              <span className="text-sm text-gray-600">
                                {exists ? 'Available' : 'Missing'}
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>

                {/* Detailed Data Counts */}
                {testResults?.sampleData && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">Data Overview</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg border">
                        <div className="font-bold text-2xl text-teal-600">{testResults.sampleData.leads}</div>
                        <div className="text-sm text-gray-600">CRM Leads</div>
                      </div>
                      <div className="text-center p-4 rounded-lg border">
                        <div className="font-bold text-2xl text-green-600">{testResults.sampleData.courses}</div>
                        <div className="text-sm text-gray-600">Courses</div>
                      </div>
                      <div className="text-center p-4 rounded-lg border">
                        <div className="font-bold text-2xl text-blue-600">{testResults.sampleData.statuses}</div>
                        <div className="text-sm text-gray-600">Status Records</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {testResults && !testResults.success && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-red-700">Error Details</h4>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <div className="space-y-2">
                          <div><strong>Message:</strong> {testResults.message}</div>
                          {testResults.connection.error && (
                            <div><strong>Connection Error:</strong> {testResults.connection.error}</div>
                          )}
                          {testResults.schema.error && (
                            <div><strong>Schema Error:</strong> {testResults.schema.error}</div>
                          )}
                          {testResults.tables?.errors && (
                            <div>
                              <strong>Table Errors:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {Object.entries(testResults.tables.errors).map(([table, error]) => (
                                  <li key={table} className="text-sm">{table}: {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
