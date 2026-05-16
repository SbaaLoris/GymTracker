import { AppLayout } from "@/components/layout/AppLayout"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">This is a placeholder for the Dashboard page.</p>
      </div>
    </AppLayout>
  )
}
