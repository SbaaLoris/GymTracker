// HomePage — direct port of frontend/src/pages/HomePage.tsx

function HomePage({ navigate, auth }) {
  return (
    <AppLayout route="/" navigate={navigate} auth={auth}>
      <PageHeader title="Mova Gym Tracker" description="Welcome. Your journey to better fitness starts here." />
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground italic">First demo page.</p>
        <Button asChild className="btn--w-fit">
          <a onClick={() => navigate("/exercises")}>Go to Exercises →</a>
        </Button>
      </div>
    </AppLayout>
  );
}

Object.assign(window, { HomePage });
