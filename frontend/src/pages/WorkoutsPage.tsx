import { AppLayout } from "@/components/layout/AppLayout"
import { useWorkoutSessions } from "@/hooks/useWorkoutSessions"
import { SessionCard } from "@/components/workouts/SessionCard"
import { Button } from "@/components/ui/button"
import { Plus, Dumbbell } from "lucide-react"
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"

export default function WorkoutsPage() {
  const { data: sessions, isLoading, isError } = useWorkoutSessions()

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <Button asChild>
            <Link to="/workouts/new">
              <Plus data-icon="inline-start" />
              Log Workout
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError ? (
          <div className="text-destructive">Failed to load workout sessions.</div>
        ) : !sessions?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Dumbbell className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No workouts logged yet</h3>
              <p className="text-muted-foreground">Log your first freestyle workout or start from a plan.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline">
                <Link to="/workouts/new">Log Freestyle Workout</Link>
              </Button>
              <Button asChild>
                <Link to="/plans">Start from a Plan</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => (
              <Link key={session.id} to={`/workouts/${session.id}`}>
                <SessionCard session={session} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

