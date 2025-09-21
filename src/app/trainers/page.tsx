import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TrainersManagement } from '@/components/trainers/trainers-management'

export default function TrainersPage() {
  return (
    <DashboardLayout>
      <TrainersManagement />
    </DashboardLayout>
  )
}
