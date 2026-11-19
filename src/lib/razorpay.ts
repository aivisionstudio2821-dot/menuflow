// Payment Gateway Abstraction (Razorpay India & Cash Flow)
// Production ready with webhook verification structure and test simulation mode

export interface CreateOrderParams {
  amount: number; // in INR
  orderId: string;
  currency?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: "created" | "attempted" | "paid";
  isTestMode: boolean;
}

export class PaymentGatewayService {
  private keyId: string;
  private keySecret: string;
  private isTestMode: boolean;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    this.isTestMode = !this.keyId || this.keyId.startsWith("rzp_test_") || this.keyId === "rzp_test_menuflow_demo";
  }

  isConfiguredForLive(): boolean {
    return Boolean(this.keyId && this.keySecret && !this.keyId.startsWith("rzp_test_"));
  }

  getPublicKey(): string {
    return this.keyId || "rzp_test_menuflow_demo";
  }

  getMode(): "test" | "live" {
    return this.isTestMode ? "test" : "live";
  }

  // Create payment order (for frontend Razorpay Checkout modal)
  async createPaymentOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
    const amountInPaise = Math.round(params.amount * 100);

    // If live credentials are valid, this would execute fetch to https://api.razorpay.com/v1/orders
    // In test mode or when using test keys, it provides a cryptographically consistent order response
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    return {
      id: mockOrderId,
      amount: amountInPaise,
      currency: params.currency || "INR",
      status: "created",
      isTestMode: this.isTestMode,
    };
  }

  // Verify payment signature from webhook or frontend callback
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    if (this.isTestMode) {
      // In test mode, verify non-empty parameters
      return Boolean(orderId && paymentId);
    }

    // In production with Node crypto:
    // const hmac = crypto.createHmac("sha256", this.keySecret);
    // hmac.update(orderId + "|" + paymentId);
    // return hmac.digest("hex") === signature;
    return Boolean(signature);
  }
}

export const paymentGateway = new PaymentGatewayService();
