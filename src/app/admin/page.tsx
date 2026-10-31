"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "./admin.css";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Store,
  Download,
  RefreshCw,
  Search,
  Trash2,
  Mail,
  MessageSquare,
  ExternalLink,
  Check,
  Copy,
  AlertTriangle,
  Database,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  X,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

type ProductItem = {
  id: string;
  name: string;
  slug?: string;
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
};

type OrderItem = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_address: string;
  city?: string;
  pincode?: string | null;
  order_notes?: string | null;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total_amount: number;
  payment_method: string;
  transaction_id?: string | null;
  screenshot_url?: string | null;
  status: string;
  created_at: string;
};

type FeedbackItem = {
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

type SubscriberItem = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

type Stats = {
  totalFeedback: number;
  averageRating: number;
  subscribersCount: number;
  ordersCount: number;
  totalRevenue: number;
  productsCount: number;
  ratingDistribution: Record<number, number>;
  feelingsBreakdown: Record<string, number>;
};

const SQL_SCHEMA = `-- ============================================================
-- OiAI Homemade Chocolates - Full Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ktennsxpuvojtyhbmnxc/sql
-- ============================================================

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null,
  price integer not null default 349,
  category text not null,
  kind text default 'DARK CHOCOLATE',
  tagline text,
  personality text,
  description text,
  ingredients text,
  notes text,
  badge text default 'SMALL BATCH',
  image text not null,
  weight text default 'Box of 6 pieces (120g)',
  rating numeric(2,1) default 4.9,
  review_count integer default 24,
  is_active boolean default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- 2. FEEDBACK TABLE
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  context text default 'Your OiAI story',
  rating integer not null check (rating >= 1 and rating <= 5),
  feelings text[] default '{}',
  message text not null,
  product_id text,
  product_name text,
  page_url text,
  source text default 'oiai-catalogue',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- 3. ORDERS TABLE (UPI & WhatsApp)
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text not null,
  city text default 'Hyderabad',
  pincode text,
  order_notes text,
  items jsonb not null default '[]',
  total_amount integer not null,
  payment_method text default 'UPI',
  transaction_id text,
  screenshot_url text,
  status text not null default 'pending_verification',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- 4. SUBSCRIBERS TABLE
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'oiai-newsletter',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- 5. ROW LEVEL SECURITY (RLS)
alter table public.products enable row level security;
alter table public.feedback enable row level security;
alter table public.orders enable row level security;
alter table public.subscribers enable row level security;

-- Policies for products
create policy "Allow public read on products" on public.products for select to anon, authenticated using (is_active = true);
create policy "Allow service role all on products" on public.products for all to service_role using (true) with check (true);

-- Policies for feedback
create policy "Allow public insert on feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "Allow service role all on feedback" on public.feedback for all to service_role using (true) with check (true);

-- Policies for orders
create policy "Allow public insert on orders" on public.orders for insert to anon, authenticated with check (true);
create policy "Allow service role all on orders" on public.orders for all to service_role using (true) with check (true);

-- Policies for subscribers
create policy "Allow public insert on subscribers" on public.subscribers for insert to anon, authenticated with check (true);
create policy "Allow service role all on subscribers" on public.subscribers for all to service_role using (true) with check (true);`;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "feedback" | "subscribers" | "guide">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [contextFilter, setContextFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Copy feedback state
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Initial Auth Check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkAuthAndLoad(); }, []);

  async function checkAuthAndLoad() {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoadingData(false);
        return;
      }
      setIsAuthenticated(true);
      const data = await res.json();
      if (data.tableMissing) {
        setTableMissing(true);
      } else {
        setStats(data.stats);
      }
      await Promise.all([loadProducts(), loadOrders(), loadFeedbacks(), loadSubscribers()]);
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        if (data.tableMissing) setTableMissing(true);
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed loading products", e);
    }
  }

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.tableMissing) setTableMissing(true);
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Failed loading orders", e);
    }
  }

  async function loadFeedbacks() {
    try {
      const res = await fetch("/api/admin/feedback");
      if (res.ok) {
        const data = await res.json();
        if (data.tableMissing) setTableMissing(true);
        setFeedbacks(data.feedback || []);
      }
    } catch (e) {
      console.error("Failed loading feedback", e);
    }
  }

  async function loadSubscribers() {
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const data = await res.json();
        if (data.tableMissing) setTableMissing(true);
        setSubscribers(data.subscribers || []);
      }
    } catch (e) {
      console.error("Failed loading subscribers", e);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Incorrect admin password.");
      } else {
        setIsAuthenticated(true);
        setPasswordInput("");
        await checkAuthAndLoad();
      }
    } catch {
      setLoginError("Could not connect to authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
    }
  }

  // Save product changes
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = data.product || editingProduct;
        setProducts((prev) => {
          const index = prev.findIndex((p) => p.id === updated.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updated;
            return next;
          }
          return [...prev, updated];
        });
        setEditingProduct(null);
        alert("Product saved successfully!");
      } else {
        alert(data.error || "Could not save product.");
      }
    } catch {
      alert("Error saving product.");
    } finally {
      setIsSavingProduct(false);
    }
  }

  // Seed default products
  async function handleSeedProducts() {
    if (!confirm("This will populate Supabase with the 9 standard OiAI homemade chocolate items. Continue?")) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: true }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully seeded ${data.count || 9} chocolates into Supabase!`);
        await loadProducts();
      } else {
        alert(data.error || "Could not seed products. Check if the 'products' table exists in Supabase.");
      }
    } catch {
      alert("Error seeding products.");
    }
  }

  // Update order status
  async function handleUpdateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Could not update order status.");
      }
    } catch {
      alert("Error updating order status.");
    }
  }

  // Delete order
  async function handleDeleteOrder(id: string) {
    if (!confirm("Are you sure you want to delete this order record?")) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert("Could not delete order.");
      }
    } catch {
      alert("Error deleting order.");
    }
  }

  // Delete feedback
  async function handleDeleteFeedback(id: string) {
    if (!confirm("Are you sure you want to delete this feedback note?")) return;
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Could not delete item.");
      }
    } catch {
      alert("Error deleting feedback item.");
    }
  }

  // Delete subscriber
  async function handleDeleteSubscriber(id: string) {
    if (!confirm("Remove this email subscriber?")) return;
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("Could not remove subscriber.");
      }
    } catch {
      alert("Error removing subscriber.");
    }
  }

  function copySchema() {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  }

  function copyAllEmails() {
    const emailList = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  }

  function exportFeedbacksCsv() {
    if (!feedbacks.length) return;
    const headers = ["ID", "Name", "Email", "Context", "Rating", "Feelings", "Message", "Product", "Date"];
    const rows = feedbacks.map((f) => [
      f.id,
      `"${f.name.replace(/"/g, '""')}"`,
      `"${f.email.replace(/"/g, '""')}"`,
      `"${(f.context || "").replace(/"/g, '""')}"`,
      f.rating,
      `"${(f.feelings || []).join(", ").replace(/"/g, '""')}"`,
      `"${(f.message || "").replace(/"/g, '""')}"`,
      `"${(f.product_name || "").replace(/"/g, '""')}"`,
      `"${new Date(f.created_at).toLocaleString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `oiai-feedback-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!productSearch) return true;
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [products, productSearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchSearch =
        searchQuery === "" ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_phone.includes(searchQuery) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.transaction_id && o.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, searchQuery]);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchSearch =
        searchQuery === "" ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.product_name && f.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRating = ratingFilter === "all" || f.rating.toString() === ratingFilter;
      const matchContext = contextFilter === "all" || f.context === contextFilter;

      return matchSearch && matchRating && matchContext;
    });
  }, [feedbacks, searchQuery, ratingFilter, contextFilter]);

  // Available contexts for filter
  const availableContexts = useMemo(() => {
    const set = new Set<string>();
    feedbacks.forEach((f) => {
      if (f.context) set.add(f.context);
    });
    return Array.from(set);
  }, [feedbacks]);

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="admin-login-wrapper">
        <div style={{ color: "#c6a15b", display: "flex", alignItems: "center", gap: 10 }}>
          <RefreshCw className="spin" size={20} />
          <span>Verifying studio credentials…</span>
        </div>
      </div>
    );
  }

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-brand">Oi</div>
          <h1>OiAI Admin Studio</h1>
          <p>Enter your administrative password to access products, orders, and customer feedback operations.</p>

          {loginError && (
            <div className="admin-alert-error" role="alert">
              <AlertTriangle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label htmlFor="admin-pass">Studio Password</label>
              <div className="admin-input-wrap">
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  className="admin-input"
                  placeholder="Enter studio password…"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="admin-input-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-login-btn" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Unlock Studio Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-hint">
            Protected by <code style={{ color: "#c6a15b" }}>ADMIN_PASSWORD</code>. Configure your password in <code>.env.local</code> or Vercel environment variables.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-header-title">
            <span>OiAI Atelier Studio</span>
            <h2>Products, Orders &amp; Operations</h2>
          </div>
          <div className="admin-badges-row">
            <span className={`admin-badge ${tableMissing ? "admin-badge-warning" : "admin-badge-success"}`}>
              <span className="admin-dot" />
              {tableMissing ? "Supabase (Tables Pending)" : "Supabase Live"}
            </span>
            <span className="admin-badge admin-badge-neutral">
              <Lock size={11} /> Password Secured
            </span>
          </div>
        </div>

        <div className="admin-header-actions">
          <Link href="/" className="admin-btn-outline" target="_blank">
            <Store size={14} /> Storefront
          </Link>
          <button onClick={handleLogout} className="admin-btn-danger" type="button">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <main className="admin-container">
        {/* SETUP WARNING BANNER */}
        {tableMissing && (
          <div className="admin-alert-banner">
            <div className="admin-alert-banner-header">
              <AlertTriangle size={20} />
              <span>Action Required: Initialize Supabase Database Tables</span>
            </div>
            <p>
              Your Supabase credentials are connected (Project: <strong>ktennsxpuvojtyhbmnxc</strong>), but tables haven&apos;t been created yet in PostgreSQL. Run the schema script in your Supabase SQL Editor to enable live storage.
            </p>
            <div className="admin-alert-actions">
              <button onClick={copySchema} className="admin-btn-gold" type="button">
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? "SQL Schema Copied!" : "Copy SQL Schema"}</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/ktennsxpuvojtyhbmnxc/sql"
                target="_blank"
                rel="noreferrer"
                className="admin-btn-outline"
              >
                <span>Open Supabase SQL Editor</span> <ExternalLink size={13} />
              </a>
              <button onClick={checkAuthAndLoad} className="admin-btn-outline" type="button">
                <RefreshCw size={13} /> Refresh Check
              </button>
            </div>
          </div>
        )}

        {/* METRICS / STATS CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-label">
              <span>Orders Placed</span>
              <ShoppingBag size={16} />
            </div>
            <div className="admin-stat-value">{orders.length}</div>
            <div className="admin-stat-sub">Customer UPI orders</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-label">
              <span>Total Revenue</span>
              <span style={{ color: "#c6a15b", fontWeight: 700 }}>₹</span>
            </div>
            <div className="admin-stat-value">
              ₹{orders.reduce((acc, o) => acc + (o.total_amount || 0), 0).toLocaleString("en-IN")}
            </div>
            <div className="admin-stat-sub">Received &amp; pending</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-label">
              <span>Chocolate Menu</span>
              <Package size={16} />
            </div>
            <div className="admin-stat-value">{products.length}</div>
            <div className="admin-stat-sub">Items in catalogue</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-label">
              <span>Taste Notes</span>
              <MessageSquare size={16} />
            </div>
            <div className="admin-stat-value">{stats ? stats.totalFeedback : feedbacks.length}</div>
            <div className="admin-stat-sub">Customer reviews</div>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={15} />
            <span>Products</span>
            <span className="admin-tab-count">{products.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={15} />
            <span>Orders</span>
            <span className="admin-tab-count">{orders.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <MessageSquare size={15} />
            <span>Customer Feedback</span>
            <span className="admin-tab-count">{feedbacks.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "subscribers" ? "active" : ""}`}
            onClick={() => setActiveTab("subscribers")}
          >
            <Mail size={15} />
            <span>Newsletter Subscribers</span>
            <span className="admin-tab-count">{subscribers.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            <Database size={15} />
            <span>Supabase &amp; Vercel Config</span>
          </button>
        </div>

        {/* ================= TAB 1: PRODUCTS ================= */}
        {activeTab === "products" && (
          <section>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="admin-search-wrap">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search chocolate items…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-toolbar-right">
                <button onClick={handleSeedProducts} className="admin-btn-outline" type="button" title="Seed default chocolate items into Supabase">
                  <Database size={13} />
                  <span>Seed Standard Menu</span>
                </button>
                <button
                  onClick={() =>
                    setEditingProduct({
                      id: String(Date.now()),
                      name: "",
                      slug: "",
                      price: 349,
                      category: "Filled Centres",
                      kind: "DARK CHOCOLATE",
                      tagline: "",
                      description: "",
                      ingredients: "",
                      notes: "",
                      badge: "HANDMADE",
                      image: "/images/oiai/photo-milkPralines-02cd3864aed0.jpg",
                      weight: "Box of 6 pieces (120g)",
                      is_active: true,
                    })
                  }
                  className="admin-btn-gold"
                  type="button"
                >
                  <Plus size={14} />
                  <span>Add Chocolate Item</span>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="admin-empty-state">
                <Package size={40} />
                <h4>No chocolates found</h4>
                <p>Click &quot;Seed Standard Menu&quot; to import the 9 default handcrafted chocolates into your database.</p>
              </div>
            ) : (
              <div className="admin-products-grid">
                {filteredProducts.map((p) => (
                  <div className="admin-product-card" key={p.id}>
                    <div className="admin-product-img-wrap">
                      <img src={p.image} alt={p.name} className="admin-product-img" />
                      <span className={`admin-product-status-pill ${p.is_active !== false ? "active" : "inactive"}`}>
                        {p.is_active !== false ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <div className="admin-product-body">
                      <span className="admin-product-category">{p.category || p.kind}</span>
                      <h4 className="admin-product-title">{p.name}</h4>
                      <p className="admin-product-desc">{p.description || p.tagline}</p>
                      <div className="admin-product-footer">
                        <div className="admin-product-price">
                          ₹{p.price}
                          <small>{p.weight || ""}</small>
                        </div>
                        <button
                          type="button"
                          className="admin-btn-outline"
                          onClick={() => setEditingProduct(p)}
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 2: ORDERS ================= */}
        {activeTab === "orders" && (
          <section>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="admin-search-wrap">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search by name, phone, order ID, UTR…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="admin-select"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">All Order Statuses</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button onClick={loadOrders} className="admin-btn-outline" type="button">
                  <RefreshCw size={13} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty-state">
                <ShoppingBag size={40} />
                <h4>No orders found</h4>
                <p>When customers order chocolates through UPI checkout, they will appear here in real time.</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {filteredOrders.map((o) => {
                  const cleanPhone = o.customer_phone.replace(/\D/g, "");
                  const intlPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                  const waText = encodeURIComponent(
                    `Hi ${o.customer_name}! 🍫 This is OiAI Homemade Chocolates regarding your order ${o.id}. Status: ${o.status.toUpperCase()}. Thank you!`
                  );
                  return (
                    <div className="admin-order-card" key={o.id}>
                      <div className="admin-order-header">
                        <div className="admin-order-id-group">
                          <span className="admin-order-id">{o.id}</span>
                          <span className="admin-order-date">
                            <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                            {new Date(o.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <span className={`admin-order-status-badge admin-status-${o.status}`}>
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="admin-order-grid">
                        <div className="admin-order-info-section">
                          <h5>Customer Details</h5>
                          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#f6f0e6" }}>{o.customer_name}</p>
                          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#ad9a89" }}>
                            <Phone size={12} style={{ display: "inline", marginRight: 6 }} />
                            {o.customer_phone}
                          </p>
                          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#ad9a89" }}>
                            <MapPin size={12} style={{ display: "inline", marginRight: 6 }} />
                            {o.delivery_address}
                          </p>
                          {o.transaction_id && (
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#c6a15b" }}>
                              <strong>UTR / TX ID:</strong> <code>{o.transaction_id}</code>
                            </p>
                          )}
                        </div>

                        <div className="admin-order-info-section">
                          <h5>Order Items</h5>
                          <div className="admin-order-items-list">
                            {(Array.isArray(o.items) ? o.items : []).map((item, idx) => (
                              <div className="admin-order-item-row" key={idx}>
                                <span>{item.name} × {item.quantity}</span>
                                <span>₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="admin-order-total-row">
                            <span>Total Amount</span>
                            <span style={{ color: "#c6a15b" }}>₹{o.total_amount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="admin-order-actions-bar">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, color: "#ad9a89" }}>Update Status:</span>
                          <select
                            className="admin-select"
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            style={{ height: 32, fontSize: 12 }}
                          >
                            <option value="pending_verification">Pending Verification</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <a
                            href={`https://wa.me/${intlPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-whatsapp-btn"
                          >
                            <Phone size={13} />
                            <span>WhatsApp Customer</span>
                          </a>
                          <button
                            type="button"
                            className="admin-btn-icon-danger"
                            onClick={() => handleDeleteOrder(o.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 3: FEEDBACK ================= */}
        {activeTab === "feedback" && (
          <section>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="admin-search-wrap">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search notes, names, emails, products…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="admin-select"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Star Ratings</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars only</option>
                  <option value="3">3 Stars only</option>
                  <option value="2">2 Stars only</option>
                  <option value="1">1 Star only</option>
                </select>

                <select
                  className="admin-select"
                  value={contextFilter}
                  onChange={(e) => setContextFilter(e.target.value)}
                >
                  <option value="all">All Story Contexts</option>
                  {availableContexts.map((ctx) => (
                    <option key={ctx} value={ctx}>
                      {ctx}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-toolbar-right">
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={exportFeedbacksCsv}
                  disabled={!feedbacks.length}
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={loadFeedbacks}
                  title="Refresh list"
                >
                  <RefreshCw size={13} className={isLoadingData ? "spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {filteredFeedbacks.length === 0 ? (
              <div className="admin-empty-state">
                <MessageSquare size={40} />
                <h4>No feedback notes found</h4>
                <p>Try clearing your search query or filter selections.</p>
              </div>
            ) : (
              <div className="admin-feedbacks">
                {filteredFeedbacks.map((f) => (
                  <article className="admin-feedback-card" key={f.id}>
                    <div className="admin-feedback-top">
                      <div className="admin-feedback-user">
                        <span className="admin-feedback-name">
                          {f.name}
                          {f.context && (
                            <span className="admin-feedback-context-badge">{f.context}</span>
                          )}
                          {f.product_name && (
                            <span className="admin-feedback-context-badge" style={{ color: "#c6a15b" }}>
                              {f.product_name}
                            </span>
                          )}
                        </span>
                        <span className="admin-feedback-email">{f.email}</span>
                      </div>

                      <div className="admin-feedback-rating">
                        {"★".repeat(f.rating)}
                        {"☆".repeat(5 - f.rating)}
                      </div>
                    </div>

                    {f.feelings && f.feelings.length > 0 && (
                      <div className="admin-feelings-row">
                        {f.feelings.map((feeling) => (
                          <span className="admin-feeling-tag" key={feeling}>
                            {feeling}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="admin-feedback-msg">{f.message}</p>

                    <div className="admin-feedback-footer">
                      <span className="admin-feedback-date">
                        {new Date(f.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <button
                        type="button"
                        className="admin-btn-icon-danger"
                        onClick={() => handleDeleteFeedback(f.id)}
                        title="Delete taste note"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 4: SUBSCRIBERS ================= */}
        {activeTab === "subscribers" && (
          <section>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <span style={{ fontSize: 14, color: "#ad9a89" }}>
                  <strong>{subscribers.length}</strong> total registered subscribers
                </span>
              </div>

              <div className="admin-toolbar-right">
                <button
                  type="button"
                  className="admin-btn-gold"
                  onClick={copyAllEmails}
                  disabled={!subscribers.length}
                >
                  {copiedEmails ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedEmails ? "Emails Copied!" : "Copy All Emails"}</span>
                </button>

                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={loadSubscribers}
                  title="Refresh list"
                >
                  <RefreshCw size={13} className={isLoadingData ? "spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {subscribers.length === 0 ? (
              <div className="admin-empty-state">
                <Mail size={40} />
                <h4>No subscribers yet</h4>
                <p>When customers subscribe through the newsletter footer, their email will appear here.</p>
              </div>
            ) : (
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Acquired Via</th>
                      <th>Subscribed On</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{s.email}</td>
                        <td>
                          <span className="admin-badge admin-badge-neutral">{s.source}</span>
                        </td>
                        <td style={{ color: "#ad9a89" }}>
                          {new Date(s.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="admin-btn-icon-danger"
                            onClick={() => handleDeleteSubscriber(s.id)}
                            title="Remove subscriber"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 5: GUIDE & CONFIG ================= */}
        {activeTab === "guide" && (
          <section>
            <div className="admin-guide-card">
              <h3>1. Supabase Database Setup</h3>
              <p>
                To enable permanent storage for chocolate products, UPI orders, customer reviews, and subscribers, execute the SQL schema below in your Supabase project (<strong>ktennsxpuvojtyhbmnxc</strong>).
              </p>
              <div className="admin-code-block">
                <button type="button" onClick={copySchema} className="admin-copy-code-btn">
                  {copiedSql ? "Copied!" : "Copy SQL"}
                </button>
                <pre>{SQL_SCHEMA}</pre>
              </div>
              <a
                href="https://supabase.com/dashboard/project/ktennsxpuvojtyhbmnxc/sql"
                target="_blank"
                rel="noreferrer"
                className="admin-btn-gold"
              >
                <span>Open Supabase SQL Editor</span> <ExternalLink size={14} />
              </a>
            </div>

            <div className="admin-guide-card">
              <h3>2. Vercel Environment Variables</h3>
              <p>
                When deploying to Vercel, configure the following variables in your <strong>Vercel Project Settings &rarr; Environment Variables</strong>:
              </p>
              <div className="admin-code-block">
                <pre>{`NEXT_PUBLIC_SUPABASE_URL = your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-supabase-service-role-key
ADMIN_PASSWORD = your-chosen-admin-password`}</pre>
              </div>
              <p>
                The <code>ADMIN_PASSWORD</code> is the password you enter to unlock this dashboard. You can set it to any secure password you prefer.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* ================= PRODUCT EDIT MODAL ================= */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct.id ? `Edit ${editingProduct.name}` : "New Chocolate Piece"}</h3>
              <button
                type="button"
                className="admin-input-btn"
                onClick={() => setEditingProduct(null)}
                style={{ position: "static" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-login-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Chocolate Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Price (INR ₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    className="admin-input"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    <option value="Filled Centres">Filled Centres</option>
                    <option value="Crunch & Crisps">Crunch &amp; Crisps</option>
                    <option value="Milk & Marble">Milk &amp; Marble</option>
                    <option value="Plain Dark">Plain Dark</option>
                    <option value="Nutty Packs">Nutty Packs</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Weight / Packaging</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingProduct.weight || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    placeholder="Box of 6 pieces (120g)"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tagline / Motto</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingProduct.tagline || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="e.g. A little nut. A lot of feelings."
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  className="admin-input"
                  style={{ height: 75, padding: "10px 14px", resize: "vertical" }}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Ingredients</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingProduct.ingredients || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingProduct.image || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  />
                  <span>Active &amp; Visible in Storefront</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                <button type="submit" className="admin-btn-gold" style={{ flex: 1 }} disabled={isSavingProduct}>
                  {isSavingProduct ? "Saving Changes…" : "Save Product ✓"}
                </button>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
