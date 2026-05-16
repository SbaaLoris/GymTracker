import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid } from "lucide-react"
import { Link } from "react-router-dom"
import { useWorkoutPlans } from "@/hooks/useWorkoutPlans"
import { PlanCard } from "@/components/plans/PlanCard"

export default function AdminTemplatesPage() {
  const { data: templates, isLoading } = useWorkoutPlans(true)

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="System Templates"
          description="Manage public workout templates available to all users."
          actions={
            <Button asChild className="gap-2">
              <Link to="/plans/new?template=true">
                <Plus className="size-4" data-icon />
                Create Template
              </Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[200px] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : templates?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <LayoutGrid className="size-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No templates yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Create the first global template to help users get started with their fitness journey.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/plans/new?template=true">Create Template</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates?.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
