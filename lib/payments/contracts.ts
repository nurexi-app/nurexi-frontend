export type PaymentState = "success" | "pending" | "access_pending" | "failed" | "refunded" | "expired";
export interface PurchasedSession {
  id: number;
  name: string;
  examCode: string;
}
export interface PaymentResult {
  status: PaymentState;
  message: string;
  bundleIds: string[];
  sessions: PurchasedSession[];
  checkoutUrl?: string;
}
export interface Purchase {
  id: number;
  user_id: string;
  bundle_id: string;
  amount_paid: number | string;
  status: string;
  expires_at: string | null;
}
export interface VerifiedTransaction {
  reference: string;
  amount: number;
  requested_amount?: number | null;
  fees?: number | null;
  currency: string;
  status: string;
  metadata?: { user_id?: string };
  customer?: { email?: string };
}

export function validReference(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9._=-]{1,200}$/.test(value);
}

// These fields must come from the authenticated server-to-server verification response.
// Never calculate the provider fee ourselves or accept arbitrary overpayments.
export function matchesOrderAmount(total: number, transaction: VerifiedTransaction) {
  const { amount, requested_amount: requested, fees } = transaction;
  if (!Number.isSafeInteger(amount) || amount <= 0) return false;
  if (requested != null && (!Number.isSafeInteger(requested) || requested !== total)) {
    return false;
  }
  if (amount === total) return true; // Merchant absorbs fees (including legacy responses).
  return amount > total && typeof fees === "number" &&
    Number.isSafeInteger(fees) && fees > 0 && amount - fees === total;
}

export function validateTransaction(rows: Purchase[], transaction: VerifiedTransaction, reference: string) {
  if (!rows.length || rows.some((row) => !row.user_id || !row.bundle_id)) {
    throw new Error("Purchase not found");
  }
  const owner = rows[0].user_id;
  const amounts = rows.map((row) => Number(row.amount_paid));
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (rows.some((row) => row.user_id !== owner) ||
      new Set(rows.map((row) => row.bundle_id)).size !== rows.length ||
      amounts.some((amount) => !Number.isSafeInteger(amount) || amount <= 0) ||
      !Number.isSafeInteger(total) || transaction.reference !== reference ||
      !matchesOrderAmount(total, transaction) || transaction.currency !== "NGN" ||
      (transaction.metadata?.user_id && transaction.metadata.user_id !== owner)) {
    throw new Error("Payment does not match the recorded purchase. Please contact support.");
  }
  return total;
}

export function classifyProviderStatus(status: string): "paid" | "pending" | "failed" | "refunded" {
  if (status === "success") return "paid";
  if (status === "reversed") return "refunded";
  if (status === "failed" || status === "abandoned") return "failed";
  // Unknown statuses are unresolved, never evidence that another charge is safe.
  return "pending";
}
