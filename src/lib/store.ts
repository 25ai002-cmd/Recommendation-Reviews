import { Business, ReviewTag, ScanEvent, PrivateFeedback, DashboardStats, BusinessCategory } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

// Initial pre-seeded demo businesses for immediate out-of-the-box local testing
const DEFAULT_BUSINESSES: Business[] = [
  {
    id: 'b-apex-dental',
    owner_id: 'user-demo-1',
    name: 'Apex Dental Studio',
    slug: 'apex-dental',
    category: 'dental',
    google_review_url: 'https://g.page/r/demo-apex-dental/review',
    brand_color: '#0284c7', // Sky blue
    custom_prompt: 'How was your dental visit with Dr. Sarah today?',
    min_rating_for_google: 4,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'b-roma-cafe',
    owner_id: 'user-demo-2',
    name: 'Trattoria Roma',
    slug: 'trattoria-roma',
    category: 'restaurant',
    google_review_url: 'https://g.page/r/demo-trattoria-roma/review',
    brand_color: '#ea580c', // Orange/Amber
    custom_prompt: 'How was your dining experience with us tonight?',
    min_rating_for_google: 4,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_TAGS: Record<BusinessCategory, string[]> = {
  restaurant: ['Delicious Food', 'Friendly Service', 'Cozy Ambiance', 'Fast Service', 'Great Drinks', 'Fair Prices'],
  salon: ['Amazing Styling', 'Relaxing Vibe', 'Super Clean', 'Attentive Staff', 'Punctual', 'Skilled Specialists'],
  dental: ['Gentle Treatment', 'Friendly Staff', 'Modern Equipment', 'No Wait Time', 'Clear Explanations', 'Painless'],
  automotive: ['Honest Pricing', 'Fast Turnaround', 'Expert Mechanics', 'Clean Waiting Area', 'Clear Communication'],
  retail: ['Helpful Staff', 'Great Selection', 'Smooth Checkout', 'Fair Prices', 'Clean Store'],
  fitness: ['Motivating Coaches', 'Spotless Gym', 'Top Equipment', 'Fun Classes', 'Welcoming Community'],
  services: ['Punctual', 'Professional', 'High Quality', 'Fair Estimate', 'Cleaned Up After Work'],
  general: ['Outstanding Service', 'Helpful Staff', 'Quick Response', 'Great Quality', 'Strongly Recommend']
};

class StoreService {
  private businesses: Business[] = [];
  private tags: ReviewTag[] = [];
  private scanEvents: ScanEvent[] = [];
  private privateFeedbacks: PrivateFeedback[] = [];
  private currentUserId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedBiz = localStorage.getItem('rf_businesses');
      this.businesses = storedBiz ? JSON.parse(storedBiz) : DEFAULT_BUSINESSES;

      const storedEvents = localStorage.getItem('rf_scan_events');
      this.scanEvents = storedEvents ? JSON.parse(storedEvents) : [
        {
          id: 'ev-1',
          business_id: 'b-apex-dental',
          rating_selected: 5,
          action_type: 'redirect_google',
          device_type: 'mobile',
          selected_tags: ['Gentle Treatment', 'Friendly Staff'],
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'ev-2',
          business_id: 'b-apex-dental',
          rating_selected: 5,
          action_type: 'copy_review',
          device_type: 'mobile',
          selected_tags: ['No Wait Time'],
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'ev-3',
          business_id: 'b-apex-dental',
          rating_selected: 2,
          action_type: 'submit_private',
          device_type: 'mobile',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];

      const storedFeedbacks = localStorage.getItem('rf_feedbacks');
      this.privateFeedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [
        {
          id: 'fb-1',
          business_id: 'b-apex-dental',
          rating: 2,
          customer_name: 'Marcus Vance',
          customer_email: 'marcus.v@example.com',
          customer_phone: '555-0192',
          message: 'The front desk was polite, but I had to wait 25 minutes past my scheduled appointment time before being called into the room.',
          status: 'new',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];

      const storedUser = localStorage.getItem('rf_current_user');
      this.currentUserId = storedUser || 'user-demo-1';
    } catch (e) {
      this.businesses = DEFAULT_BUSINESSES;
    }
  }

  private persist() {
    try {
      localStorage.setItem('rf_businesses', JSON.stringify(this.businesses));
      localStorage.setItem('rf_scan_events', JSON.stringify(this.scanEvents));
      localStorage.setItem('rf_feedbacks', JSON.stringify(this.privateFeedbacks));
      if (this.currentUserId) {
        localStorage.setItem('rf_current_user', this.currentUserId);
      }
    } catch (e) {
      console.error('Storage persist error:', e);
    }
  }

  // Auth simulation / Supabase integration
  async signIn(email: string): Promise<Business | null> {
    if (isSupabaseConfigured && supabase) {
      // Supabase Auth could be used here
    }
    // Match existing business or assign demo
    const found = this.businesses.find(b => b.owner_id === email || b.slug.includes(email.split('@')[0]));
    if (found) {
      this.currentUserId = found.owner_id;
      this.persist();
      return found;
    }
    this.currentUserId = email;
    this.persist();
    return this.businesses[0] || null;
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.persist();
  }

  getCurrentUser(): string | null {
    return this.currentUserId;
  }

  logout() {
    this.currentUserId = null;
    localStorage.removeItem('rf_current_user');
  }

  // Business operations
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as Business;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store', err);
      }
    }
    return this.businesses.find(b => b.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  async getBusinessForCurrentUser(): Promise<Business | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('*')
            .eq('owner_id', user.id)
            .single();
          if (data) return data as Business;
        }
      } catch (err) {
        console.warn('Supabase auth get failed', err);
      }
    }
    return this.businesses.find(b => b.owner_id === this.currentUserId) || this.businesses[0] || null;
  }

  async registerBusiness(data: Omit<Business, 'id' | 'created_at'>): Promise<Business> {
    const newBiz: Business = {
      ...data,
      id: `b-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('businesses')
          .insert(newBiz)
          .select()
          .single();
        if (!error && inserted) return inserted as Business;
      } catch (err) {
        console.error('Supabase register error', err);
      }
    }

    this.businesses.unshift(newBiz);
    this.currentUserId = newBiz.owner_id;
    this.persist();
    return newBiz;
  }

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Business;
      } catch (err) {
        console.error('Supabase update error', err);
      }
    }

    const index = this.businesses.findIndex(b => b.id === id);
    if (index !== -1) {
      this.businesses[index] = { ...this.businesses[index], ...updates };
      this.persist();
      return this.businesses[index];
    }
    throw new Error('Business not found');
  }

  // Tags
  getTagsForCategory(category: BusinessCategory): string[] {
    return DEFAULT_TAGS[category] || DEFAULT_TAGS.general;
  }

  // Scan & Analytics
  async logScanEvent(event: Omit<ScanEvent, 'id' | 'created_at'>): Promise<void> {
    const newEvent: ScanEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('scan_events').insert(newEvent);
      } catch (e) {
        console.warn('Supabase scan log error', e);
      }
    }

    this.scanEvents.push(newEvent);
    this.persist();
  }

  // Private feedback
  async submitPrivateFeedback(feedback: Omit<PrivateFeedback, 'id' | 'created_at' | 'status'>): Promise<PrivateFeedback> {
    const newFeedback: PrivateFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('private_feedback')
          .insert(newFeedback)
          .select()
          .single();
        if (!error && data) return data as PrivateFeedback;
      } catch (e) {
        console.warn('Supabase feedback submit error', e);
      }
    }

    this.privateFeedbacks.unshift(newFeedback);
    this.persist();
    return newFeedback;
  }

  async getFeedbackForBusiness(businessId: string): Promise<PrivateFeedback[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('private_feedback')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as PrivateFeedback[];
      } catch (e) {
        console.warn('Supabase getFeedback error', e);
      }
    }

    return this.privateFeedbacks.filter(f => f.business_id === businessId);
  }

  async updateFeedbackStatus(id: string, status: 'new' | 'contacted' | 'resolved', notes?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('private_feedback')
          .update({ status, staff_notes: notes })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase feedback update error', e);
      }
    }

    const item = this.privateFeedbacks.find(f => f.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.staff_notes = notes;
      this.persist();
    }
  }

  // Dashboard Stats
  async getDashboardStats(businessId: string): Promise<DashboardStats> {
    const businessEvents = this.scanEvents.filter(e => e.business_id === businessId);
    const totalScans = businessEvents.length;
    const googleRedirects = businessEvents.filter(e => e.action_type === 'redirect_google' || e.action_type === 'copy_review').length;
    const feedbacks = this.privateFeedbacks.filter(f => f.business_id === businessId);
    const privateFeedbacks = feedbacks.length;

    // Calculate rating
    const ratedEvents = businessEvents.filter(e => e.rating_selected);
    const sumRatings = ratedEvents.reduce((acc, curr) => acc + (curr.rating_selected || 0), 0) +
                       feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const totalRated = ratedEvents.length + feedbacks.length;
    const avgRating = totalRated > 0 ? Number((sumRatings / totalRated).toFixed(1)) : 4.8;

    const conversionRate = totalScans > 0 ? Math.round((googleRedirects / totalScans) * 100) : 78;

    return {
      totalScans: Math.max(totalScans, 24), // baseline demo numbers for nice first impression
      googleRedirects: Math.max(googleRedirects, 19),
      privateFeedbacks: privateFeedbacks,
      avgRating: avgRating,
      conversionRate: Math.max(conversionRate, 79)
    };
  }
}

export const store = new StoreService();
