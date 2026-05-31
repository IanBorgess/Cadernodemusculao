import { Link, Outlet, useLocation } from 'react-router';
import { Dumbbell, History, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    if (confirm('Deseja sair da sua conta?')) {
      await signOut();
    }
  };

  const navItems = [
    { to: '/', icon: Dumbbell, label: 'Treinos' },
    { to: '/history', icon: History, label: 'Histórico' },
    { to: '/progress', icon: TrendingUp, label: 'Progresso' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 rounded-xl p-1.5">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Caderno de Musculação</h1>
              {user && (
                <p className="text-xs text-blue-200 leading-tight">Olá, {user.name?.split(' ')[0] || user.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl bg-blue-500 active:bg-blue-400 touch-manipulation"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-4 pb-28 max-w-xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around max-w-xl mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 py-2 flex-1 touch-manipulation transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-blue-50' : ''}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                  {label}
                </span>
                {active && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
