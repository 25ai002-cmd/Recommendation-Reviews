import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  QrCode, 
  MessageSquare,
  Zap,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen NFC & QR Review SaaS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Turn In-Store Customers into{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                5-Star Google Reviews
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Customers tap their phone to an NFC counter stand. Our smart suggestion engine generates a natural, enthusiastic review in 15 seconds without costly AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Your Business</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="/r/apex-dental"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-2xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Try Live Customer NFC Demo</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Zero paid AI API costs
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Intercepts 1-3 star reviews privately
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Compatible with all iPhones & Androids
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Built for High-Growth Local Businesses
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything required to scale authentic Google reviews while safeguarding your business reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Instant NFC Tap & QR Code
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Place an NFC puck, acrylic table tent, or sticker on your front counter. No app download required for the customer.
              </p>
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Works with any NTAG213/215 tag
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Randomized Suggestion Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Customers select quick highlight chips ("Friendly staff", "Super clean"). Our combinatorial engine generates natural, unique 5-star reviews on the fly.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Zero AI token fees or delays
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Negative Review Interception
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Customers who select 1-3 stars are routed to a private feedback form that goes straight to the owner's dashboard instead of public Google Reviews.
              </p>
              <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                Protects your public Google rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-business Interactive Demo preview */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">
            Try a Live Business Demo Right Now
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-10">
            Select an industry below to experience what your customers see when they tap their phone:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto gap-4">
            <Link
              to="/r/apex-dental"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-base">Apex Dental Studio</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300">Dental clinic customer tap flow with custom healthcare tags.</p>
            </Link>

            <Link
              to="/r/trattoria-roma"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-base">Trattoria Roma</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300">Restaurant tap flow with food, cocktails, and ambiance highlights.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
            <span className="font-bold text-slate-800">ReviewFlow</span>
            <span>&copy; {new Date().getFullYear()} — Multi-tenant NFC SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Business Login</Link>
            <Link to="/onboarding" className="hover:text-indigo-600 transition-colors">Register Business</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
