import Navbar from './Navbar.jsx';
import Description from './Description.jsx';
import MovieGrid from './MovieGrid.jsx';
import Footer from './Footer.jsx';

const Home = ({
    currentUser,
    favoriteCount,
    favoriteIds,
    isAdmin,
    movies,
    onLogout,
    onNavigate,
    onToggleFavorite,
}) => (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar
            currentUser={currentUser}
            favoriteCount={favoriteCount}
            isAdmin={isAdmin}
            onLogout={onLogout}
            onNavigate={onNavigate}
        />
        <Description />
        <main className="flex-grow">
            <MovieGrid
                favoriteIds={favoriteIds}
                movies={movies}
                onMovieSelect={(movieId) => onNavigate(`/movies/${movieId}`)}
                onToggleFavorite={onToggleFavorite}
            />
        </main>
        <Footer />
    </div>
);

export default Home;
