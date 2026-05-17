import { AppLayout } from "@/components/layout/AppLayout"
import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useWorkoutSession, useDeleteWorkoutSession } from "@/hooks/useWorkoutSessions"
import { useExercises } from "@/hooks/useExercises"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Dumbbell, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MuscleGroupBadge } from "@/components/shared/MuscleGroupIcon"

export default function WorkoutDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  
  const { data: session, isLoading: isLoadingSession, isError } = useWorkoutSession(Number(sessionId))
  const { data: exercises, isLoading: isLoadingExercises } = useExercises()
  const { mutate: deleteSession } = useDeleteWorkoutSession()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const handleDelete = () => {
    deleteSession(session.id, {
      onSuccess: () => {
        toast.success("Workout deleted successfully")
        navigate("/workouts")
      },
      onError: (error) => {
        toast.error(`Failed to delete workout: ${error.message}`)
      }
    })
  }

  const formattedDate = new Date(session.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/workouts")}>
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Workout Details</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/workouts/${session.id}/edit`}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
              <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Workout"
                description="Are you sure you want to delete this workout? This action cannot be undone."
                onConfirm={handleDelete}
                variant="destructive"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-muted-foreground border-b pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <span className="font-medium text-foreground">{formattedDate}</span>
          </div>
          <div className="hidden sm:block text-border">•</div>
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5" />
            <span>{session.sets.length} Sets Total</span>
          </div>
          <div className="hidden sm:block text-border">•</div>
          <div>
            {session.plan_id ? (
              <Badge variant="secondary">Plan-Based</Badge>
            ) : (
              <Badge variant="outline">Freestyle</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Sets Completed</h2>
          
          {session.sets.length === 0 ? (
            <p className="text-muted-foreground italic">No sets logged.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {session.sets.map((set, index) => {
                const exercise = exercises.find(e => e.id === set.exercise_id)
                
                return (
                  <Card key={set.id || index}>
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{exercise?.name || 'Unknown Exercise'}</p>
                          {exercise?.muscle_group ? (
                            <MuscleGroupBadge muscleGroup={exercise.muscle_group} className="mt-1" />
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {set.type === 'strength' ? (
                          <>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Reps</p>
                              <p className="font-semibold text-lg">{set.reps}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Weight</p>
                              <p className="font-semibold text-lg">{set.weight} kg</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-semibold text-lg">{set.duration} min</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
