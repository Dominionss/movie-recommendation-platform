import MovieCard from './MovieCard.jsx';

const movies = [
    { id: 1, title: 'Inception', rating: '8.8', poster: 'https://images.squarespace-cdn.com/content/v1/5ec686197f8b2976074846c2/1618809593080-N5PB8CWYOW3OPDE2TT6E/Feature+3-1.png', description: 'A thief who steals corporate secrets through dreams.' },
    { id: 2, title: 'Interstellar', rating: '8.6', poster: 'https://i.etsystatic.com/36541132/r/il/72181f/7047437338/il_fullxfull.7047437338_fncs.jpg', description: 'A team of explorers travel through a wormhole in space.' },
    { id: 3, title: 'The Dark Knight', rating: '9.0', poster: 'https://m.media-amazon.com/images/I/51bsjerr5zL._AC_UF894,1000_QL80_.jpg', description: 'Batman faces the Joker in Gotham City.' },
];

const MovieGrid = () => (
    <section className="bg-gray-900 py-10 px-8">
        <h2 className="text-white text-2xl font-bold mb-6">Popular Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
                <MovieCard key={movie.id} {...movie} />
            ))}
        </div>
    </section>
);

export default MovieGrid;