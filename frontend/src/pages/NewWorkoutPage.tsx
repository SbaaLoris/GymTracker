import { AppLayout } from "@/components/layout/AppLayout"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useWorkoutPlan } from "@/hooks/useWorkoutPlans"
import { useExercises } from "@/hooks/useExercises"
import { useCreateWorkoutSession } from "@/hooks/useWorkoutSessions"
import { WorkoutSessionForm } from "@/components/workouts/WorkoutSessionForm"
import type { WorkoutSessionCreate, WorkoutSetInput } from "@/schemas"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function NewWorkoutPage() {
  const [searchParams] = useSearchParams()
  const planId = searchParams.get("planId")
  const navigate = useNavigate()
  
  const { data: plan, isLoading: isLoadingPlan } = useWorkoutPlan(Number(planId))
  const { data: exercises, isLoading: isLoadingExercises } = useExercises()
  const { mutate: createSession, isPending } = useCreateWorkoutSession()

  // Wait for resources
  if (isLoadingExercises || (planId && isLoadingPlan)) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    )
  }

  const today = new Date()
  const localDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  // Pre-fill defaults
  const defaultValues: Partial<WorkoutSessionCreate> = {
    date: localDateStr,
    plan_id: plan ? plan.id : null,
    sets: [],
  }

  if (plan && exercises) {
    const prefilledSets: WorkoutSetInput[] = []
    
    // Sort plan exercises by order_index just to be safe
    const sortedPlanExercises = [...plan.exercises].sort((a, b) => a.order_index - b.order_index)

    sortedPlanExercises.forEach((pe) => {
      const ex = exercises.find((e) => e.id === pe.exercise_id)
      if (!ex) return

      // Create one set per target_sets
      for (let i = 0; i < pe.target_sets; i++) {
        if (ex.is_cardio) {
          prefilledSets.push({
            type: 'cardio',
            exercise_id: ex.id,
            duration: 15, // Default for cardio if no target given
          })
        } else {
          prefilledSets.push({
            type: 'strength',
            exercise_id: ex.id,
            reps: pe.target_reps,
            weight: pe.target_weight || 0,
          })
        }
      }
    })

    defaultValues.sets = prefilledSets
  }

  const handleSubmit = (data: WorkoutSessionCreate) => {
    createSession(data, {
      onSuccess: () => {
        toast.success("Workout logged successfully")
        navigate("/workouts")
      },
      onError: (error) => {
        toast.error(`Failed to log workout: ${error.message}`)
      }
    })
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" className="mt-1" onClick={() => navigate("/workouts")}>
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {plan ? `Log: ${plan.name}` : "Log Freestyle Workout"}
            </h1>
            <p className="text-muted-foreground">
              {plan ? "Record your sets, reps, weights or duration for this plan's exercises." : "Perform exercises on the fly and record your sets."}
            </p>
          </div>
        </div>
        
        {exercises && (
          <WorkoutSessionForm
            defaultValues={defaultValues}
            exercises={exercises}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        )}
      </div>
    </AppLayout>
  )
}
