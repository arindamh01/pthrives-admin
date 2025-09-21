import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StudentsManagement } from '@/components/students/students-management'

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <StudentsManagement />
    </DashboardLayout>
  )
}
