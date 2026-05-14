import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Mova Gym Tracker</h1>
            <p className="mb-4 text-gray-700">Willkommen. Erste Demo-Seite.</p>
            <Link to="/exercises" className="text-blue-600 underline">
                Zu den Exercises →
            </Link>
        </div>
    )
}

export default HomePage