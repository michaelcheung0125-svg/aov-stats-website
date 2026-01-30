import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import PlayerProfile from './pages/PlayerProfile';
import Heroes from './pages/Heroes';
import HeroDetail from './pages/HeroDetail';
import Rankings from './pages/Rankings';
import Navbar from './components/common/Navbar';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/heroes" element={<Heroes />} />
              <Route path="/heroes/:id" element={<HeroDetail />} />
              <Route path="/rankings" element={<Rankings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
