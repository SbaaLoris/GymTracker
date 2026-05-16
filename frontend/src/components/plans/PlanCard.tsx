import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Dumbbell, Play } from 'lucide-react'
import type { WorkoutPlan } from '@/schemas/workout-plan'

interface PlanCardProps {
  plan: WorkoutPlan
  exerciseMap?: Record<number, string>
}

export function PlanCard({ plan, exerciseMap }: PlanCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <Badge variant={plan.is_template ? "secondary" : "outline"}>
            {plan.is_template ? "Template" : "Personal"}
          </Badge>
        </div>
        <CardDescription>
          {plan.exercises.length} exercise{plan.exercises.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {plan.exercises.slice(0, 3).map((ex, i) => (
            <Badge key={i} variant="secondary" className="bg-muted text-[10px] font-normal">
              {exerciseMap?.[ex.exercise_id] || `Exercise ${ex.exercise_id}`}
            </Badge>
          ))}
          {plan.exercises.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{plan.exercises.length - 3} more</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary-hover hover:bg-primary/5">
          <Link to={`/workouts/new?planId=${plan.id}`}>
            <Play className="size-4" data-icon />
            Start Workout
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground group-hover:text-foreground">
          <Link to={`/plans/${plan.id}`}>
            View Details
            <ChevronRight className="size-4" data-icon />
          </Link>
        </Button>
      </CardFooter>
      <div className="absolute -right-4 -top-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]">
        <Dumbbell className="size-24 rotate-12" />
      </div>
    </Card>
  )
}

