import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import { movies } from './data/movies.js';

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);

        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateTo = (path) => {
        if (path !== window.location.pathname) {
            window.history.pushState({}, '', path);
        }

        setCurrentPath(path);
        window.scrollTo({ top: 0 });
    };

    const movieRouteMatch = currentPath.match(/^\/movies\/(\d+)\/?$/);

    if (movieRouteMatch) {
        const movieId = Number(movieRouteMatch[1]);
        const movie = movies.find((item) => item.id === movieId);

        return <MovieDetails movie={movie} onNavigate={navigateTo} />;
    }

    return <Home movies={movies} onNavigate={navigateTo} />;
}

export default App;
