import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Copy, 
  ExternalLink, 
  Check, 
  RotateCw, 
  MessageSquare, 
  Send, 
  AlertCircle,
  ThumbsUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { store } from '../lib/store';
import { generateReviewSuggestions } from '../lib/templateEngine';
import { Business } from '../types';
import { StarRating } from '../components/StarRating';

export const CustomerReviewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Flow State
  const [rating, setRating] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestedReviews, setSuggestedReviews] = useState<{ id: string; vibe: string; text: string }[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [customizedReviewText, setCustomizedReviewText] = useState('');
  const [copied, setCopied] = useState(false);

  // Direct Private Feedback Option (Available for all ratings, highlighted for 1-3 stars)
  const [showPrivateForm, setShowPrivateForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const biz = await store.getBusinessBySlug(slug);
      if (biz) {
        setBusiness(biz);
        const tags = store.getTagsForCategory(biz.category);
        setAvailableTags(tags);
        setSelectedTags(tags.slice(0, 2));

        // Log scan event
        store.logScanEvent({
          business_id: biz.id,
          action_type: 'scan',
          device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        });
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  // Update suggestions and feedback mode based on rating
  useEffect(() => {
    if (business && rating) {
      if (rating >= 4) {
        setShowPrivateForm(false);
        const suggestions = generateReviewSuggestions({
          businessName: business.name,
          category: business.category,
          selectedTags: selectedTags
        });
        setSuggestedReviews(suggestions);
        if (suggestions.length > 0) {
          setCustomizedReviewText(suggestions[activeSuggestionIndex]?.text || suggestions[0].text);
        }
      } else {
        // For 1-3 stars, default to showing the private resolution form, but NEVER block Google review link
        setShowPrivateForm(true);
      }
    }
  }, [business, rating, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSelectSuggestion = (index: number) => {
    setActiveSuggestionIndex(index);
    if (suggestedReviews[index]) {
      setCustomizedReviewText(suggestedReviews[index].text);
    }
  };

  const handleShuffle = () => {
    if (!business) return;
    const fresh = generateReviewSuggestions({
      businessName: business.name,
      category: business.category,
      selectedTags: selectedTags
    });
    setSuggestedReviews(fresh);
    setCustomizedReviewText(fresh[activeSuggestionIndex]?.text || fresh[0].text);
  };

  const handleCopyToGoogle = () => {
    if (!business) return;

    if (customizedReviewText) {
      navigator.clipboard.writeText(customizedReviewText);
      setCopied(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    store.logScanEvent({
      business_id: business.id,
      rating_selected: rating,
      action_type: 'copy_review',
      selected_tags: selectedTags,
      device_type: 'mobile'
    });

    setTimeout(() => {
      window.open(business.google_review_url, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleDirectGoogleLink = () => {
    if (!business) return;
    store.logScanEvent({
      business_id: business.id,
      rating_selected: rating,
      action_type: 'redirect_google',
      device_type: 'mobile'
    });
    window.open(business.google_review_url, '_blank', 'noopener,noreferrer');
  };

  const handlePrivateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSubmittingFeedback(true);

    await store.submitPrivateFeedback({
      business_id: business.id,
      rating: rating || 3,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      message: feedbackMessage
    });

    await store.logScanEvent({
      business_id: business.id,
      rating_selected: rating,
      action_type: 'submit_private',
      device_type: 'mobile'
    });

    setSubmittingFeedback(false);
    setFeedbackSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Connecting to ReviewFlow...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Business Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">
            The review page for <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">/{slug}</code> could not be found.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isLowRating = rating !== null && rating <= 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 flex flex-col items-center justify-start p-4 sm:p-6">
      {/* Brand Header */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: business.brand_color || '#4f46e5' }} 
          />
          <span>{business.name}</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Business
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {business.name}
          </h1>
          <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
            {business.custom_prompt || 'How was your experience with us today?'}
          </p>
        </div>

        {/* Rating Selector */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 mb-6 text-center">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
            Tap a star rating
          </p>
          <StarRating
            value={rating || 0}
            onChange={(val) => setRating(val)}
            size="xl"
          />
          {rating && (
            <p className="text-xs font-semibold text-slate-700 mt-2 animate-fadeIn">
              {rating === 5 && '🌟 Exceptional! Thank you!'}
              {rating === 4 && '👍 Great! Glad you enjoyed it!'}
              {rating === 3 && '😐 Average — We want to improve.'}
              {rating <= 2 && '😟 Not happy? Tell us directly how we can make it right.'}
            </p>
          )}
        </div>

        {/* RATING 1-3 STARS: Show Direct Resolution + Google Option (Google-Compliant, No Gating) */}
        {isLowRating && (
          <div className="space-y-5 animate-fadeIn">
            {feedbackSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <ThumbsUp className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-emerald-950 text-base mb-1">
                  Thank You for Your Feedback
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                  Your comments have been sent directly to management. We appreciate the opportunity to make this right with you!
                </p>
                <button
                  type="button"
                  onClick={handleDirectGoogleLink}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 underline font-medium"
                >
                  <span>Still wish to post publicly on Google Reviews?</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={handlePrivateFeedbackSubmit} className="space-y-4">
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5">
                    <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 leading-relaxed">
                      We're sorry we didn't meet your expectations. Send your comments straight to our management so we can resolve this right away.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      What could we have done better? *
                    </label>
                    <textarea
                      required
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      rows={3}
                      placeholder="Tell us what went wrong..."
                      className="w-full text-xs text-slate-800 p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full text-xs text-slate-800 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email or Phone
                      </label>
                      <input
                        type="text"
                        value={customerEmail || customerPhone}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          setCustomerPhone(e.target.value);
                        }}
                        placeholder="To follow up with you"
                        className="w-full text-xs text-slate-800 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingFeedback ? 'Sending...' : 'Send Message Straight to Owner'}</span>
                  </button>
                </form>

                {/* Transparent Google Review Option (Google & FTC Compliance) */}
                <div className="pt-4 border-t border-slate-100 mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleDirectGoogleLink}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                  >
                    <span>Or post an honest public review directly on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RATING 4-5 STARS OR DEFAULT: Suggestion Engine + Google Review */}
        {(!rating || rating >= 4) && (
          <div className="space-y-6 animate-fadeIn">
            {/* Tag Selection Chips */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What did you love most?
                </label>
                <span className="text-[11px] text-slate-400">Select any that apply</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Engine Preset Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Choose Your Review Style</span>
                </div>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Shuffle</span>
                </button>
              </div>

              {/* Vibe Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
                {suggestedReviews.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(idx)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      activeSuggestionIndex === idx
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.vibe}
                  </button>
                ))}
              </div>

              {/* Editable Review Preview Box */}
              <div className="relative">
                <textarea
                  value={customizedReviewText}
                  onChange={(e) => setCustomizedReviewText(e.target.value)}
                  rows={4}
                  className="w-full text-sm text-slate-800 p-3.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none font-normal leading-relaxed"
                  placeholder="Your review will appear here..."
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400">
                  Feel free to edit before copying
                </span>
              </div>
            </div>

            {/* Action: Copy & Open Google Review */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleCopyToGoogle}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>Copied! Opening Google Reviews...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Copy & Open Google Reviews</span>
                    <ExternalLink className="w-4 h-4 opacity-75 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>1-Tap: Copies review & opens Google Review page</span>
                <button
                  type="button"
                  onClick={() => setShowPrivateForm(!showPrivateForm)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                  Send private note instead
                </button>
              </div>
            </div>

            {/* Optional private feedback form if opened */}
            {showPrivateForm && (
              <form onSubmit={handlePrivateFeedbackSubmit} className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-700">Private Message to Owner</p>
                <textarea
                  required
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={2}
                  placeholder="Tell the owner anything privately..."
                  className="w-full text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {submittingFeedback ? 'Sending...' : 'Send Private Note'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-slate-400">
        Powered by{' '}
        <Link to="/" className="font-semibold text-slate-600 hover:text-indigo-600 underline">
          ReviewFlow
        </Link>{' '}
        — FTC & Google Policy Compliant Review Platform
      </div>
    </div>
  );
};
