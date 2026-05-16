import * as React from "react"
import { useExercises, useDeleteExercise } from "@/hooks/useExercises"
import type { Exercise } from "@/schemas"
import { MuscleGroupSchema } from "@/schemas"
import { ExerciseCard } from "./ExerciseCard"
import { ExerciseFormDialog } from "./ExerciseFormDialog"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { useAuth } from "@/auth/AuthContext"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchIcon } from "lucide-react"

export function ExerciseList() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  // Filters state
  const [search, setSearch] = React.useState("")
  const [muscleGroup, setMuscleGroup] = React.useState<string>("all")
  const [cardioFilter, setCardioFilter] = React.useState<string>("all")

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const filters = React.useMemo(() => {
    const f: any = {}
    if (debouncedSearch) f.search = debouncedSearch
    if (muscleGroup !== "all") f.muscle_group = muscleGroup
    if (cardioFilter !== "all") f.is_cardio = cardioFilter === "cardio"
    if (isAdmin) f.include_inactive = true // Admins see inactive exercises
    return f
  }, [debouncedSearch, muscleGroup, cardioFilter, isAdmin])

  const { data: exercises, isLoading, error } = useExercises(filters)
  const { mutateAsync: deleteExercise } = useDeleteExercise()

  // Dialogs state
  const [editingExercise, setEditingExercise] = React.useState<Exercise | undefined>()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  
  const [deletingExercise, setDeletingExercise] = React.useState<Exercise | undefined>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (exercise: Exercise) => {
    setDeletingExercise(exercise)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingExercise) return
    try {
      await deleteExercise(deletingExercise.id)
      toast.success("Exercise deleted successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete exercise")
    }
  }



  if (error) {
    return <div className="text-destructive">Failed to load exercises: {(error as Error).message}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={muscleGroup} onValueChange={setMuscleGroup}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Muscle Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscles</SelectItem>
            {MuscleGroupSchema.options.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cardioFilter} onValueChange={setCardioFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
      ) : exercises?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
          <p className="text-muted-foreground">No exercises found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises?.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ExerciseFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        exercise={editingExercise}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Exercise"
        description={`Are you sure you want to delete "${deletingExercise?.name}"? This action may hide it from future use but preserve existing records.`}
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
