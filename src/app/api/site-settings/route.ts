import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const runtime = "nodejs";

const DEFAULT_SAMPLE_OPTIONS = [
  "A little of everything",
  "Secret Crush (Dark & Almond)",
  "Bad Habit (Dark & Cocoa Cashew)",
  "Sweet Surrender (Nutella Centre)",
  "Sugar Rush (Marshmallow & Crisps)",
  "Mixed Signals (White & Dark Marble)",
  "First Love (Plain Milk Chocolate)",
  "Dark Affair (70% Dark Chocolate)",
  "Pocket Mischief (Chocolate Almonds)",
  "Caught Snacking (Chocolate Cashews)",
  "Filled Centres (Filled-centre chocolate)",
  "Milk & Marble (Milk or marble chocolate)",
  "Crunch & Crisps (Crunch & crisps)",
  "Plain Dark (Plain dark chocolate)",
  "Nutty Packs (Chocolate-covered nuts)",
  "Chocolate I tried (A little sample)",
];

const DEFAULT_SITE_SETTINGS = {
  whatsapp: "+91 81251 07227",
  instagram: "@oiai.chocolates",
  email: "hello@oiaichocolates.com",
  sampleOptions: DEFAULT_SAMPLE_OPTIONS,
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
        sampleOptions:
          Array.isArray(parsed.sampleOptions) && parsed.sampleOptions.length > 0
            ? parsed.sampleOptions
            : DEFAULT_SAMPLE_OPTIONS,
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
      sampleOptions:
        Array.isArray(body.sampleOptions) && body.sampleOptions.length > 0
          ? body.sampleOptions.map((s: any) => String(s).trim()).filter(Boolean)
          : DEFAULT_SAMPLE_OPTIONS,
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
