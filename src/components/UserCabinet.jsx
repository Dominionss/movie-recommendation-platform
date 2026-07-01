import Footer from './Footer.jsx';
import MovieCard from './MovieCard.jsx';
import Navbar from './Navbar.jsx';

const UserCabinet = ({
    currentUser,
    favoriteCount,
    favoriteMovies,
    onLogout,
    onNavigate,
    onToggleFavorite,
}) => {
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Navbar
                    currentUser={currentUser}
                    favoriteCount={favoriteCount}
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                />
                <main className="flex-grow flex items-center justify-center px-6 py-16">
                    <section className="max-w-xl text-center">
                        <p className="text-sm font-semibold uppercase text-red-400">
                            Cabinet
                        </p>
                        <h2 className="mt-4 text-4xl font-bold text-white">
                            Sign in to open your cabinet.
                        </h2>
                        <button
                            type="button"
                            onClick={() => onNavigate('/login')}
                            className="mt-8 rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Go to login
                        </button>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Navbar
                currentUser={currentUser}
                favoriteCount={favoriteCount}
                onLogout={onLogout}
                onNavigate={onNavigate}
            />
            <main className="flex-grow px-6 py-10">
                <section className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-4 border-b border-gray-800 pb-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase text-red-400">
                                Cabinet
                            </p>
                            <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                                {currentUser.name}
                            </h2>
                            <p className="mt-3 text-gray-400">
                                {currentUser.email}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-800 px-5 py-4">
                            <p className="text-sm font-semibold uppercase text-gray-500">
                                Favorites
                            </p>
                            <p className="mt-1 text-3xl font-bold text-white">
                                {favoriteMovies.length}
                            </p>
                        </div>
                    </div>

                    {favoriteMovies.length > 0 ? (
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {favoriteMovies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    {...movie}
                                    isFavorite
                                    isLoggedIn
                                    onSelect={(movieId) => onNavigate(`/movies/${movieId}`)}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <section className="mt-10 rounded-lg border border-gray-800 p-8 text-center">
                            <h3 className="text-2xl font-bold text-white">
                                No favorites yet.
                            </h3>
                            <button
                                type="button"
                                onClick={() => onNavigate('/')}
                                className="mt-6 rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                Browse movies
                            </button>
                        </section>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default UserCabinet;
