import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(rawBody);

    switch (event.event) {
      case "payment.captured":
      case "order.paid": {
        const paymentEntity = event.payload?.payment?.entity;
        const notes = paymentEntity?.notes || {};
        console.log("Payment captured successfully:", {
          paymentId: paymentEntity?.id,
          orderId: paymentEntity?.order_id,
          amount: paymentEntity?.amount ? paymentEntity.amount / 100 : 0,
          table: notes.table_number,
        });
        break;
      }
      case "payment.failed": {
        const error = event.payload?.payment?.entity?.error_description;
        console.warn("Payment failed event received:", error);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
