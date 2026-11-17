import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Smartphone, 
  Printer, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Settings, 
  Save, 
  MessageSquare,
  Check,
  Tag,
  Share2,
  HeartHandshake
} from 'lucide-react';
import { store } from '../lib/store';
import { Business, DashboardStats, PrivateFeedback, BusinessCategory } from '../types';
import { Navbar } from '../components/Navbar';
import { QRModal } from '../components/QRModal';
import { StandPosterModal } from '../components/StandPosterModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Settings Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('general');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'settings'>('overview');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const currentBiz = await store.getBusinessForCurrentUser();
      if (!currentBiz) {
        navigate('/login');
        return;
      }
      setBusiness(currentBiz);
      setBusinessName(currentBiz.name);
      setCategory(currentBiz.category);
      setGoogleReviewUrl(currentBiz.google_review_url);
      setCustomPrompt(currentBiz.custom_prompt || '');
      setBrandColor(currentBiz.brand_color || '#4f46e5');

      const s = await store.getDashboardStats(currentBiz.id);
      setStats(s);

      const fb = await store.getFeedbackForBusiness(currentBiz.id);
      setFeedbacks(fb);

      setLoading(false);
    }
    loadData();
  }, [navigate]);

  const handleCopyLink = () => {
    if (!business) return;
    const url = `${window.location.origin}/r/${business.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSavingSettings(true);
    const updated = await store.updateBusiness(business.id, {
      name: businessName,
      category: category,
      google_review_url: googleReviewUrl,
      custom_prompt: customPrompt,
      brand_color: brandColor
    });
    setBusiness(updated);
    setSavingSettings(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFeedbackStatusChange = async (feedbackId: string, status: 'new' | 'contacted' | 'resolved') => {
    await store.updateFeedbackStatus(feedbackId, status);
    if (business) {
      const fb = await store.getFeedbackForBusiness(business.id);
      setFeedbacks(fb);
    }
  };

  if (loading || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nfcUrl = `${window.location.origin}/r/${business.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentBusiness={business} onLogout={() => navigate('/login')} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md flex-shrink-0"
              style={{ backgroundColor: business.brand_color || '#4f46e5' }}
            >
              {business.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {business.name}
                </h1>
                <span className="text-xs font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                  {business.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> FTC Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                <span>NFC Tag Endpoint:</span>
                <span className="bg-slate-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                  {nfcUrl}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Hardware & Link Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsQrOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Show QR</span>
            </button>

            <button
              onClick={() => setIsPosterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Print Stand Card</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy Tap Link'}</span>
            </button>

            <a
              href={`/r/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test Customer Flow</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'feedback'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Feedback Inbox</span>
            {feedbacks.filter(f => f.status === 'new').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {feedbacks.filter(f => f.status === 'new').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Business Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Scans */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total NFC Taps / Scans
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-1">
                    {stats?.totalScans || 0}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18% this week
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>

              {/* Google Review Conversions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Copied to Google
                  </p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">
                    {stats?.googleRedirects || 0}
                  </p>
                  <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                    {stats?.conversionRate}% tap-to-review rate
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Direct Feedback Captured */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Direct Feedback Inquiries
                  </p>
                  <p className="text-3xl font-black text-indigo-600 mt-1">
                    {stats?.privateFeedbacks || 0}
                  </p>
                  <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                    Direct customer resolutions
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
              </div>

              {/* Average Customer Sentiment */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Average Tap Rating
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-3xl font-black text-slate-900">
                      {stats?.avgRating || 4.9}
                    </p>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                    Out of 5.0 scale
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Compliance & Workflow Architecture Callout */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <div className="max-w-2xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> FTC & Google Review Policy Compliant
                </span>
                <h3 className="text-2xl font-black mt-1 mb-3">
                  Ethical Review Acceleration
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  ReviewFlow gives every customer the unrestricted right to leave an honest Google review. For customers with constructive or critical feedback, a direct-to-owner resolution channel is highlighted prominently alongside the public Google link, enabling you to resolve issues proactively without review manipulation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-indigo-300 font-bold text-xs mb-1">Step 1: 15-Sec Tap</div>
                  <p className="text-xs text-slate-300">Customer taps NFC card at register, counter, or table tent.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-indigo-300 font-bold text-xs mb-1">Step 2: Template Synthesis</div>
                  <p className="text-xs text-slate-300">Customer selects highlights. Natural review options are generated instantly.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-indigo-300 font-bold text-xs mb-1">Step 3: Direct to Google</div>
                  <p className="text-xs text-slate-300">Copied to clipboard and redirects directly to your Google review dialog.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT PRIVATE FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Direct Customer Feedback & Resolution Inbox
                </h2>
                <p className="text-xs text-slate-500">
                  Customers who submitted direct messages to management for fast resolution.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full self-start">
                {feedbacks.length} messages received
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <HeartHandshake className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-500" />
                <p className="text-sm font-semibold text-slate-600">No direct feedback messages yet</p>
                <p className="text-xs text-slate-400 mt-1">When customers submit private feedback via their tap page, it will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {feedbacks.map((item) => (
                  <div key={item.id} className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= item.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {item.customer_name || 'Customer'}
                        </span>
                        {(item.customer_email || item.customer_phone) && (
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.customer_email || item.customer_phone}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                        "{item.message}"
                      </p>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleFeedbackStatusChange(item.id, 'contacted')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                          item.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleFeedbackStatusChange(item.id, 'resolved')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                          item.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUSINESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-3xl animate-fadeIn">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Business Configuration
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Configure your Google review destination and customize how the NFC tap page looks for your customers.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

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
                  Find this in your Google Business Profile &gt; "Ask for reviews" link.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Industry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                    className="w-full text-sm text-slate-800 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="restaurant">Restaurant / Cafe</option>
                    <option value="salon">Salon / Spa / Barbershop</option>
                    <option value="dental">Dental / Clinic / Medical</option>
                    <option value="automotive">Auto Repair / Dealership</option>
                    <option value="retail">Retail / Boutique</option>
                    <option value="fitness">Gym / Fitness Studio</option>
                    <option value="services">Home Services / Contracting</option>
                    <option value="general">General Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-3">
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Custom Welcome Question
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="How was your experience with us today?"
                  className="w-full text-sm text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
                </button>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-4 h-4" /> Settings saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* QR Code and Poster Modals */}
      <QRModal
        business={business}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onOpenPoster={() => setIsPosterOpen(true)}
      />

      <StandPosterModal
        business={business}
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />
    </div>
  );
};
