import type { Exercise } from "@/schemas"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MuscleGroupIcon } from "@/components/shared/MuscleGroupIcon"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

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
  return (
    <div
      className={cn(
        "grid min-h-20 grid-cols-[48px_1fr] items-center gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted/30",
        isAdmin && "grid-cols-[48px_1fr_auto]",
        !exercise.is_active && "opacity-60"
      )}
    >
      <div className="grid size-12 place-items-center overflow-hidden rounded-lg bg-muted">
        <MuscleGroupIcon muscleGroup={exercise.muscle_group} className="size-11" />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="truncate text-sm font-semibold text-foreground sm:text-[15px]">
          {exercise.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="px-2 uppercase tracking-[0.05em]">
            {exercise.muscle_group}
          </Badge>
          {exercise.is_cardio && exercise.muscle_group !== "Cardio" && (
            <Badge variant="outline" className="gap-1 uppercase tracking-[0.05em]">
              <HeartPulseIcon className="size-3" />
              Cardio
            </Badge>
          )}
          {!exercise.is_active && (
            <Badge variant="destructive" className="uppercase tracking-[0.05em]">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
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
      </div>
    </div>
  )
}
