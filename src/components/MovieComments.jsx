import { useState } from 'react';

const MovieComments = ({
    comments,
    currentUser,
    movieId,
    onAddComment,
    onNavigate,
}) => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const result = onAddComment(movieId, text);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        setText('');
        setError('');
    };

    return (
        <section className="mx-auto mt-10 max-w-6xl border-t border-gray-800 pt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-red-400">
                        Comments
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                        Movie discussion
                    </h3>
                </div>
                <p className="text-gray-400">
                    {comments.length} comments
                </p>
            </div>

            {currentUser ? (
                <form onSubmit={handleSubmit} className="mt-6">
                    <label className="block text-sm font-semibold text-gray-200" htmlFor="movie-comment">
                        Comment
                    </label>
                    <textarea
                        id="movie-comment"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        maxLength={500}
                        rows={4}
                        className="mt-2 w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/40"
                    />

                    {error && (
                        <p className="mt-3 text-sm font-semibold text-red-300">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="mt-4 rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Add comment
                    </button>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="mt-6 rounded-lg bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Log in to comment
                </button>
            )}

            <div className="mt-8 grid gap-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <article key={comment.id} className="rounded-lg border border-gray-800 p-5">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="font-bold text-white">
                                    {comment.userName}
                                </h4>
                                <time className="text-sm text-gray-500" dateTime={comment.createdAt}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </time>
                            </div>
                            <p className="mt-3 whitespace-pre-wrap break-words text-gray-300">
                                {comment.text}
                            </p>
                        </article>
                    ))
                ) : (
                    <p className="rounded-lg border border-gray-800 p-5 text-gray-400">
                        No comments yet.
                    </p>
                )}
            </div>
        </section>
    );
};

export default MovieComments;
