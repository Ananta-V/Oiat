import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminPassword, createAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Incorrect admin password." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Authenticated successfully." });
  } catch (error) {
    console.error("[POST /api/admin/login] error:", error);
    return NextResponse.json(
      { error: "Unable to process login. Please try again." },
      { status: 500 }
    );
  }
}

