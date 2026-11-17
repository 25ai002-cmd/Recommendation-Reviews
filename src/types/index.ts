export type BusinessCategory = 
  | 'restaurant'
  | 'salon'
  | 'dental'
  | 'automotive'
  | 'retail'
  | 'fitness'
  | 'services'
  | 'general';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  google_review_url: string;
  google_place_id?: string;
  logo_url?: string;
  brand_color: string;
  custom_prompt?: string;
  min_rating_for_google: number;
  is_active: boolean;
  created_at: string;
}

export interface ReviewTag {
  id: string;
  business_id?: string | null;
  label: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export interface ReviewTemplate {
  id: string;
  business_id?: string | null;
  category: string;
  vibe: 'enthusiastic' | 'concise' | 'detailed' | 'friendly';
  template_text: string;
}

export interface ScanEvent {
  id: string;
  business_id: string;
  rating_selected?: number | null;
  action_type: 'scan' | 'copy_review' | 'redirect_google' | 'submit_private';
  device_type?: string;
  selected_tags?: string[];
  created_at: string;
}

export interface PrivateFeedback {
  id: string;
  business_id: string;
  rating: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  staff_notes?: string;
  created_at: string;
}

export interface DashboardStats {
  totalScans: number;
  googleRedirects: number;
  privateFeedbacks: number;
  avgRating: number;
  conversionRate: number;
}
