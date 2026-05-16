import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { AdminRequestsTable } from "@/components/admin/AdminRequestsTable"

export default function AdminRequestsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Community Request Queue"
          description="Review custom exercises submitted by the GymTracker athlete community. Approving an exercise automatically registers it globally."
        />

        <AdminRequestsTable />
      </div>
    </AppLayout>
  )
}

