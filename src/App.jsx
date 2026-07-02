import { useEffect, useMemo, useState } from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import Register from './components/Register.jsx';
import UserCabinet from './components/UserCabinet.jsx';
import { ADMIN_USER, STORAGE_KEYS } from './config/appConfig.js';
import { movies as defaultMovies } from './data/movies.js';

const readStoredJson = (key, fallback) => {
    try {
        const storedValue = window.localStorage.getItem(key);

        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch {
        return fallback;
    }
};

const getStoredCurrentUser = () => {
    const storedUser = readStoredJson(STORAGE_KEYS.currentUser, null);

    if (!storedUser) {
        return null;
    }

    return {
        ...storedUser,
        role: storedUser.email === ADMIN_USER.email ? 'admin' : storedUser.role ?? 'user',
    };
};

const getStoredUsers = () => {
    const storedUsers = readStoredJson(STORAGE_KEYS.users, []);
    const normalizedUsers = storedUsers.map((user) => ({
        ...user,
        role: user.email === ADMIN_USER.email ? 'admin' : user.role ?? 'user',
    }));
    const hasAdmin = normalizedUsers.some((user) => user.email === ADMIN_USER.email);

    return hasAdmin ? normalizedUsers : [ADMIN_USER, ...normalizedUsers];
};

const toSessionUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? 'user',
    signedInAt: new Date().toISOString(),
});

const createId = (prefix) => {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `${prefix}-${Date.now()}`;
};

const createMovieId = (currentMovies) => (
    currentMovies.reduce((maxId, movie) => Math.max(maxId, Number(movie.id) || 0), 0) + 1
);

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);
    const [users, setUsers] = useState(getStoredUsers);
    const [movies, setMovies] = useState(() => readStoredJson(STORAGE_KEYS.movies, defaultMovies));
    const [commentsByMovie, setCommentsByMovie] = useState(() => readStoredJson(STORAGE_KEYS.commentsByMovie, {}));
    const [favoriteIdsByUser, setFavoriteIdsByUser] = useState(() => {
        const storedFavorites = readStoredJson(STORAGE_KEYS.favoritesByUser, {});

        if (Array.isArray(storedFavorites)) {
            const storedUser = getStoredCurrentUser();

            return storedUser?.email ? { [storedUser.email]: storedFavorites } : {};
        }

        return storedFavorites;
    });
    const [pendingFavoriteId, setPendingFavoriteId] = useState(null);

    const favoriteIds = useMemo(
        () => currentUser ? favoriteIdsByUser[currentUser.email] ?? [] : [],
        [currentUser, favoriteIdsByUser],
    );
    const isAdmin = currentUser?.role === 'admin';

    useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);

        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (currentUser) {
            window.localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
        } else {
            window.localStorage.removeItem(STORAGE_KEYS.currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(movies));
    }, [movies]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.commentsByMovie, JSON.stringify(commentsByMovie));
    }, [commentsByMovie]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.favoritesByUser, JSON.stringify(favoriteIdsByUser));
    }, [favoriteIdsByUser]);

    const favoriteMovies = useMemo(
        () => movies.filter((movie) => favoriteIds.includes(movie.id)),
        [favoriteIds, movies],
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

        navigateTo(sessionUser.role === 'admin' ? '/admin' : '/cabinet');
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
            id: createId('user'),
            email: normalizedEmail,
            name: name.trim(),
            password,
            role: 'user',
        };

        setUsers((currentUsers) => [...currentUsers, newUser]);
        completeAuthentication(newUser);

        return { ok: true };
    };

    const handleAddMovie = ({ description, poster, rating, title }) => {
        if (!isAdmin) {
            return {
                ok: false,
                message: 'Admin access is required.',
            };
        }

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const trimmedPoster = poster.trim();
        const trimmedRating = rating.trim();
        const numericRating = Number(trimmedRating);

        if (!trimmedTitle || !trimmedDescription || !trimmedPoster || !trimmedRating) {
            return {
                ok: false,
                message: 'Fill in all movie fields.',
            };
        }

        if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
            return {
                ok: false,
                message: 'Rating must be between 0 and 10.',
            };
        }

        setMovies((currentMovies) => [
            {
                id: createMovieId(currentMovies),
                title: trimmedTitle,
                rating: numericRating.toFixed(1),
                poster: trimmedPoster,
                description: trimmedDescription,
            },
            ...currentMovies,
        ]);

        return { ok: true };
    };

    const handleDeleteMovie = (movieId) => {
        if (!isAdmin) {
            return {
                ok: false,
                message: 'Admin access is required.',
            };
        }

        setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));
        setFavoriteIdsByUser((currentFavoritesByUser) => Object.fromEntries(
            Object.entries(currentFavoritesByUser).map(([email, ids]) => [
                email,
                ids.filter((id) => id !== movieId),
            ]),
        ));
        setCommentsByMovie((currentCommentsByMovie) => {
            const nextCommentsByMovie = { ...currentCommentsByMovie };
            delete nextCommentsByMovie[movieId];
            return nextCommentsByMovie;
        });

        if (currentPath === `/movies/${movieId}`) {
            navigateTo('/');
        }

        return { ok: true };
    };

    const handleAddComment = (movieId, text) => {
        if (!currentUser) {
            navigateTo('/login');
            return {
                ok: false,
                message: 'Log in to comment.',
            };
        }

        const trimmedText = text.trim();

        if (!trimmedText) {
            return {
                ok: false,
                message: 'Enter a comment.',
            };
        }

        const comment = {
            id: createId('comment'),
            createdAt: new Date().toISOString(),
            movieId,
            text: trimmedText,
            userEmail: currentUser.email,
            userName: currentUser.name,
        };

        setCommentsByMovie((currentCommentsByMovie) => ({
            ...currentCommentsByMovie,
            [movieId]: [...(currentCommentsByMovie[movieId] ?? []), comment],
        }));

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
        isAdmin,
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
                comments={commentsByMovie[movieId] ?? []}
                isFavorite={favoriteIds.includes(movieId)}
                movie={movie}
                onAddComment={handleAddComment}
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

    if (currentPath === '/admin') {
        return (
            <AdminPanel
                {...sharedPageProps}
                movies={movies}
                onAddMovie={handleAddMovie}
                onDeleteMovie={handleDeleteMovie}
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
