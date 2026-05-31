import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Dumbbell, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, name);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erro ao criar conta');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top branding area */}
      <div className="flex flex-col items-center justify-center px-6 pt-10 pb-6">
        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-3xl flex items-center justify-center mb-3 shadow-lg">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Criar Conta</h1>
        <p className="text-blue-200 text-sm">Comece sua jornada fitness hoje!</p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-t-3xl px-6 pt-7 pb-8 shadow-2xl flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {[
            { label: 'Nome', value: name, onChange: setName, type: 'text', placeholder: 'Seu nome', icon: User, autoComplete: 'name' },
            { label: 'E-mail', value: email, onChange: setEmail, type: 'email', placeholder: 'seu@email.com', icon: Mail, autoComplete: 'email' },
            { label: 'Senha', value: password, onChange: setPassword, type: 'password', placeholder: '••••••••', icon: Lock, autoComplete: 'new-password', hint: 'Mínimo 6 caracteres' },
            { label: 'Confirmar Senha', value: confirmPassword, onChange: setConfirmPassword, type: 'password', placeholder: '••••••••', icon: Lock, autoComplete: 'new-password' },
          ].map(({ label, value, onChange, type, placeholder, icon: Icon, autoComplete, hint }) => (
            <div key={label}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={type}
                  inputMode={type === 'email' ? 'email' : undefined}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  autoComplete={autoComplete}
                />
              </div>
              {hint && <p className="text-xs text-gray-400 mt-1 pl-1">{hint}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:bg-blue-700 touch-manipulation disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? 'Criando conta...' : (
              <>
                <UserPlus className="w-5 h-5" />
                Criar Conta
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-blue-600 font-bold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
