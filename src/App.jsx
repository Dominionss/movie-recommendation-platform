import { useEffect, useMemo, useState } from 'react';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import UserCabinet from './components/UserCabinet.jsx';
import { movies } from './data/movies.js';

const USER_STORAGE_KEY = 'movieApp.currentUser';
const FAVORITES_STORAGE_KEY = 'movieApp.favoriteIds';

const readStoredJson = (key, fallback) => {
    try {
        const storedValue = window.localStorage.getItem(key);

        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch {
        return fallback;
    }
};

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [currentUser, setCurrentUser] = useState(() => readStoredJson(USER_STORAGE_KEY, null));
    const [favoriteIds, setFavoriteIds] = useState(() => readStoredJson(FAVORITES_STORAGE_KEY, []));
    const [pendingFavoriteId, setPendingFavoriteId] = useState(null);

    useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);

        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (currentUser) {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        } else {
            window.localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [currentUser]);

    useEffect(() => {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const favoriteMovies = useMemo(
        () => movies.filter((movie) => favoriteIds.includes(movie.id)),
        [favoriteIds],
    );

    const navigateTo = (path) => {
        if (path !== window.location.pathname) {
            window.history.pushState({}, '', path);
        }

        setCurrentPath(path);
        window.scrollTo({ top: 0 });
    };

    const addFavorite = (movieId) => {
        setFavoriteIds((currentFavorites) => {
            if (currentFavorites.includes(movieId)) {
                return currentFavorites;
            }

            return [...currentFavorites, movieId];
        });
    };

    const toggleFavorite = (movieId) => {
        if (!currentUser) {
            setPendingFavoriteId(movieId);
            navigateTo('/login');
            return;
        }

        setFavoriteIds((currentFavorites) => (
            currentFavorites.includes(movieId)
                ? currentFavorites.filter((id) => id !== movieId)
                : [...currentFavorites, movieId]
        ));
    };

    const handleLogin = ({ email, name }) => {
        setCurrentUser({
            email,
            name,
            signedInAt: new Date().toISOString(),
        });

        if (pendingFavoriteId) {
            addFavorite(pendingFavoriteId);
            setPendingFavoriteId(null);
        }

        navigateTo('/cabinet');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPendingFavoriteId(null);
        navigateTo('/login');
    };

    const sharedPageProps = {
        currentUser,
        favoriteIds,
        favoriteCount: currentUser ? favoriteIds.length : 0,
        onLogout: handleLogout,
        onNavigate: navigateTo,
        onToggleFavorite: toggleFavorite,
    };

    const movieRouteMatch = currentPath.match(/^\/movies\/(\d+)\/?$/);

    if (movieRouteMatch) {
        const movieId = Number(movieRouteMatch[1]);
        const movie = movies.find((item) => item.id === movieId);

        return (
            <MovieDetails
                {...sharedPageProps}
                movie={movie}
                isFavorite={favoriteIds.includes(movieId)}
            />
        );
    }

    if (currentPath === '/login') {
        return (
            <Login
                {...sharedPageProps}
                onLogin={handleLogin}
                pendingFavoriteId={pendingFavoriteId}
            />
        );
    }

    if (currentPath === '/cabinet') {
        return (
            <UserCabinet
                {...sharedPageProps}
                favoriteMovies={favoriteMovies}
            />
        );
    }

    return <Home {...sharedPageProps} movies={movies} />;
}

export default App;
