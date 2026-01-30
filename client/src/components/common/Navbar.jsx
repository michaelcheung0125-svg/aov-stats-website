import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-slate-800 bg-opacity-90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              AOV Stats
            </div>
          </Link>

          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/heroes"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Heroes
            </Link>
            <Link
              to="/rankings"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Rankings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
