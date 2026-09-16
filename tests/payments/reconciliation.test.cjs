/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness compiles production TS in memory. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

// Compile the production TypeScript in memory, with controlled service dependencies.
function load(file, dependencies = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  new Function("require", "module", "exports", source)((name) => {
    if (name in dependencies) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  }, compiled, compiled.exports);
  return compiled.exports;
}
const contracts = load("lib/payments/contracts.ts");
const reference = "TX_example";
const row = (overrides = {}) => ({ id: 1, user_id: "learner", bundle_id: "bundle-a", amount_paid: 500000, status: "pending", expires_at: null, ...overrides });
const transaction = (overrides = {}) => ({ reference, amount: 500000, currency: "NGN", status: "success", metadata: { user_id: "learner" }, ...overrides });

function harness(initialRows, provider = transaction(), options = {}) {
  let rows = structuredClone(initialRows);
  const calls = { writes: 0, emails: 0, provider: 0, rpcAmount: null, receipt: null };
  const admin = {
    from() { return { select() { return { async eq() { return { data: structuredClone(rows), error: null }; } }; } }; },
    async rpc(_name, args) {
      calls.writes++;
      calls.rpcAmount = args.p_amount;
      if (options.writeError) return { error: new Error("Database unavailable") };
      rows = rows.map((item) => ({ ...item, status: item.status === "refunded" ? "refunded" : args.p_status === "failed" && item.status === "completed" ? "completed" : args.p_status }));
      return { error: null };
    },
  };
  const service = load("lib/payments/paystack.ts", {
    "@/lib/supabase/admin": { supabaseAdmin: admin },
    "@/lib/email/resend": { resend: { emails: { async send(message) { calls.receipt = message; calls.emails++; if (options.emailError) throw new Error("Email offline"); return {}; } } } },
    "./contracts": contracts,
  });
  const previousFetch = global.fetch;
  global.fetch = async () => {
    calls.provider++;
    if (options.networkError) throw new Error("Network unavailable");
    return { ok: true, async json() { return { status: true, data: provider }; } };
  };
  process.env.PAYSTACK_SECRET_KEY = "test-placeholder";
  process.env.NEXT_PUBLIC_APP_URL = "https://example.test";
  return { module: service, calls, restore() { global.fetch = previousFetch; }, rows: () => rows };
}

for (const [name, values] of [
  ["wrong amount", { amount: 5000 }], ["wrong currency", { currency: "USD" }],
  ["wrong reference", { reference: "another" }], ["wrong metadata owner", { metadata: { user_id: "other" } }],
]) test(`Reject ${name} without fulfillment`, async () => {
  const h = harness([row()], transaction(values));
  try { await assert.rejects(h.module.reconcilePayment(reference, "learner")); assert.equal(h.calls.writes, 0); }
  finally { h.restore(); }
});

test("Reject missing or foreign purchases before contacting provider", async () => {
  for (const rows of [[], [row({ user_id: "other" })]]) {
    const h = harness(rows);
    try { await assert.rejects(h.module.reconcilePayment(reference, "learner")); assert.equal(h.calls.provider, 0); }
    finally { h.restore(); }
  }
});

test("Complete every item of a partially completed checkout", async () => {
  const h = harness([row({ status: "completed" }), row({ id: 2, bundle_id: "bundle-b" })], transaction({ amount: 1000000 }));
  try { const result = await h.module.reconcilePayment(reference, "learner"); assert.equal(result.status, "paid"); assert.ok(result.purchases.every((item) => item.status === "completed")); }
  finally { h.restore(); }
});

test("Provider/network failure leaves purchase pending", async () => {
  const h = harness([row()], transaction(), { networkError: true });
  try { await assert.rejects(h.module.reconcilePayment(reference)); assert.equal(h.calls.writes, 0); assert.equal(h.rows()[0].status, "pending"); }
  finally { h.restore(); }
});

test("Database failure cannot return success or send receipt", async () => {
  const h = harness([row()], transaction(), { writeError: true });
  try { await assert.rejects(h.module.reconcilePayment(reference)); assert.equal(h.calls.emails, 0); }
  finally { h.restore(); }
});

test("Email failure does not fail a completed purchase", async () => {
  const h = harness([row()], transaction({ customer: { email: "buyer@example.test" } }), { emailError: true });
  try { assert.equal((await h.module.reconcilePayment(reference)).status, "paid"); }
  finally { h.restore(); }
});

test("Refunded purchase is not restored by replayed success", async () => {
  const h = harness([row({ status: "refunded" })]);
  try { assert.equal((await h.module.reconcilePayment(reference)).status, "refunded"); }
  finally { h.restore(); }
});

test("Nonterminal and unknown provider states do not trigger fulfillment", async () => {
  for (const status of ["pending", "processing", "ongoing", "queued", "unknown"]) {
    const h = harness([row()], transaction({ status }));
    try { assert.equal((await h.module.reconcilePayment(reference)).status, "pending"); assert.equal(h.calls.writes, 0); }
    finally { h.restore(); }
  }
});

test("Invalid purchase snapshots fail validation", () => {
  for (const rows of [[row({ amount_paid: null })], [row({ amount_paid: 1.5 })], [row(), row()], [row(), row({ bundle_id: "b", user_id: "other" })]]) {
    assert.throws(() => contracts.validateTransaction(rows, transaction(), reference));
  }
});

test("References cannot introduce URL paths or markup", () => {
  assert.equal(contracts.validReference("TX_123_abc"), true);
  for (const value of ["", "../transaction", "<script>", null, "a".repeat(201)]) assert.equal(contracts.validReference(value), false);
});

test("Repeated successful verification does not resend receipts", async () => {
  const h = harness([row()], transaction({ customer: { email: "buyer@example.test" } }));
  try {
    await h.module.reconcilePayment(reference);
    await h.module.reconcilePayment(reference);
    assert.equal(h.calls.emails, 1);
    assert.equal(h.rows()[0].status, "completed");
  } finally { h.restore(); }
});

const crypto = require("node:crypto");
function webhook(reconcile) {
  process.env.PAYSTACK_SECRET_KEY = "test-placeholder";
  return load("app/api/paystack/webhook/route.ts", {
    "node:crypto": crypto,
    "next/server": { NextResponse: { json: (data, init) => Response.json(data, init) } },
    "@/lib/payments/paystack": { reconcilePayment: reconcile },
    "@/lib/payments/contracts": contracts,
  });
}
function eventRequest(event, validSignature = true) {
  const body = JSON.stringify(event);
  const signature = crypto.createHmac("sha512", "test-placeholder").update(body).digest("hex");
  return new Request("https://example.test/api/paystack/webhook", {
    method: "POST", headers: { "x-paystack-signature": validSignature ? signature : "invalid" }, body,
  });
}

test("Webhook rejects forged signatures before fulfillment", async () => {
  let calls = 0;
  const route = webhook(async () => { calls++; return { status: "paid" }; });
  assert.equal((await route.POST(eventRequest({ event: "charge.success", data: { reference } }, false))).status, 401);
  assert.equal(calls, 0);
});

test("Webhook processing errors request a provider retry", async () => {
  const route = webhook(async () => { throw new Error("Database down"); });
  assert.equal((await route.POST(eventRequest({ event: "charge.success", data: { reference } }))).status, 503);
});

test("Webhook does not acknowledge an unresolved successful charge", async () => {
  const route = webhook(async () => ({ status: "pending" }));
  assert.equal((await route.POST(eventRequest({ event: "charge.success", data: { reference } }))).status, 503);
});

test("Webhook acknowledges reconciled success and ignores unrelated signed events", async () => {
  let calls = 0;
  const route = webhook(async () => { calls++; return { status: "paid" }; });
  assert.equal((await route.POST(eventRequest({ event: "charge.success", data: { reference } }))).status, 200);
  assert.equal((await route.POST(eventRequest({ event: "other.event" }))).status, 200);
  assert.equal(calls, 1);
});

test("Confirmation removes only the purchased bundle items", () => {
  const cart = load("lib/features/cart/cartSlice.ts", { "@reduxjs/toolkit": require("@reduxjs/toolkit") });
  const state = {
    items: [
      { id: "bought", type: "bundle", name: "Paid", price: 500000, quantity: 1 },
      { id: "later", type: "bundle", name: "Other", price: 200000, quantity: 1 },
      { id: "bought", type: "course", name: "Course", price: 100000, quantity: 1 },
    ], couponCode: null, discount: 0,
  };
  const next = cart.default(state, cart.removePurchasedBundles(["bought"]));
  assert.deepEqual(next.items.map((item) => `${item.type}:${item.id}`), ["bundle:later", "course:bought"]);
});


test("Buyer-paid fee completes a 100-naira order charged at 101.53 naira", async () => {
  const h = harness([row({ amount_paid: 10000 })], transaction({
    amount: 10153, requested_amount: 10000, fees: 153,
    customer: { email: "buyer@example.test" },
  }));
  try {
    assert.equal((await h.module.reconcilePayment(reference, "learner")).status, "paid");
    assert.equal(h.calls.rpcAmount, 10000); // SQL still reconciles the original order price.
    assert.equal(h.rows()[0].amount_paid, 10000);
    assert.equal(h.calls.emails, 1);
    assert.match(h.calls.receipt.text, /Bundle price: NGN 100.00/);
    assert.match(h.calls.receipt.text, /Processing fee: NGN 1.53/);
    assert.match(h.calls.receipt.text, /Total paid: NGN 101.53/);
    await h.module.reconcilePayment(reference, "learner");
    assert.equal(h.calls.emails, 1);
  } finally { h.restore(); }
});

test("Merchant-paid fee continues to accept the exact bundle amount", async () => {
  const h = harness([row({ amount_paid: 10000 })], transaction({ amount: 10000, requested_amount: 10000, fees: 150 }));
  try { assert.equal((await h.module.reconcilePayment(reference)).status, "paid"); }
  finally { h.restore(); }
});

test("Legacy response without requested_amount requires an exact verified net amount", () => {
  for (const requested_amount of [undefined, null]) {
    assert.equal(contracts.validateTransaction([row({ amount_paid: 10000 })], transaction({ amount: 10153, fees: 153, requested_amount }), reference), 10000);
  }
});

for (const [name, values] of [
  ["unexplained overpayment", { amount: 10153 }],
  ["incorrect fee", { amount: 10153, requested_amount: 10000, fees: 152 }],
  ["different requested amount", { amount: 10153, requested_amount: 9000, fees: 153 }],
  ["underpayment", { amount: 9999, requested_amount: 10000, fees: 153 }],
  ["fractional kobo fee", { amount: 10153, fees: 153.5 }],
  ["negative fee", { amount: 10153, fees: -153 }],
  ["untyped fee", { amount: 10153, fees: "153" }],
  ["conflicting request on exact payment", { amount: 10000, requested_amount: 9000 }],
]) test(`Fee handling rejects ${name} without granting access`, async () => {
  const h = harness([row({ amount_paid: 10000 })], transaction(values));
  try {
    await assert.rejects(h.module.reconcilePayment(reference));
    assert.equal(h.calls.writes, 0);
    assert.equal(h.calls.emails, 0);
    assert.equal(h.rows()[0].status, "pending");
  } finally { h.restore(); }
});
