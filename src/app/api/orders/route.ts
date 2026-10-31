import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      customerAddress,
      city,
      pincode,
      orderNotes,
      items,
      productId,
      productName,
      quantity,
      totalAmount,
      totalPrice,
      transactionId,
      utrId,
      screenshotUrl,
    } = body;

    const address = (deliveryAddress || customerAddress || "").trim();
    const name = (customerName || "").trim();
    const phone = (customerPhone || "").trim();

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Please provide your name, phone number, and delivery address." },
        { status: 400 }
      );
    }

    // Build order items array
    let orderItems = Array.isArray(items) && items.length > 0 ? items : [];
    if (orderItems.length === 0 && (productName || productId)) {
      orderItems = [
        {
          id: productId || "custom",
          name: productName || "Chocolate Box",
          quantity: Number(quantity) || 1,
          price: Number(totalPrice || totalAmount) || 0,
        },
      ];
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "No chocolate items selected." },
        { status: 400 }
      );
    }

    const calculatedTotal =
      Number(totalAmount) ||
      Number(totalPrice) ||
      orderItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

    const txId = (transactionId || utrId || "").trim();
    const orderId = `OIAI-${Math.floor(100000 + Math.random() * 900000)}`;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        customer_name: name,
        customer_phone: phone,
        customer_email: customerEmail ? customerEmail.trim().toLowerCase() : null,
        delivery_address: address,
        city: city ? city.trim() : "Hyderabad",
        pincode: pincode ? pincode.trim() : null,
        order_notes: orderNotes ? orderNotes.trim() : null,
        items: orderItems,
        total_amount: calculatedTotal,
        payment_method: "UPI",
        transaction_id: txId || null,
        screenshot_url: screenshotUrl || null,
        status: "pending_verification",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[POST /api/orders] Supabase error:", error);
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            error:
              "The 'orders' table is not yet created in Supabase. Please execute SUPABASE_SCHEMA.md in the Supabase SQL Editor.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "Could not record order. Please try again or reach out on WhatsApp." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: data?.id || orderId,
        message: "Your handmade chocolate order has been placed successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/orders] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}

