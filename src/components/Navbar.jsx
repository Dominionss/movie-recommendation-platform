const Navbar = () => (
    <nav className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-500">🎬 MovieApp</h1>
        <ul className="flex gap-6">
            <li className="hover:text-red-400 cursor-pointer">Home</li>
            <li className="hover:text-red-400 cursor-pointer">Top Rated</li>
            <li className="hover:text-red-400 cursor-pointer">Favorites</li>
        </ul>
    </nav>
);

export default Navbar;