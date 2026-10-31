import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { FALLBACK_PRODUCTS } from "@/data/fallback-products";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ products: FALLBACK_PRODUCTS, source: "default" });
    }

    return NextResponse.json({ products: data, source: "supabase" });
  } catch {
    return NextResponse.json({ products: FALLBACK_PRODUCTS, source: "fallback" });
  }
}
