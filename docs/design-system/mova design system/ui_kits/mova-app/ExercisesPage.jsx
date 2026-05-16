// ExercisesPage — direct port of frontend/src/pages/ExercisesPage.tsx
// Grid of cards, each with exercise name + outline badge for muscle group.

const SEED_EXERCISES = [
  { id: 1,  name: "Barbell Back Squat",     muscle_group: "Legs"      },
  { id: 2,  name: "Conventional Deadlift",  muscle_group: "Back"      },
  { id: 3,  name: "Bench Press",            muscle_group: "Chest"     },
  { id: 4,  name: "Overhead Press",         muscle_group: "Shoulders" },
  { id: 5,  name: "Pull-Up",                muscle_group: "Back"      },
  { id: 6,  name: "Bulgarian Split Squat",  muscle_group: "Legs"      },
  { id: 7,  name: "Romanian Deadlift",      muscle_group: "Legs"      },
  { id: 8,  name: "Incline Dumbbell Press", muscle_group: "Chest"     },
  { id: 9,  name: "Hammer Curl",            muscle_group: "Arms"      },
  { id: 10, name: "Triceps Pushdown",       muscle_group: "Arms"      },
  { id: 11, name: "Hanging Leg Raise",      muscle_group: "Core"      },
  { id: 12, name: "Treadmill Run",          muscle_group: "Cardio"    },
];

function ExercisesPage({ navigate, auth }) {
  return (
    <AppLayout route="/exercises" navigate={navigate} auth={auth}>
      <PageHeader title="Exercises" description="Discover exercises for your workout." />
      <div className="ex-grid">
        {SEED_EXERCISES.map(ex => (
          <Card key={ex.id} className="ex-card">
            <div className="ex-card__row">
              <h3 className="ex-card__name">{ex.name}</h3>
              <span className="ex-card__id">#{ex.id}</span>
            </div>
            <div>
              <Badge variant="outline" className="badge--tiny">{ex.muscle_group}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

Object.assign(window, { ExercisesPage });
