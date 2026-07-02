import { useState } from 'react';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

const initialMovieForm = {
    description: '',
    poster: '',
    rating: '',
    title: '',
};

const AdminPanel = ({
    currentUser,
    favoriteCount,
    isAdmin,
    movies,
    onAddMovie,
    onDeleteMovie,
    onLogout,
    onNavigate,
}) => {
    const [form, setForm] = useState(initialMovieForm);
    const [message, setMessage] = useState('');

    const handleChange = (field) => (event) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const result = onAddMovie(form);

        if (!result.ok) {
            setMessage(result.message);
            return;
        }

        setForm(initialMovieForm);
        setMessage('Movie added.');
    };

    const handleDeleteMovie = (movieId) => {
        const result = onDeleteMovie(movieId);

        if (!result.ok) {
            setMessage(result.message);
            return;
        }

        setMessage('Movie deleted.');
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Navbar
                    currentUser={currentUser}
                    favoriteCount={favoriteCount}
                    isAdmin={isAdmin}
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                />
                <main className="flex-grow flex items-center justify-center px-6 py-16">
                    <section className="max-w-xl text-center">
                        <p className="text-sm font-semibold uppercase text-red-400">
                            Admin
                        </p>
                        <h2 className="mt-4 text-4xl font-bold text-white">
                            Admin access is required.
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
                isAdmin={isAdmin}
                onLogout={onLogout}
                onNavigate={onNavigate}
            />
            <main className="flex-grow px-6 py-10">
                <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[420px_1fr]">
                    <form
                        onSubmit={handleSubmit}
                        className="h-fit rounded-lg border border-gray-800 bg-gray-950/40 p-6 shadow-2xl shadow-black/30"
                    >
                        <p className="text-sm font-semibold uppercase text-red-400">
                            Admin panel
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white">
                            Add movie
                        </h2>

                        <label className="mt-6 block text-sm font-semibold text-gray-200" htmlFor="movie-title">
                            Title
                        </label>
                        <input
                            id="movie-title"
                            type="text"
                            value={form.title}
                            onChange={handleChange('title')}
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                        />

                        <label className="mt-5 block text-sm font-semibold text-gray-200" htmlFor="movie-rating">
                            Rating
                        </label>
                        <input
                            id="movie-rating"
                            type="text"
                            inputMode="decimal"
                            value={form.rating}
                            onChange={handleChange('rating')}
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                        />

                        <label className="mt-5 block text-sm font-semibold text-gray-200" htmlFor="movie-poster">
                            Poster URL
                        </label>
                        <input
                            id="movie-poster"
                            type="url"
                            value={form.poster}
                            onChange={handleChange('poster')}
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                        />

                        <label className="mt-5 block text-sm font-semibold text-gray-200" htmlFor="movie-description">
                            Description
                        </label>
                        <textarea
                            id="movie-description"
                            value={form.description}
                            onChange={handleChange('description')}
                            rows={4}
                            className="mt-2 w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                        />

                        {message && (
                            <p className="mt-4 text-sm font-semibold text-gray-300">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                        >
                            Add movie
                        </button>
                    </form>

                    <section>
                        <div className="flex flex-col gap-3 border-b border-gray-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase text-red-400">
                                    Movies
                                </p>
                                <h2 className="mt-3 text-4xl font-bold text-white">
                                    Manage catalog
                                </h2>
                            </div>
                            <p className="text-gray-400">
                                {movies.length} movies
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4">
                            {movies.map((movie) => (
                                <article
                                    key={movie.id}
                                    className="grid gap-4 rounded-lg border border-gray-800 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center"
                                >
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="h-32 w-24 rounded-lg object-cover sm:h-28 sm:w-20"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {movie.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            Rating {movie.rating}
                                        </p>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-300">
                                            {movie.description}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteMovie(movie.id)}
                                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        Delete
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AdminPanel;
