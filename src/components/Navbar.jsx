const Navbar = ({ onNavigate }) => {
    const handleHomeClick = (event) => {
        if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        if (!onNavigate) {
            return;
        }

        event.preventDefault();
        onNavigate('/');
    };

    return (
        <nav className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between">
            <a href="/" onClick={handleHomeClick} className="text-xl font-bold text-red-500">
                MovieApp
            </a>
            <ul className="flex gap-6">
                <li>
                    <a href="/" onClick={handleHomeClick} className="hover:text-red-400">
                        Home
                    </a>
                </li>
                <li className="hover:text-red-400 cursor-pointer">Top Rated</li>
                <li className="hover:text-red-400 cursor-pointer">Favorites</li>
            </ul>
        </nav>
    );
};

export default Navbar;
