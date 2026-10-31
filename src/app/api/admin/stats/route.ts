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

    const [feedbackRes, subRes, ordersRes, productsRes] = await Promise.all([
      supabase.from("feedback").select("id, rating, feelings, created_at"),
      supabase.from("subscribers").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id, total_amount, status"),
      supabase.from("products").select("id", { count: "exact", head: true }),
    ]);

    const tableMissing =
      feedbackRes.error?.code === "PGRST205" ||
      subRes.error?.code === "PGRST205" ||
      ordersRes.error?.code === "PGRST205";

    if (tableMissing) {
      return NextResponse.json({
        tableMissing: true,
        stats: {
          totalFeedback: 0,
          averageRating: 0,
          subscribersCount: 0,
          ordersCount: 0,
          totalRevenue: 0,
          productsCount: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          feelingsBreakdown: {},
        },
      });
    }

    const feedbacks = feedbackRes.data || [];
    const orders = ordersRes.data || [];
    const totalFeedback = feedbacks.length;
    const totalScore = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
    const averageRating = totalFeedback > 0 ? (totalScore / totalFeedback).toFixed(1) : "5.0";

    const ordersCount = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const feelingsBreakdown: Record<string, number> = {};

    feedbacks.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1;
      }
      if (Array.isArray(f.feelings)) {
        f.feelings.forEach((feeling: string) => {
          feelingsBreakdown[feeling] = (feelingsBreakdown[feeling] || 0) + 1;
        });
      }
    });

    return NextResponse.json({
      tableMissing: false,
      stats: {
        totalFeedback,
        averageRating: Number(averageRating),
        subscribersCount: subRes.count || 0,
        ordersCount,
        totalRevenue,
        productsCount: productsRes.count || 0,
        ratingDistribution,
        feelingsBreakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
