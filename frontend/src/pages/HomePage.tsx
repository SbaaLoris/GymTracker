import { Link } from 'react-router-dom'
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/StatCard"
import { Activity, Dumbbell } from "lucide-react"

function HomePage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Your journey to better fitness starts here."
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard 
          title="Total Workouts"
          value="128"
          trend="+12%"
          trendDirection="up"
          footerPrimary="Trending up this month"
          footerSecondary="Sessions completed in October"
        />
        <StatCard 
          title="Current Weight"
          value="78.4"
          unit="kg"
          trend="-2.4kg"
          trendDirection="down"
          footerPrimary="Down 2.4kg this month"
          footerSecondary="On track for 78 kg goal"
        />
        <StatCard 
          title="Average Intensity"
          value="82"
          unit="%"
          footerPrimary="Consistent performance"
          footerSecondary="Based on RPE of last 5 sessions"
        />
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="text-muted-foreground italic">Get started with your workout or manage your exercises.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/exercises">
              <Dumbbell className="mr-2 h-4 w-4" />
              Manage Exercises
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/exercises">
              <Activity className="mr-2 h-4 w-4" />
              New Session
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

export default HomePage
