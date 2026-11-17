import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, ArrowRight, Building, MapPin, Sparkles, Check } from 'lucide-react';
import { store } from '../lib/store';
import { BusinessCategory } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('restaurant');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [email, setEmail] = useState('');
  const [customPrompt, setCustomPrompt] = useState('How was your experience with us today?');
  const [loading, setLoading] = useState(false);

  // Auto-generate URL slug when business name changes
  const handleNameChange = (name: string) => {
    setBusinessName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !googleReviewUrl) return;
    setLoading(true);

    const ownerId = email ? email : `user-${Date.now()}`;

    await store.registerBusiness({
      owner_id: ownerId,
      name: businessName,
      slug: slug || `biz-${Date.now()}`,
      category: category,
      google_review_url: googleReviewUrl,
      brand_color: brandColor,
      custom_prompt: customPrompt,
      min_rating_for_google: 4,
      is_active: true
    });

    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center px-4">
        <Link to="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Star className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Launch Your ReviewFlow System
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Setup your business in 60 seconds to start collecting 5-star Google reviews via NFC & QR.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <form 
          onSubmit={handleCreateBusiness} 
          className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 space-y-5"
        >
          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Bella Cucina Italian Bistro"
              className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* URL Slug Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your NFC Tap Link Slug
            </label>
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-600">
              <span className="text-slate-400">{window.location.origin}/r/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="bg-transparent text-indigo-700 font-bold focus:outline-none flex-1 ml-1"
                placeholder="your-business"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This is the URL your NFC cards and counter QR codes will open.
            </p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Industry / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="restaurant">Restaurant / Cafe</option>
                <option value="salon">Salon & Spa</option>
                <option value="dental">Dental & Medical</option>
                <option value="automotive">Auto Repair</option>
                <option value="retail">Retail Shop</option>
                <option value="fitness">Gym & Fitness</option>
                <option value="services">Home Services</option>
                <option value="general">General Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="flex-1 text-sm font-mono text-slate-800 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Google Review URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Google Review URL *
            </label>
            <input
              type="url"
              required
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              placeholder="https://g.page/r/your-place-id/review"
              className="w-full text-sm font-mono text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Go to Google Maps or your Google Business Profile &gt; "Ask for reviews" link.
            </p>
          </div>

          {/* Account Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Account Login Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yourbusiness.com"
              className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Creating Dashboard...' : 'Create Business & Generate QR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
