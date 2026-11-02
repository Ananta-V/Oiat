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
  MessageSquare,
  Check,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  X,
  Phone,
  Tag,
  Upload,
  Layers,
  Settings,
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
  context?: string | null;
  rating: number;
  feelings?: string[] | null;
  message: string;
  product_id?: string | null;
  product_name?: string | null;
  created_at: string;
};

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalFeedback: number;
  averageRating: string;
};

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
  const [stats, setStats] = useState<Stats | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "feedback" | "settings">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [contextFilter, setContextFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Site settings state (Footer contact links)
  const [siteSettings, setSiteSettings] = useState({
    whatsapp: "+91 81251 07227",
    instagram: "@oiai.chocolates",
    email: "hello@oiaichocolates.com",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productModalTab, setProductModalTab] = useState<"card" | "detail">("card");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Category management state
  const [showCategoryMgr, setShowCategoryMgr] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [renameFromCat, setRenameFromCat] = useState("");
  const [renameToCat, setRenameToCat] = useState("");
  const [isRenamingCat, setIsRenamingCat] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Order viewing modal state
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);

  // Load custom categories from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("oiai-admin-categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCustomCategories(parsed);
      }
    } catch (_) {}
  }, []);

  // Initial Auth Check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkAuthAndLoad(); }, []);

  // Auto-refresh admin data every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      loadProducts();
      loadOrders();
      loadFeedbacks();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
      await Promise.all([loadProducts(), loadOrders(), loadFeedbacks(), loadSettings()]);
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  }

  async function loadSettings() {
    try {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      if (data && (data.whatsapp || data.instagram || data.email)) {
        setSiteSettings({
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          email: data.email || "",
        });
      }
    } catch (e) {
      console.error("Failed loading site settings", e);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSavedMessage("");
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to save settings: " + (data.error || "Unknown error"));
      } else {
        setSettingsSavedMessage("Footer links updated successfully! They will appear immediately on the storefront.");
        setTimeout(() => setSettingsSavedMessage(""), 5000);
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products.filter((p: any) => p.category !== "__settings__" && p.id !== "site_settings"));
      }
    } catch (e) {
      console.error("Failed loading products", e);
    }
  }

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Failed loading orders", e);
    }
  }

  async function loadFeedbacks() {
    try {
      const res = await fetch("/api/admin/feedback");
      const data = await res.json();
      if (data.feedback) {
        setFeedbacks(data.feedback);
      }
    } catch (e) {
      console.error("Failed loading feedback", e);
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
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      setPasswordInput("");
      await checkAuthAndLoad();
    } catch {
      setLoginError("Could not verify password. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  }

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

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save product");
        return;
      }

      await loadProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Error saving product changes");
    } finally {
      setIsSavingProduct(false);
    }
  }

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
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder({ ...viewingOrder, status: newStatus });
        }
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  }

  async function handleDeleteFeedback(id: string) {
    if (!confirm("Permanently delete this taste note?")) return;
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (e) {
      console.error("Failed deleting feedback", e);
    }
  }

  function handleDeviceImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = String(event.target?.result || "");
        setEditingProduct({ ...editingProduct, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCreateCategory() {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      alert("Please enter a category name");
      return;
    }
    if (allCategories.includes(trimmed)) {
      alert(`Category "${trimmed}" already exists.`);
      return;
    }
    const updated = [...customCategories, trimmed];
    setCustomCategories(updated);
    try {
      localStorage.setItem("oiai-admin-categories", JSON.stringify(updated));
    } catch (_) {}
    setNewCatName("");
    alert(`Category "${trimmed}" created! You can now select it when adding or editing products.`);
  }

  async function handleRenameCategory() {
    const from = renameFromCat.trim();
    const to = renameToCat.trim();
    if (!from || !to) {
      alert("Please select a category and enter the new name.");
      return;
    }
    if (from === to) {
      alert("Old and new category names are the same.");
      return;
    }
    setIsRenamingCat(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renameCategory: { from, to },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed renaming category");
      }

      // Update customCategories in state & local storage
      const updatedCats = customCategories.map((c) => (c === from ? to : c));
      if (!updatedCats.includes(to)) updatedCats.push(to);
      setCustomCategories(updatedCats);
      try {
        localStorage.setItem("oiai-admin-categories", JSON.stringify(updatedCats));
      } catch (_) {}

      await loadProducts();
      setRenameFromCat("");
      setRenameToCat("");
      alert(`Renamed category "${from}" to "${to}" across ${data.count || 0} product(s).`);
    } catch (e: any) {
      console.error("Rename failed", e);
      alert(e.message || "Could not rename category.");
    } finally {
      setIsRenamingCat(false);
    }
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

  // All distinct categories (products + standard menu + custom categories)
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category.trim());
    });
    ["Filled Centres", "Crunch & Crisps", "Milk & Marble", "Plain Dark", "Nutty Packs"].forEach((c) => cats.add(c));
    customCategories.forEach((c) => {
      if (c && c.trim()) cats.add(c.trim());
    });
    return Array.from(cats);
  }, [products, customCategories]);

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
      if (!matchStatus) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
        (o.transaction_id && o.transaction_id.toLowerCase().includes(q))
      );
    });
  }, [orders, orderStatusFilter, searchQuery]);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchRating = ratingFilter === "all" || String(f.rating) === ratingFilter;
      const matchContext = contextFilter === "all" || (f.context || "general") === contextFilter;
      if (!matchRating || !matchContext) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q) ||
        (f.product_name && f.product_name.toLowerCase().includes(q))
      );
    });
  }, [feedbacks, ratingFilter, contextFilter, searchQuery]);

  // Loading Screen
  if (isAuthenticated === null || isLoadingData) {
    return (
      <div className="admin-login-wrapper">
        <div style={{ textAlign: "center" }}>
          <div className="admin-login-brand" style={{ animation: "pulse 1.5s infinite" }}>
            OiAI
          </div>
          <p style={{ marginTop: 16, color: "#dfc58b", fontSize: 14 }}>Connecting to OiAI Studio…</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-brand">OiAI</div>
          <h1 className="admin-login-title">Atelier Admin Access</h1>
          <p className="admin-login-subtitle">
            Manage your homemade chocolate catalogue, view customer orders &amp; verify payments.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label>Admin Passcode</label>
              <div className="admin-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-input"
                  placeholder="Enter admin password…"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="admin-input-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && <div className="admin-error-box">{loginError}</div>}

            <button type="submit" className="admin-btn-gold" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <RefreshCw size={15} className="admin-spin" />
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

        {/* TABS - Strictly 3 Tabs */}
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
            className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={15} />
            <span>Footer Links</span>
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

                <button
                  type="button"
                  className={`admin-btn-outline ${showCategoryMgr ? "active" : ""}`}
                  onClick={() => setShowCategoryMgr(!showCategoryMgr)}
                >
                  <Tag size={13} />
                  <span>Manage Categories ({allCategories.length})</span>
                </button>
              </div>

              <div className="admin-toolbar-right">
                <button
                  onClick={() => {
                    setEditingProduct({
                      id: String(Date.now()),
                      name: "",
                      slug: "",
                      price: 349,
                      category: allCategories[0] || "Filled Centres",
                      kind: "DARK CHOCOLATE",
                      tagline: "",
                      personality: "",
                      description: "",
                      ingredients: "",
                      notes: "",
                      badge: "SMALL BATCH",
                      image: "/images/oiai/photo-milkPralines-02cd3864aed0.jpg",
                      weight: "Box of 6 pieces (120g)",
                      is_active: true,
                    });
                    setProductModalTab("card");
                  }}
                  className="admin-btn-gold"
                  type="button"
                >
                  <Plus size={15} />
                  <span>Add New Chocolate</span>
                </button>
              </div>
            </div>

            {/* CATEGORY MANAGER BAR */}
            {showCategoryMgr && (
              <div className="admin-category-mgr">
                <div style={{ flex: 1, minWidth: 260 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#dfc58b", display: "block", marginBottom: 6 }}>
                    + Create New Category
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ height: 34 }}
                      placeholder="e.g. Seasonal Gift Hampers"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn-gold"
                      style={{ padding: "0 14px", height: 34, fontSize: 12, whiteSpace: "nowrap" }}
                      onClick={handleCreateCategory}
                    >
                      + Create Category
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1.2, minWidth: 300, borderLeft: "1px solid rgba(198, 161, 91, 0.2)", paddingLeft: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#dfc58b", display: "block", marginBottom: 6 }}>
                    Rename Category (across all products)
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      className="admin-select"
                      style={{ height: 34, fontSize: 12 }}
                      value={renameFromCat}
                      onChange={(e) => setRenameFromCat(e.target.value)}
                    >
                      <option value="">Select Category…</option>
                      {allCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ height: 34 }}
                      placeholder="New Name…"
                      value={renameToCat}
                      onChange={(e) => setRenameToCat(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleRenameCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn-outline"
                      style={{ height: 34, fontSize: 12, whiteSpace: "nowrap" }}
                      disabled={isRenamingCat}
                      onClick={handleRenameCategory}
                    >
                      {isRenamingCat ? "Renaming…" : "Rename"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT GRID (COMPACT ROWS & COLUMNS) */}
            {filteredProducts.length === 0 ? (
              <div className="admin-empty-state">
                <Package size={40} />
                <h4>No chocolate items found</h4>
                <p>Add custom chocolate pieces using the button above.</p>
              </div>
            ) : (
              <div className="admin-product-grid">
                {filteredProducts.map((p) => (
                  <div className="admin-product-card" key={p.id}>
                    <div className="admin-product-img-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="admin-product-thumb"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/oiai/photo-milkPralines-02cd3864aed0.jpg";
                        }}
                      />
                    </div>
                    <div className="admin-product-body">
                      <div className="admin-product-header-row">
                        <span className="admin-product-cat-tag">{p.category}</span>
                        {p.is_active === false && (
                          <span className="admin-badge" style={{ background: "rgba(139,32,16,0.3)", color: "#ff8c7a", fontSize: 9, padding: "2px 6px" }}>
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="admin-product-header-row" style={{ marginTop: 2 }}>
                        <h4>{p.name}</h4>
                        <span className="admin-badge admin-badge-gold" style={{ fontSize: 9 }}>{p.badge || "SMALL BATCH"}</span>
                      </div>
                      {p.tagline && <p className="admin-product-tagline">“{p.tagline}”</p>}

                      <div className="admin-product-footer">
                        <div className="admin-product-price">
                          ₹{p.price}
                          <small>{p.weight ? `· ${p.weight}` : ""}</small>
                        </div>
                        <button
                          type="button"
                          className="admin-btn-outline"
                          style={{ padding: "4px 10px", fontSize: 11 }}
                          onClick={() => {
                            setEditingProduct(p);
                            setProductModalTab("card");
                          }}
                        >
                          <Edit size={12} />
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

        {/* ================= TAB 2: ORDERS (LINE-BY-LINE) ================= */}
        {activeTab === "orders" && (
          <section>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="admin-search-wrap">
                  <Search size={14} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search by customer name, email, order ID, UTR…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="admin-select"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="verified">Verified</option>
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
                <p>When customers order chocolates through UPI checkout, they will appear here line by line.</p>
              </div>
            ) : (
              <div className="admin-orders-table-wrap">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID &amp; Time</th>
                      <th>Customer Name</th>
                      <th>Customer Email</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <span style={{ fontWeight: 800, color: "#dfc58b" }}>{o.id}</span>
                          <span className="admin-order-date-small">
                            {new Date(o.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: "#f6f0e6" }}>{o.customer_name}</td>
                        <td style={{ color: "#ad9a89" }}>{o.customer_email || "—"}</td>
                        <td style={{ fontWeight: 700, color: "#e8c39e" }}>₹{o.total_amount}</td>
                        <td>
                          <span className={`admin-order-status-badge admin-status-${o.status}`}>
                            {o.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="admin-btn-gold"
                            style={{ padding: "6px 14px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                            onClick={() => setViewingOrder(o)}
                          >
                            <Eye size={13} />
                            <span>View Details</span>
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

        {/* ================= TAB 3: CUSTOMER FEEDBACK ================= */}
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
                  <option value="all">All Ratings</option>
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                  <option value="2">★★☆☆☆ (2 Stars)</option>
                  <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>

                <select
                  className="admin-select"
                  value={contextFilter}
                  onChange={(e) => setContextFilter(e.target.value)}
                >
                  <option value="all">All Contexts</option>
                  <option value="general">General Feedback</option>
                  <option value="sample">Sample Tasting</option>
                  <option value="order">Order Experience</option>
                </select>
              </div>

              <div className="admin-toolbar-right">
                <button onClick={exportFeedbacksCsv} className="admin-btn-outline" type="button">
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {filteredFeedbacks.length === 0 ? (
              <div className="admin-empty-state">
                <MessageSquare size={40} />
                <h4>No customer notes found</h4>
                <p>When customers submit feedback through the storefront modals, notes will appear here.</p>
              </div>
            ) : (
              <div className="admin-feedback-grid">
                {filteredFeedbacks.map((f) => (
                  <article className="admin-feedback-card" key={f.id}>
                    <div className="admin-feedback-header">
                      <div>
                        <h4 className="admin-feedback-name">{f.name}</h4>
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
                        })}
                      </span>

                      <button
                        type="button"
                        className="admin-btn-icon-danger"
                        onClick={() => handleDeleteFeedback(f.id)}
                        title="Delete note"
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

        {/* ================= TAB 4: FOOTER & CONTACT SETTINGS ================= */}
        {activeTab === "settings" && (
          <section className="admin-settings-container">
            <div className="admin-settings-card">
              <div className="admin-settings-header">
                <h3>Storefront Footer &amp; Contact Links</h3>
                <p>
                  These contact links appear in the footer on the main storefront. Customers can tap WhatsApp to chat directly, visit your Instagram profile, or send you an email.
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="admin-settings-success">
                  <Check size={16} />
                  <span>{settingsSavedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="admin-form-group">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#dfc58b", marginBottom: 6, letterSpacing: 0.5 }}>
                    WHATSAPP NUMBER *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: 12, fontSize: 14 }}>💬</span>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ paddingLeft: 42 }}
                      value={siteSettings.whatsapp}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                      placeholder="e.g. +91 81251 07227"
                      required
                    />
                  </div>
                  <small style={{ color: "#8c7662", fontSize: 11, marginTop: 4, display: "block" }}>
                    Include country code (e.g. +91 81251 07227). Clicking opens a WhatsApp conversation.
                  </small>
                </div>

                <div className="admin-form-group">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#dfc58b", marginBottom: 6, letterSpacing: 0.5 }}>
                    INSTAGRAM HANDLE / PROFILE *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: 12, fontSize: 14 }}>📸</span>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ paddingLeft: 42 }}
                      value={siteSettings.instagram}
                      onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                      placeholder="e.g. @oiai.chocolates"
                      required
                    />
                  </div>
                  <small style={{ color: "#8c7662", fontSize: 11, marginTop: 4, display: "block" }}>
                    Your Instagram handle (e.g. @oiai.chocolates). Clicking opens your Instagram profile page.
                  </small>
                </div>

                <div className="admin-form-group">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#dfc58b", marginBottom: 6, letterSpacing: 0.5 }}>
                    CONTACT EMAIL *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: 12, fontSize: 14 }}>✉</span>
                    <input
                      type="email"
                      className="admin-input"
                      style={{ paddingLeft: 42 }}
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      placeholder="e.g. hello@oiaichocolates.com"
                      required
                    />
                  </div>
                  <small style={{ color: "#8c7662", fontSize: 11, marginTop: 4, display: "block" }}>
                    Kitchen or customer care email. Clicking opens the visitor&apos;s email client.
                  </small>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <button
                    type="submit"
                    className="admin-btn-gold"
                    disabled={isSavingSettings}
                    style={{ padding: "12px 24px", fontSize: 13 }}
                  >
                    {isSavingSettings ? (
                      <>
                        <RefreshCw size={15} className="admin-spin" />
                        <span>Saving Changes…</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        <span>Save Footer Links</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* ================= 2-PANEL ORDER DETAILS & VERIFICATION MODAL ================= */}
      {viewingOrder && (
        <div className="admin-modal-backdrop" onClick={() => setViewingOrder(null)}>
          <div className="admin-modal-card admin-order-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Order Details &amp; Verification</h3>
                <span style={{ fontSize: 13, color: "#ad9a89" }}>
                  Order: <strong style={{ color: "#dfc58b" }}>{viewingOrder.id}</strong> · {new Date(viewingOrder.created_at).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                className="admin-input-btn"
                onClick={() => setViewingOrder(null)}
                style={{ position: "static" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-order-modal-grid">
              {/* LEFT PANEL: All Details */}
              <div className="admin-order-modal-left">
                <div className="admin-detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {viewingOrder.customer_name}</p>
                  <p>
                    <strong>Phone:</strong> {viewingOrder.customer_phone}
                    <a
                      href={`https://wa.me/${viewingOrder.customer_phone.replace(/\D/g, "").startsWith("91") ? viewingOrder.customer_phone.replace(/\D/g, "") : `91${viewingOrder.customer_phone.replace(/\D/g, "")}`}?text=${encodeURIComponent(`Hi ${viewingOrder.customer_name}! 🍫 This is OiAI Homemade Chocolates regarding your order ${viewingOrder.id}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: 10, color: "#25D366", fontSize: 12, fontWeight: 700 }}
                    >
                      <Phone size={11} style={{ display: "inline", marginRight: 3 }} />
                      WhatsApp Chat ↗
                    </a>
                  </p>
                  <p><strong>Email:</strong> {viewingOrder.customer_email || "Not provided"}</p>
                  <p><strong>Delivery Address:</strong> {viewingOrder.delivery_address}</p>
                </div>

                <div className="admin-detail-section">
                  <h4>Chocolates Ordered</h4>
                  {(Array.isArray(viewingOrder.items) ? viewingOrder.items : []).map((it, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", borderBottom: "1px dashed rgba(198, 161, 91, 0.2)", paddingBottom: 4 }}>
                      <span>{it.name} × {it.quantity}</span>
                      <strong>₹{it.price}</strong>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 16, fontWeight: 800, color: "#dfc58b" }}>
                    <span>Total Amount:</span>
                    <span>₹{viewingOrder.total_amount}</span>
                  </div>
                </div>

                <div className="admin-detail-section">
                  <h4>Payment Information</h4>
                  <p><strong>Payment Method:</strong> {viewingOrder.payment_method}</p>
                  <p>
                    <strong>UTR / UPI Transaction ID:</strong>{" "}
                    <code style={{ background: "#120c09", color: "#dfc58b", padding: "3px 8px", borderRadius: 4, fontWeight: 700, fontSize: 13, border: "1px solid rgba(198, 161, 91, 0.3)" }}>
                      {viewingOrder.transaction_id || "None provided by customer"}
                    </code>
                  </p>
                  <p style={{ marginTop: 8 }}>
                    <strong>Current Status:</strong>{" "}
                    <span className={`admin-order-status-badge admin-status-${viewingOrder.status}`}>
                      {viewingOrder.status.replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL: Payment Screenshot & Verification */}
              <div className="admin-order-modal-right">
                <h4>Payment Screenshot / Proof</h4>
                {viewingOrder.screenshot_url ? (
                  <div className="admin-screenshot-box">
                    <a href={viewingOrder.screenshot_url} target="_blank" rel="noreferrer" title="Click to view full image in new tab">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={viewingOrder.screenshot_url}
                        alt="Customer Payment Screenshot"
                        className="admin-screenshot-img"
                      />
                    </a>
                    <small style={{ display: "block", marginTop: 8, color: "#ad9a89" }}>
                      Click screenshot to expand in new tab
                    </small>
                  </div>
                ) : (
                  <div className="admin-screenshot-empty">
                    <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#dfc58b" }}>No Screenshot Attached</p>
                    <p style={{ fontSize: 12, margin: 0 }}>
                      Customer did not attach a screenshot. Verify the transaction in your UPI app using UTR ID:
                    </p>
                    <code style={{ display: "inline-block", marginTop: 8, background: "#120c09", padding: "4px 8px", color: "#dfc58b" }}>
                      {viewingOrder.transaction_id || "N/A"}
                    </code>
                  </div>
                )}

                <div style={{ marginTop: "auto", paddingTop: 16 }}>
                  <button
                    type="button"
                    className="admin-btn-gold"
                    style={{ width: "100%", padding: "14px", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={async () => {
                      await handleUpdateOrderStatus(viewingOrder.id, "verified");
                    }}
                  >
                    <Check size={18} />
                    <span>{viewingOrder.status === "verified" ? "Status: VERIFIED ✓" : "Mark as Verified ✓"}</span>
                  </button>

                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      type="button"
                      className="admin-btn-outline"
                      style={{ flex: 1, fontSize: 12 }}
                      onClick={() => handleUpdateOrderStatus(viewingOrder.id, "dispatched")}
                    >
                      Dispatched
                    </button>
                    <button
                      type="button"
                      className="admin-btn-outline"
                      style={{ flex: 1, fontSize: 12 }}
                      onClick={() => handleUpdateOrderStatus(viewingOrder.id, "delivered")}
                    >
                      Delivered
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      style={{ flex: 1, fontSize: 12 }}
                      onClick={() => handleUpdateOrderStatus(viewingOrder.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT EDIT MODAL (2 SECTIONS) ================= */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>{editingProduct.id ? `Edit ${editingProduct.name || "Chocolate Item"}` : "New Chocolate Piece"}</h3>
                <span style={{ fontSize: 12, color: "#ad9a89" }}>Customize both the home card and detail page</span>
              </div>
              <button
                type="button"
                className="admin-input-btn"
                onClick={() => setEditingProduct(null)}
                style={{ position: "static" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL SECTION TABS */}
            <div className="admin-section-tabs">
              <button
                type="button"
                className={`admin-section-tab ${productModalTab === "card" ? "active" : ""}`}
                onClick={() => setProductModalTab("card")}
              >
                <Layers size={13} style={{ display: "inline", marginRight: 6 }} />
                1. Storefront Card Content
              </button>
              <button
                type="button"
                className={`admin-section-tab ${productModalTab === "detail" ? "active" : ""}`}
                onClick={() => setProductModalTab("detail")}
              >
                <Tag size={13} style={{ display: "inline", marginRight: 6 }} />
                2. Detail Page &amp; Settings
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-login-form">
              {/* SECTION 1: STOREFRONT CARD CONTENT */}
              {productModalTab === "card" && (
                <div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Chocolate Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="e.g. Sugar Rush"
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Price (INR ₹) *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="admin-input"
                        value={editingProduct.price === 0 ? '' : String(editingProduct.price)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setEditingProduct({ ...editingProduct, price: raw === '' ? 0 : parseInt(raw, 10) });
                        }}
                        onFocus={(e) => e.target.select()}
                        placeholder="399"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Category *</label>
                      <select
                        className="admin-input"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        required
                      >
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Sub-Kind / Headline</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.kind || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, kind: e.target.value })}
                        placeholder="e.g. CRUNCH & CRISPS, DARK CHOCOLATE"
                      />
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Card Badge / Batch Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.badge || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="e.g. THE HAPPY CRUNCH or SMALL BATCH"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Weight / Packaging</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingProduct.weight || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                        placeholder="Box of 8 pieces (140g)"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Personality (Displayed on card)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.personality || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, personality: e.target.value })}
                      placeholder="e.g. Chaotic, bubbly, the life of the party"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Tagline / Motto Quote</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.tagline || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                      placeholder="e.g. Soft on the inside. Chaos on the outside."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Card Description</label>
                    <textarea
                      className="admin-input"
                      style={{ height: 65, padding: "8px 12px", resize: "vertical" }}
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Marshmallows and silk-chip crisps tucked under a chocolate coat."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Ingredients Line</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.ingredients || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                      placeholder="Marshmallows and Silk chocolate-chip crisps covered in chocolate"
                    />
                  </div>

                  {/* IMAGE UPLOAD & URL */}
                  <div className="admin-form-group">
                    <label>Chocolate Photograph *</label>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <label className="admin-upload-device-btn">
                        <Upload size={14} />
                        <span>Upload from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleDeviceImageUpload}
                        />
                      </label>
                      <span style={{ fontSize: 11, color: "#ad9a89" }}>or paste image URL:</span>
                    </div>

                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginTop: 8 }}
                      value={editingProduct.image || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://... or data:image/..."
                      required
                    />

                    {editingProduct.image && (
                      <div className="admin-img-preview-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProduct.image}
                          alt="Preview"
                          className="admin-img-preview"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/oiai/photo-milkPralines-02cd3864aed0.jpg";
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#dfc58b" }}>Live Image Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 2: DETAIL PAGE & SETTINGS */}
              {productModalTab === "detail" && (
                <div>
                  <div className="admin-form-group">
                    <label>Tasting Notes (Shown in Detail View)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.notes || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                      placeholder="e.g. Marshmallows · silk-chip crisps · chocolate"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>URL Slug</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editingProduct.slug || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      placeholder="e.g. sugar-rush"
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginTop: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                      />
                      <span style={{ fontWeight: 600, color: "#f6f0e6" }}>Active &amp; Visible in Storefront</span>
                    </label>
                    <p style={{ margin: "4px 0 0 24px", fontSize: 11, color: "#ad9a89" }}>
                      Uncheck to temporarily hide this chocolate from the home shelf without deleting it.
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
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
