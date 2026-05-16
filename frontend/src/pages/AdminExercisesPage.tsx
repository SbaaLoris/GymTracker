import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { ExerciseList } from "@/components/exercises/ExerciseList"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function AdminExercisesPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercise Catalogue</h1>
            <p className="text-muted-foreground mt-1">
              Maintain the global list of strength and cardio exercises.
            </p>
          </div>
          <div>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" /> Add Exercise
            </Button>
          </div>
        </div>

        {/* Reuses the admin-aware list */}
        <ExerciseList />

        {/* Dialog for creating a new exercise */}
        <ExerciseFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
      </div>
    </AppLayout>
  )
}

