import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("subscribers")
      .upsert({ email, source: "oiai-newsletter" }, { onConflict: "email" })
      .select("id")
      .single();

    if (error) {
      console.error("[POST /api/newsletter] Supabase error:", error);
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            error:
              "The 'subscribers' table is not yet created in Supabase. Please execute supabase/schema.sql in the Supabase SQL Editor.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Could not save your subscription. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, id: data?.id, message: "Welcome to the sweet side!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/newsletter] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

