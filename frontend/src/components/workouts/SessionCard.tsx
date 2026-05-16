import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Dumbbell } from 'lucide-react'
import type { WorkoutSession } from '@/schemas'

interface SessionCardProps {
  session: WorkoutSession
}

export function SessionCard({ session }: SessionCardProps) {
  const strengthSets = session.sets.filter((s) => s.type === 'strength').length
  const cardioSets = session.sets.filter((s) => s.type === 'cardio').length

  const formattedDate = new Date(session.date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          {session.plan_id ? (
            <Badge variant="secondary">Plan Workout</Badge>
          ) : (
            <Badge variant="outline">Freestyle</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Dumbbell className="size-4" />
            <span>{session.sets.length} Total Sets</span>
          </div>
          {(strengthSets > 0 || cardioSets > 0) && (
            <div className="text-xs">
              ({strengthSets > 0 && `${strengthSets} Strength`}
              {strengthSets > 0 && cardioSets > 0 && ' • '}
              {cardioSets > 0 && `${cardioSets} Cardio`})
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
