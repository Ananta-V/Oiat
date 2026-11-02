import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const runtime = "nodejs";

const DEFAULT_SITE_SETTINGS = {
  whatsapp: "+91 81251 07227",
  instagram: "@oiai.chocolates",
  email: "hello@oiaichocolates.com",
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("notes")
      .eq("id", "site_settings")
      .single();

    if (error || !data || !data.notes) {
      return NextResponse.json(DEFAULT_SITE_SETTINGS);
    }

    try {
      const parsed = JSON.parse(data.notes);
      return NextResponse.json({
        whatsapp: parsed.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp,
        instagram: parsed.instagram || DEFAULT_SITE_SETTINGS.instagram,
        email: parsed.email || DEFAULT_SITE_SETTINGS.email,
      });
    } catch {
      return NextResponse.json(DEFAULT_SITE_SETTINGS);
    }
  } catch {
    return NextResponse.json(DEFAULT_SITE_SETTINGS);
  }
}

export async function POST(request: Request) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = {
      whatsapp: String(body.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp).trim(),
      instagram: String(body.instagram || DEFAULT_SITE_SETTINGS.instagram).trim(),
      email: String(body.email || DEFAULT_SITE_SETTINGS.email).trim(),
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("products").upsert({
      id: "site_settings",
      name: "OiAI Store Settings",
      slug: "site-settings",
      category: "__settings__",
      price: 0,
      notes: JSON.stringify(settings),
      image: "/images/oiai/logo.png",
      is_active: false,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save settings" }, { status: 500 });
  }
}
