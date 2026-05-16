import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { ExerciseList } from "@/components/exercises/ExerciseList"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function AdminExercisesPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Exercise Catalogue"
          description="Maintain the global list of strength and cardio exercises."
          actions={
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <PlusIcon data-icon="inline-start" /> Add Exercise
            </Button>
          }
        />

        {/* Reuses the admin-aware list */}
        <ExerciseList />

        {/* Dialog for creating a new exercise */}
        <ExerciseFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
      </div>
    </AppLayout>
  )
}

