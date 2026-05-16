import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlanEditor } from '@/components/plans/PlanEditor'
import { useWorkoutPlan, useUpdateWorkoutPlan } from '@/hooks/useWorkoutPlans'
import type { WorkoutPlanCreate } from '@/schemas/workout-plan'
import { useAuth } from '@/auth/AuthContext'
import { toast } from 'sonner'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EditPlanPage() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const id = Number(planId)
  const { data: plan, isLoading: loadingPlan } = useWorkoutPlan(id)
  const updateMutation = useUpdateWorkoutPlan()

  const isAdmin = user?.role === 'admin'

  const handleSubmit = async (data: WorkoutPlanCreate) => {
    try {
      await updateMutation.mutateAsync({ id, payload: data })
      toast.success('Workout plan updated successfully')
      navigate(`/plans/${id}`)
    } catch {
      // Error is handled
    }
  }

  if (loadingPlan) {
    return (
      <AppLayout>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  if (!plan) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <h3 className="text-lg font-semibold">Plan not found</h3>
          <Button onClick={() => navigate('/plans')}>Back to Plans</Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit gap-2 -ml-2 text-muted-foreground"
            onClick={() => navigate(`/plans/${id}`)}
          >
            <ChevronLeft className="size-4" data-icon />
            Back to Details
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
          <p className="text-muted-foreground">
            Modify the details and exercises of your workout routine.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <PlanEditor 
            initialData={plan}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            submitLabel="Save Changes"
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </AppLayout>
  )
}
