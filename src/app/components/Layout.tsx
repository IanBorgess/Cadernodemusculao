import { Link, Outlet, useLocation } from 'react-router';
import { Dumbbell, History, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    if (confirm('Deseja sair da sua conta?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-3 sm:p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">Caderno de Musculação</h1>
              {user && (
                <p className="text-xs sm:text-sm text-blue-100">Olá, {user.name || user.email}!</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-blue-700 rounded-lg transition flex items-center gap-1 sm:gap-2 text-sm"
            title="Sair"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 pb-20 sm:pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 shadow-lg fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center p-3 sm:p-4 flex-1 ${
              isActive('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs mt-1">Treinos</span>
          </Link>
          
          <Link
            to="/history"
            className={`flex flex-col items-center p-3 sm:p-4 flex-1 ${
              isActive('/history') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <History className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs mt-1">Histórico</span>
          </Link>
          
          <Link
            to="/progress"
            className={`flex flex-col items-center p-3 sm:p-4 flex-1 ${
              isActive('/progress') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs mt-1">Progresso</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}