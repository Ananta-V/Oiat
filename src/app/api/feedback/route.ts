import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 80);
    const email = clean(body.email, 160).toLowerCase();
    const context = clean(body.context, 100);
    const message = clean(body.message, 1200);
    const rating = Number(body.rating);
    const feelings = Array.isArray(body.feelings)
      ? body.feelings
          .filter((item: unknown) => typeof item === "string")
          .slice(0, 12)
          .map((item: string) => clean(item, 40))
      : [];
    const productId = clean(body.productId, 80);
    const productName = clean(body.productName, 120);
    const pageUrl = clean(body.pageUrl, 300);

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.length < 8 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { error: "Please check your name, email, rating and feedback note." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        name,
        email,
        context: context || "Your OiAI story",
        rating,
        feelings,
        message,
        product_id: productId || null,
        product_name: productName || null,
        page_url: pageUrl || null,
        source: "oiai-catalogue",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[POST /api/feedback] Supabase error:", error);
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            error:
              "The 'feedback' table is not yet created in Supabase. Please execute supabase/schema.sql in the Supabase SQL Editor.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Your feedback could not be saved right now. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, id: data?.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/feedback] Unexpected error:", error);
    return NextResponse.json(
      { error: "Your feedback could not be saved right now. Please try again." },
      { status: 503 },
    );
  }
}
