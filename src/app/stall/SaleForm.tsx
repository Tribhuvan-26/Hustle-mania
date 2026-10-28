"use client";

import { useActionState, useRef } from "react";
import { addSale } from "../actions";

export function SaleForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [error, action, pending] = useActionState(async (prev: string | null, form: FormData) => {
    const err = await addSale(prev, form);
    if (!err) ref.current?.reset();
    return err;
  }, null);

  return (
    <form ref={ref} action={action} className="card grid gap-3 p-6 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input name="item" required placeholder="Item" className="input" />
      <input name="qty" type="number" min={1} defaultValue={1} required className="input" aria-label="Quantity" />
      <input name="amount" type="number" min={0} step="any" required placeholder="₹ total" className="input" />
      <select name="mode" className="input" aria-label="Payment mode"><option value="cash">Cash</option><option value="upi">UPI</option></select>
      <button className="btn" disabled={pending}>{pending ? "…" : "Record"}</button>
      {error && <p className="text-sm text-red-400 sm:col-span-5">{error}</p>}
    </form>
  );
}
