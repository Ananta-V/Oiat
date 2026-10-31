import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for client-side interactions
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-anon-key");

// Server-side admin client with service_role privilege
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) {
    throw new Error("Supabase key is missing. Please configure SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  adminClient = createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  kind?: string;
  tagline?: string;
  personality?: string;
  description?: string;
  ingredients?: string;
  notes?: string;
  badge?: string;
  image: string;
  weight?: string;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FeedbackRecord = {
  id: string;
  name: string;
  email: string;
  context: string;
  rating: number;
  feelings: string[];
  message: string;
  product_id?: string | null;
  product_name?: string | null;
  page_url?: string | null;
  source: string;
  created_at: string;
};

export type OrderRecord = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_address: string;
  city?: string | null;
  pincode?: string | null;
  order_notes?: string | null;
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total_amount: number;
  payment_method: string;
  transaction_id?: string | null;
  screenshot_url?: string | null;
  status: "pending_verification" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  created_at: string;
};

export type SubscriberRecord = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};
