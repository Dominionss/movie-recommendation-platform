import { useState } from 'react';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

const Login = ({
    currentUser,
    favoriteCount,
    onLogin,
    onLogout,
    onNavigate,
    pendingFavoriteId,
}) => {
    const [email, setEmail] = useState(currentUser?.email ?? '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setError('Enter email and password.');
            return;
        }

        onLogin({
            email: trimmedEmail,
            name: trimmedEmail.split('@')[0] || 'Movie fan',
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Navbar
                currentUser={currentUser}
                favoriteCount={favoriteCount}
                onLogout={onLogout}
                onNavigate={onNavigate}
            />
            <main className="flex-grow px-6 py-12">
                <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_420px] md:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase text-red-400">
                            User cabinet
                        </p>
                        <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                            Sign in to manage your movies.
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-lg border border-gray-800 bg-gray-950/40 p-6 shadow-2xl shadow-black/30"
                    >
                        {pendingFavoriteId && (
                            <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                                Sign in to save that movie.
                            </p>
                        )}

                        <label className="block text-sm font-semibold text-gray-200" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            inputMode="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                            autoComplete="email"
                        />

                        <label className="mt-5 block text-sm font-semibold text-gray-200" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                            autoComplete="current-password"
                        />

                        {error && (
                            <p className="mt-4 text-sm font-semibold text-red-300">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                        >
                            Sign in
                        </button>
                    </form>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
