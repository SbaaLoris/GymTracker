import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useWorkoutPlans } from "@/hooks/useWorkoutPlans"
import { useExercises } from "@/hooks/useExercises"
import { PlanCard } from "@/components/plans/PlanCard"
import * as React from "react"

export default function PlansPage() {
  const { data: myPlans, isLoading: loadingPlans } = useWorkoutPlans(false)
  const { data: templates, isLoading: loadingTemplates } = useWorkoutPlans(true)
  const { data: exercises } = useExercises()

  const exerciseMap = React.useMemo(() => {
    if (!exercises) return {}
    return exercises.reduce((acc, ex) => {
      acc[ex.id] = ex.name
      return acc
    }, {} as Record<number, string>)
  }, [exercises])

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Workout Plans"
          description="Manage your routines or browse community templates."
          actions={
            <Button asChild className="gap-2">
              <Link to="/plans/new">
                <Plus className="size-4" data-icon />
                Create Plan
              </Link>
            </Button>
          }
        />

        <Tabs defaultValue="my-plans" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="my-plans">My Plans</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-plans" className="mt-6">
            {loadingPlans ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[200px] animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : myPlans?.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Plus className="size-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No plans found</h3>
                  <p className="text-muted-foreground">You haven't created any workout plans yet.</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/plans/new">Create your first plan</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myPlans?.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} exerciseMap={exerciseMap} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            {loadingTemplates ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[200px] animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : templates?.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Dumbbell className="size-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No templates available</h3>
                  <p className="text-muted-foreground">Check back later for curated workout templates.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates?.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} exerciseMap={exerciseMap} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

function Dumbbell({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.767a2 2 0 1 1-2.829-2.828l-1.767 1.767a2 2 0 1 1-2.829-2.828l1.767-1.767a2 2 0 1 1 2.829 2.828l1.767-1.767a2 2 0 1 1 2.829 2.828l1.767-1.767a2 2 0 1 1 2.829 2.828l-1.767 1.767Z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/>
    </svg>
  )
}
