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
import { MoreVerticalIcon, EditIcon, TrashIcon } from "lucide-react"

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
    <Card className={!exercise.is_active ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-base font-semibold leading-none tracking-tight">
            {exercise.name}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{exercise.muscle_group}</Badge>
            {exercise.is_cardio && <Badge variant="outline">Cardio</Badge>}
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
