import type { Exercise } from "@/schemas"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  MoreVerticalIcon, 
  EditIcon, 
  TrashIcon,
  HeartPulseIcon,
  CircleDotIcon,
  LayersIcon,
  FootprintsIcon,
  ArrowUpToLineIcon,
  TargetIcon,
  ZapIcon,
  ActivityIcon
} from "lucide-react"

const MUSCLE_GROUP_ICONS: Record<string, React.ElementType> = {
  Chest: CircleDotIcon,
  Back: LayersIcon,
  Legs: FootprintsIcon,
  Shoulders: ArrowUpToLineIcon,
  Arms: ActivityIcon,
  Core: TargetIcon,
  Cardio: HeartPulseIcon,
}

interface ExerciseCardProps {
  exercise: Exercise
  isAdmin?: boolean
  onEdit?: (exercise: Exercise) => void
  onDelete?: (exercise: Exercise) => void
}

export function ExerciseCard({
  exercise,
  isAdmin,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
    const Icon = MUSCLE_GROUP_ICONS[exercise.muscle_group] || ZapIcon

    return (
      <Card className={!exercise.is_active ? "opacity-60" : ""}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-base font-semibold leading-none tracking-tight">
              {exercise.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Icon className="size-3" />
                {exercise.muscle_group}
              </Badge>
              {exercise.is_cardio && exercise.muscle_group !== 'Cardio' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <HeartPulseIcon className="size-3" />
                  Cardio
                </Badge>
              )}
              {!exercise.is_active && <Badge variant="destructive">Inactive</Badge>}
            </div>
          </div>
        
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-8">
                <MoreVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(exercise)}>
                <EditIcon data-icon="inline-start" className="size-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(exercise)}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon data-icon="inline-start" className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {/* Placeholder for future details or stats if needed */}
      </CardContent>
    </Card>
  )
}
