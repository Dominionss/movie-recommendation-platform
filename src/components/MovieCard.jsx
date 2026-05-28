const MovieCard = ({ title, rating, poster, description }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <img
            src={poster}
            alt={title}
            className="w-full h-56 object-cover rounded-t-lg"
        />
        <div className="p-4">
            <h3 className="text-white font-bold text-lg truncate">{title}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
            <span className="text-yellow-400 font-bold mt-2 block">⭐ {rating}</span>
        </div>
    </div>
);

export default MovieCard;