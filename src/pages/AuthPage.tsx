import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { store } from '../lib/store';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await store.signIn(email);
    setLoading(false);
    navigate('/dashboard');
  };

  const handleQuickDemoLogin = async (slug: string, ownerId: string) => {
    store.setCurrentUser(ownerId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ReviewFlow Business Portal
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage your NFC tags, Google review conversions, and private feedback
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
          {/* Quick 1-Click Demo Accounts Pill */}
          <div className="mb-6 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Instant 1-Click Demo Logins:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('apex-dental', 'user-demo-1')}
                className="text-left p-2 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200/60 text-xs transition-colors"
              >
                <div className="font-bold text-slate-800">Apex Dental</div>
                <div className="text-[10px] text-slate-500">Dental & Clinic</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('trattoria-roma', 'user-demo-2')}
                className="text-left p-2 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200/60 text-xs transition-colors"
              >
                <div className="font-bold text-slate-800">Trattoria Roma</div>
                <div className="text-[10px] text-slate-500">Restaurant / Cafe</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourbusiness.com"
                className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have a business account yet?{' '}
            <Link to="/onboarding" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Create one now (Free)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
