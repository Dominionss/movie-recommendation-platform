import Navbar from './Navbar.jsx';
import Description from './Description.jsx';
import MovieGrid from './MovieGrid.jsx';
import Footer from './Footer.jsx';

const Home = ({ movies, onNavigate }) => (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar onNavigate={onNavigate} />
        <Description />
        <main className="flex-grow">
            <MovieGrid
                movies={movies}
                onMovieSelect={(movieId) => onNavigate(`/movies/${movieId}`)}
            />
        </main>
        <Footer />
    </div>
);

export default Home;
