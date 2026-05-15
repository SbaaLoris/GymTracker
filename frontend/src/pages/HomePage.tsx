import { Link } from 'react-router-dom'
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"

function HomePage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Mova Gym Tracker" 
        description="Welcome. Your journey to better fitness starts here."
      />
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground italic">First demo page.</p>
        <Button asChild className="w-fit">
          <Link to="/exercises">
            Go to Exercises →
          </Link>
        </Button>
      </div>
    </AppLayout>
  )
}

export default HomePage
