import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Brain } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = isRegister ? await register(form) : await login(form);
      if (!result.success) {
        setError(result.error || 'Something went wrong');
        return;
      }
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-surface to-surface-elevated flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid md:grid-cols-[1.3fr,1fr] gap-10 items-center">
        {/* Left hero section */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="w-7 h-7 rounded-full bg-accent-1/20 flex items-center justify-center text-accent-1">
              <Brain size={16} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
              Second Brain OS
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Capture everything.
            <br />
            <span className="text-gradient">Remember effortlessly.</span>
          </h1>
          <p className="text-sm lg:text-base text-gray-400 max-w-xl leading-relaxed mb-8">
            Sign in to your private second brain. Organize research, ideas, and notes in one place,
            and let Nova help you make sense of it all.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Encrypted sessions</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <span>AI-assisted writing · Semantic search · Smart tags</span>
          </div>
        </div>

        {/* Right auth card */}
        <div className="glass-card p-8 md:p-9 w-full max-w-md mx-auto border border-white/10 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 mb-1">
                {isRegister ? 'Get started' : 'Welcome back'}
              </p>
              <h2 className="text-2xl font-black text-white">
                {isRegister ? 'Create your account' : 'Sign in to continue'}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Name</label>
                <input
                  name="name"
                  placeholder="How should we call you?"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-1/50 focus:border-accent-1/50"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-1/50 focus:border-accent-1/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-1/50 focus:border-accent-1/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs border border-red-500/30 bg-red-500/5 rounded-md px-3 py-2">{error}</p>}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="mt-6 w-full text-xs text-gray-400 hover:text-white text-center"
          >
            {isRegister ? (
              <>
                Already have an account? <span className="text-accent-1 font-medium">Sign in</span>
              </>
            ) : (
              <>
                Don&apos;t have an account? <span className="text-accent-1 font-medium">Sign up</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
