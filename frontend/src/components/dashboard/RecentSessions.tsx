import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Dumbbell, Calendar, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkoutSession, Exercise } from "@/schemas"

interface RecentSessionsProps {
  sessions: WorkoutSession[]
  exercises: Exercise[]
}

export function RecentSessions({ sessions, exercises }: RecentSessionsProps) {
  // Take up to 5 most recent sessions
  const recentSessions = React.useMemo(() => {
    return [...sessions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  }, [sessions])

  const getExerciseName = (exerciseId: number) => {
    const match = exercises.find((e) => e.id === exerciseId)
    return match ? match.name : `Exercise #${exerciseId}`
  }

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="mova-card flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Recent Workouts</CardTitle>
          <CardDescription>Your last 5 training sessions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/workouts">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Dumbbell className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">No workouts logged yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              Start logging your workouts to track your training history and view stats.
            </p>
            <Button asChild>
              <Link to="/workouts/new">Log Your First Workout</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => {
              const uniqueExerciseIds = Array.from(
                new Set(session.sets.map((s) => s.exercise_id))
              )
              const strengthSetsCount = session.sets.filter(
                (s) => s.type === "strength"
              ).length
              const cardioSetsCount = session.sets.filter(
                (s) => s.type === "cardio"
              ).length

              return (
                <div
                  key={session.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-card hover:bg-accent/40 transition-colors"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground max-w-md">
                      {uniqueExerciseIds.length === 0 ? (
                        <span>No exercises recorded</span>
                      ) : (
                        uniqueExerciseIds.map((id, index) => (
                          <span key={id}>
                            {getExerciseName(id)}
                            {index < uniqueExerciseIds.length - 1 ? ", " : ""}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-2">
                      {strengthSetsCount > 0 && (
                        <Badge variant="secondary" className="gap-1 px-2 py-0.5">
                          <Dumbbell className="h-3 w-3" />
                          {strengthSetsCount} Strength
                        </Badge>
                      )}
                      {cardioSetsCount > 0 && (
                        <Badge variant="outline" className="gap-1 px-2 py-0.5">
                          <Activity className="h-3 w-3" />
                          {cardioSetsCount} Cardio
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="rounded-full opacity-70 group-hover:opacity-100 group-hover:bg-accent/80 transition-all"
                    >
                      <Link to={`/workouts/${session.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
