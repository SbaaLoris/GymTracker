import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlanEditor } from '@/components/plans/PlanEditor'
import { useCreateWorkoutPlan } from '@/hooks/useWorkoutPlans'
import type { WorkoutPlanCreate } from '@/schemas/workout-plan'
import { useAuth } from '@/auth/AuthContext'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewPlanPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const createMutation = useCreateWorkoutPlan()

  const isTemplateRequest = searchParams.get('template') === 'true'
  const isAdmin = user?.role === 'admin'

  const handleSubmit = async (data: WorkoutPlanCreate) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Workout plan created successfully')
      navigate('/plans')
    } catch {
      // Error is handled by apiFetch or mutation
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit gap-2 -ml-2 text-muted-foreground"
            onClick={() => navigate('/plans')}
          >
            <ChevronLeft className="size-4" data-icon />
            Back to Plans
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isTemplateRequest && isAdmin ? 'Create Template' : 'Create New Plan'}
          </h1>
          <p className="text-muted-foreground">
            Define your workout routine by adding exercise slots.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <PlanEditor 
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create Plan"
            isAdmin={isAdmin}
            initialData={{ is_template: isTemplateRequest && isAdmin }}
          />
        </div>
      </div>
    </AppLayout>
  )
}
