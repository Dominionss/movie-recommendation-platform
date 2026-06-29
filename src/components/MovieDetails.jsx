import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

const MovieDetails = ({ movie, onNavigate }) => {
    const goHome = () => onNavigate('/');

    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Navbar onNavigate={onNavigate} />
                <main className="flex-grow flex items-center justify-center px-6 py-16">
                    <section className="max-w-xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                            Movie not found
                        </p>
                        <h2 className="mt-4 text-4xl font-bold text-white">
                            This movie page does not exist.
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Pick another title from the movie list.
                        </p>
                        <button
                            type="button"
                            onClick={goHome}
                            className="mt-8 rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Back to movies
                        </button>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Navbar onNavigate={onNavigate} />
            <main className="flex-grow px-6 py-10">
                <article className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(260px,360px)_1fr] md:items-center">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full rounded-xl object-cover shadow-2xl shadow-black/40 md:max-h-[560px]"
                    />

                    <div>
                        <button
                            type="button"
                            onClick={goHome}
                            className="mb-8 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Back to movies
                        </button>

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                            Movie details
                        </p>
                        <h2 className="mt-3 text-4xl font-bold text-white md:text-6xl">
                            {movie.title}
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <span className="rounded-lg bg-yellow-400/10 px-4 py-2 font-bold text-yellow-300">
                                Rating {movie.rating}
                            </span>
                            <span className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-gray-300">
                                Popular pick
                            </span>
                        </div>

                        <p className="mt-8 max-w-2xl text-xl leading-8 text-gray-300">
                            {movie.description}
                        </p>

                        <section className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-800 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                                    Summary
                                </h3>
                                <p className="mt-3 text-gray-300">
                                    A focused overview of the selected movie from the recommendation list.
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-800 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                                    Recommendation
                                </h3>
                                <p className="mt-3 text-gray-300">
                                    Use this page to explore the movie before adding more actions later.
                                </p>
                            </div>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default MovieDetails;
