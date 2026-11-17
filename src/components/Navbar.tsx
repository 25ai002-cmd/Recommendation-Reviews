import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Smartphone, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react';
import { store } from '../lib/store';
import { Business } from '../types';

interface NavbarProps {
  currentBusiness?: Business | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentBusiness, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    store.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">ReviewFlow</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                NFC SaaS
              </span>
            </div>
            <span className="text-[11px] text-slate-500 -mt-0.5">Automated Review Accelerator</span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {currentBusiness ? (
            <>
              {/* Live NFC Link Button */}
              <a
                href={`/r/${currentBusiness.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                title="Open customer tap preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>NFC Tap Page: /{currentBusiness.slug}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Business Badge */}
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: currentBusiness.brand_color || '#4f46e5' }} 
                />
                <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate">
                  {currentBusiness.name}
                </span>
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/onboarding"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
