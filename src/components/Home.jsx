import Navbar from './Navbar.jsx';
import Description from './Description.jsx';
import MovieGrid from './MovieGrid.jsx';
import Footer from './Footer.jsx';

const Home = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <Description />
        <main className="flex-grow">
            <MovieGrid />
        </main>
        <Footer />
    </div>
);

export default Home;