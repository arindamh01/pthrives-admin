import AdminLayout from '@/components/admin/AdminLayout'
import SystemStatus from '@/components/admin/SystemStatus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to PThrives Admin</h1>
          <p className="text-gray-600">Manage your leads, courses, and grow your business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-teal-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">0</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">0%</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Followups</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">0</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/leads"
                  className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg group-hover:from-teal-600 group-hover:to-green-600 transition-colors">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-teal-700">Manage Leads</p>
                    <p className="text-sm text-gray-600">View and manage CRM leads</p>
                  </div>
                </a>
                <a
                  href="/admin/courses"
                  className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg group-hover:from-green-600 group-hover:to-teal-600 transition-colors">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-teal-700">Manage Courses</p>
                    <p className="text-sm text-gray-600">View and manage courses</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <SystemStatus />
        </div>
      </div>
    </AdminLayout>
  )
}
