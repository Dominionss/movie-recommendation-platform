import { useEffect, useMemo, useState } from 'react';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import Register from './components/Register.jsx';
import UserCabinet from './components/UserCabinet.jsx';
import { movies } from './data/movies.js';

const USER_STORAGE_KEY = 'movieApp.currentUser';
const USERS_STORAGE_KEY = 'movieApp.users';
const FAVORITES_STORAGE_KEY = 'movieApp.favoriteIdsByUser';

const readStoredJson = (key, fallback) => {
    try {
        const storedValue = window.localStorage.getItem(key);

        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch {
        return fallback;
    }
};

const toSessionUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    signedInAt: new Date().toISOString(),
});

const createUserId = () => {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `user-${Date.now()}`;
};

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [currentUser, setCurrentUser] = useState(() => readStoredJson(USER_STORAGE_KEY, null));
    const [users, setUsers] = useState(() => readStoredJson(USERS_STORAGE_KEY, []));
    const [favoriteIdsByUser, setFavoriteIdsByUser] = useState(() => {
        const storedFavorites = readStoredJson(FAVORITES_STORAGE_KEY, {});

        if (Array.isArray(storedFavorites)) {
            const storedUser = readStoredJson(USER_STORAGE_KEY, null);

            return storedUser?.email ? { [storedUser.email]: storedFavorites } : {};
        }

        return storedFavorites;
    });
    const [pendingFavoriteId, setPendingFavoriteId] = useState(null);

    const favoriteIds = useMemo(
        () => currentUser ? favoriteIdsByUser[currentUser.email] ?? [] : [],
        [currentUser, favoriteIdsByUser],
    );

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
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIdsByUser));
    }, [favoriteIdsByUser]);

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

    const updateFavoritesForUser = (email, updater) => {
        setFavoriteIdsByUser((currentFavoritesByUser) => ({
            ...currentFavoritesByUser,
            [email]: updater(currentFavoritesByUser[email] ?? []),
        }));
    };

    const addFavoriteForUser = (email, movieId) => {
        updateFavoritesForUser(email, (currentFavorites) => {
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

        updateFavoritesForUser(currentUser.email, (currentFavorites) => (
            currentFavorites.includes(movieId)
                ? currentFavorites.filter((id) => id !== movieId)
                : [...currentFavorites, movieId]
        ));
    };

    const completeAuthentication = (user) => {
        const sessionUser = toSessionUser(user);
        setCurrentUser(sessionUser);

        if (pendingFavoriteId) {
            addFavoriteForUser(sessionUser.email, pendingFavoriteId);
            setPendingFavoriteId(null);
        }

        navigateTo('/cabinet');
    };

    const handleLogin = ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find((item) => (
            item.email.toLowerCase() === normalizedEmail && item.password === password
        ));

        if (!user) {
            return {
                ok: false,
                message: users.length > 0
                    ? 'Email or password is incorrect.'
                    : 'Create an account first.',
            };
        }

        completeAuthentication(user);

        return { ok: true };
    };

    const handleRegister = ({ email, name, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = users.find((item) => item.email.toLowerCase() === normalizedEmail);

        if (existingUser) {
            return {
                ok: false,
                message: 'A user with this email already exists.',
            };
        }

        const newUser = {
            id: createUserId(),
            email: normalizedEmail,
            name: name.trim(),
            password,
        };

        setUsers((currentUsers) => [...currentUsers, newUser]);
        completeAuthentication(newUser);

        return { ok: true };
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

    if (currentPath === '/register') {
        return (
            <Register
                {...sharedPageProps}
                onRegister={handleRegister}
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
