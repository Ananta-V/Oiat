import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            subscribers: [],
            tableMissing: true,
            error: "The 'subscribers' table does not exist in Supabase yet. Please execute supabase/schema.sql in the Supabase SQL Editor.",
          },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscribers: data || [], tableMissing: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch subscribers." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing subscriber ID." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("subscribers").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscriber removed." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to remove subscriber." }, { status: 500 });
  }
}

