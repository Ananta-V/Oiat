import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ratingFilter = searchParams.get("rating");
  const searchQuery = searchParams.get("search");

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (ratingFilter && ratingFilter !== "all") {
      const num = parseInt(ratingFilter, 10);
      if (!isNaN(num)) query = query.eq("rating", num);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const s = searchQuery.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,message.ilike.%${s}%,product_name.ilike.%${s}%`);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            feedback: [],
            tableMissing: true,
            error: "The 'feedback' table does not exist in Supabase yet. Please execute supabase/schema.sql in the Supabase SQL Editor.",
          },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feedback: data || [], tableMissing: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch feedback." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing feedback ID." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Feedback deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete feedback." }, { status: 500 });
  }
}

