import { useNavigate, useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { useWorkoutPlan, useDeleteWorkoutPlan } from '@/hooks/useWorkoutPlans'
import { useExercises } from '@/hooks/useExercises'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Play, 
  Loader2, 
  Target, 
  Repeat, 
  Weight 
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PlanDetailPage() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const id = Number(planId)
  const { data: plan, isLoading: loadingPlan } = useWorkoutPlan(id)
  const { data: exercises } = useExercises()
  const deleteMutation = useDeleteWorkoutPlan()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Plan deleted')
      navigate('/plans')
    } catch {
      // Handled
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

  const isOwner = plan.creator_id === user?.id
  const canEdit = isOwner || user?.role === 'admin'

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 -ml-2 text-muted-foreground"
              onClick={() => navigate('/plans')}
            >
              <ChevronLeft className="size-4" data-icon />
              Back to Plans
            </Button>
            
            <div className="flex items-center gap-2">
              {canEdit && (
                <>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link to={`/plans/${id}/edit`}>
                      <Edit className="size-4" data-icon />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="size-4" data-icon />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Workout Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete "{plan.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{plan.name}</h1>
              <Badge variant={plan.is_template ? "secondary" : "outline"} className="h-6">
                {plan.is_template ? "Template" : "Personal"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {plan.exercises.length} Exercises • Detailed routine breakdown
            </p>
          </div>

          <Button className="w-full gap-2 py-6 text-lg" size="lg" asChild>
            <Link to={`/workouts/new?planId=${plan.id}`}>
              <Play className="size-5" data-icon />
              Start Workout with this Plan
            </Link>
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Exercise Sequence</h2>
          <div className="flex flex-col gap-4">
            {plan.exercises.sort((a, b) => a.order_index - b.order_index).map((slot) => {
              const exercise = exercises?.find(e => e.id === slot.exercise_id)
              return (
                <Card key={slot.id} className="relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary/20" />
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {slot.order_index}
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="text-lg font-bold">{exercise?.name || 'Unknown Exercise'}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                        {exercise?.muscle_group || 'General'}
                      </p>
                    </div>

                    <div className="flex gap-8">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Target className="size-4" />
                          <span className="text-xs font-medium uppercase">Sets</span>
                        </div>
                        <span className="text-xl font-bold">{slot.target_sets}</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Repeat className="size-4" />
                          <span className="text-xs font-medium uppercase">Reps</span>
                        </div>
                        <span className="text-xl font-bold">{slot.target_reps}</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Weight className="size-4" />
                          <span className="text-xs font-medium uppercase">Weight</span>
                        </div>
                        <span className="text-xl font-bold">
                          {slot.target_weight ? `${slot.target_weight}kg` : '—'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
