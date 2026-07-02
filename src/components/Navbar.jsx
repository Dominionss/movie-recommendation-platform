const Navbar = ({ currentUser, favoriteCount, isAdmin, onLogout, onNavigate }) => {
    const handleNavigation = (path) => (event) => {
        if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        if (!onNavigate) {
            return;
        }

        event.preventDefault();
        onNavigate(path);
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
                href="/"
                onClick={handleNavigation('/')}
                className="text-xl font-bold text-red-500"
            >
                MovieApp
            </a>

            <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold sm:text-base">
                <li>
                    <a href="/" onClick={handleNavigation('/')} className="hover:text-red-400">
                        Home
                    </a>
                </li>
                <li>
                    <a href="/cabinet" onClick={handleNavigation('/cabinet')} className="hover:text-red-400">
                        Favorites {favoriteCount}
                    </a>
                </li>
                <li>
                    <a href="/cabinet" onClick={handleNavigation('/cabinet')} className="hover:text-red-400">
                        Cabinet
                    </a>
                </li>
                {isAdmin && (
                    <li>
                        <a href="/admin" onClick={handleNavigation('/admin')} className="hover:text-red-400">
                            Admin
                        </a>
                    </li>
                )}
                <li>
                    {currentUser ? (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="hover:text-red-400"
                        >
                            Log out
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <a href="/login" onClick={handleNavigation('/login')} className="hover:text-red-400">
                                Login
                            </a>
                            <a href="/register" onClick={handleNavigation('/register')} className="hover:text-red-400">
                                Register
                            </a>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
