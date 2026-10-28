import { requireProfile } from "@/lib/supabase";
import { deleteSale } from "../actions";
import { Shell, Stat, rupees } from "../Shell";
import { SaleForm } from "./SaleForm";

export const metadata = { title: "Stall — Hustle Mania", robots: { index: false } };
export const instant = false; // per-user data, render on request

export default async function Stall() {
  const { db, profile } = await requireProfile("stall");
  const [{ data: stall }, { data: sales }] = await Promise.all([
    db.from("stalls").select("name").eq("id", profile.stall_id).single(),
    db.from("sales").select("id, item, qty, amount, mode, created_at").eq("stall_id", profile.stall_id).order("created_at", { ascending: false }),
  ]);

  const list = sales ?? [];
  const total = list.reduce((n, x) => n + Number(x.amount), 0);
  const upi = list.filter((x) => x.mode === "upi").reduce((n, x) => n + Number(x.amount), 0);

  // Per-item totals, best seller first.
  const items = new Map<string, { qty: number; amount: number }>();
  for (const x of list) {
    const k = x.item.toLowerCase();
    const cur = items.get(k) ?? { qty: 0, amount: 0 };
    items.set(k, { qty: cur.qty + x.qty, amount: cur.amount + Number(x.amount) });
  }

  return (
    <Shell title={stall?.name ?? "Your stall"} who="Stall portal">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total sales" value={rupees(total)} />
        <Stat label="Orders" value={list.length} />
        <Stat label="UPI" value={rupees(upi)} />
        <Stat label="Cash" value={rupees(total - upi)} />
      </section>

      <SaleForm />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="label mb-4 text-blue">By item</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {[...items].sort((a, b) => b[1].amount - a[1].amount).map(([name, v]) => (
              <li key={name} className="flex justify-between border-t border-white/10 pt-2">
                <span className="capitalize">{name} <span className="text-white/50">× {v.qty}</span></span>
                <span className="font-mono text-green">{rupees(v.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="label mb-4 text-blue">Recent sales</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {list.slice(0, 20).map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
                <span className="font-mono text-white/50">{new Date(x.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="flex-1">{x.item} × {x.qty} <span className="uppercase text-white/40">{x.mode}</span></span>
                <span className="font-mono text-green">{rupees(Number(x.amount))}</span>
                <form action={deleteSale}><input type="hidden" name="id" value={x.id} /><button className="text-xs text-red-400 hover:underline" aria-label="Delete sale">undo</button></form>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
