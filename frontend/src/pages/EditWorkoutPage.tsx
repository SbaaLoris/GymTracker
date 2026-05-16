import { AppLayout } from "@/components/layout/AppLayout"
import { useParams, useNavigate } from "react-router-dom"
import { useWorkoutSession, useUpdateWorkoutSession } from "@/hooks/useWorkoutSessions"
import { useExercises } from "@/hooks/useExercises"
import { WorkoutSessionForm } from "@/components/workouts/WorkoutSessionForm"
import type { WorkoutSessionCreate } from "@/schemas"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function EditWorkoutPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  
  const { data: session, isLoading: isLoadingSession, isError } = useWorkoutSession(Number(sessionId))
  const { data: exercises, isLoading: isLoadingExercises } = useExercises()
  const { mutate: updateSession, isPending } = useUpdateWorkoutSession()

  // Wait for resources
  if (isLoadingExercises || isLoadingSession) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    )
  }

  if (isError || !session || !exercises) {
    return (
      <AppLayout>
        <div className="text-center p-12 text-destructive">
          Failed to load session details.
        </div>
      </AppLayout>
    )
  }

  // Pre-fill defaults
  const defaultValues: Partial<WorkoutSessionCreate> = {
    date: session.date,
    plan_id: session.plan_id,
    sets: session.sets.map(s => {
      if (s.type === 'strength') {
        return {
          type: 'strength',
          exercise_id: s.exercise_id,
          reps: s.reps,
          weight: s.weight,
        }
      } else {
        return {
          type: 'cardio',
          exercise_id: s.exercise_id,
          duration: s.duration,
        }
      }
    }),
  }

  const handleSubmit = (data: WorkoutSessionCreate) => {
    updateSession(
      { sessionId: session.id, payload: data },
      {
        onSuccess: () => {
          toast.success("Workout updated successfully")
          navigate(`/workouts/${session.id}`)
        },
        onError: (error) => {
          toast.error(`Failed to update workout: ${error.message}`)
        }
      }
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/workouts/${session.id}`)}>
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Workout</h1>
        </div>
        
        <WorkoutSessionForm
          defaultValues={defaultValues}
          exercises={exercises}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </AppLayout>
  )
}
