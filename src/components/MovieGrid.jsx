import MovieCard from './MovieCard.jsx';

const MovieGrid = ({
    favoriteIds,
    movies,
    onMovieSelect,
    onToggleFavorite,
}) => (
    <section className="bg-gray-900 py-10 px-8">
        <h2 className="text-white text-2xl font-bold mb-6">Popular Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    {...movie}
                    isFavorite={favoriteIds.includes(movie.id)}
                    onSelect={onMovieSelect}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    </section>
);

export default MovieGrid;
