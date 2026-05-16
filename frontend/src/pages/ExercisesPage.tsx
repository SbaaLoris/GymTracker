import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { ExerciseList } from "@/components/exercises/ExerciseList"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"
import { ExerciseRequestDialog } from "@/components/exercises/ExerciseRequestDialog"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function ExercisesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isRequestOpen, setIsRequestOpen] = React.useState(false)

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Exercises"
          description="Browse the master catalogue of exercises."
          actions={
            isAdmin ? (
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusIcon data-icon="inline-start" /> Add Exercise
              </Button>
            ) : (
              <Button onClick={() => setIsRequestOpen(true)}>
                <PlusIcon data-icon="inline-start" /> Request Exercise
              </Button>
            )
          }
        />

        <ExerciseList />

        {isAdmin && (
          <ExerciseFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
        )}

        {!isAdmin && (
          <ExerciseRequestDialog open={isRequestOpen} onOpenChange={setIsRequestOpen} />
        )}
      </div>
    </AppLayout>
  )
}
