const MovieCard = ({
    id,
    title,
    rating,
    poster,
    description,
    isFavorite,
    onSelect,
    onToggleFavorite,
    favoriteButtonLabel,
}) => {
    const moviePath = `/movies/${id}`;

    const handleClick = (event) => {
        if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        if (!onSelect) {
            return;
        }

        event.preventDefault();
        onSelect(id);
    };

    const handleFavoriteClick = () => {
        onToggleFavorite?.(id);
    };

    const favoriteLabel = favoriteButtonLabel ?? (
        isFavorite ? 'Remove' : 'Add to favorite'
    );

    return (
        <article className="relative bg-gray-800 rounded-lg shadow-lg hover:shadow-[0_0_20px_#7551e0] hover:shadow-2xl hover:scale-102 transition duration-300 overflow-hidden">
            <button
                type="button"
                onClick={handleFavoriteClick}
                aria-pressed={isFavorite}
                className={`absolute right-3 top-3 z-10 rounded-lg px-3 py-2 text-sm font-bold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isFavorite
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-950/85 text-white hover:bg-red-500'
                }`}
            >
                {favoriteLabel}
            </button>

            <a
                href={moviePath}
                onClick={handleClick}
                aria-label={`View details for ${title}`}
                className="block focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                <img
                    src={poster}
                    alt={title}
                    className="w-full h-160 object-cover"
                />
                <div className="p-4">
                    <h3 className="text-white font-bold text-lg truncate">{title}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
                    <span className="text-yellow-400 font-bold mt-2 block">Rating {rating}</span>
                </div>
            </a>
        </article>
    );
};

export default MovieCard;
