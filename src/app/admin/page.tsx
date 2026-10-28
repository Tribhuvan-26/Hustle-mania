import { requireProfile } from "@/lib/supabase";
import { Shell, Stat, rupees } from "../Shell";
import { StallChart } from "./StallChart";

export const metadata = { title: "Admin — Hustle Mania", robots: { index: false } };
export const instant = false; // per-user data, render on request

export default async function Admin() {
  const { db, profile } = await requireProfile("admin");
  const [{ data: stalls }, { data: sales }] = await Promise.all([
    db.from("stalls").select("id, name, owner").order("name"),
    db.from("sales").select("id, stall_id, item, qty, amount, mode, created_at").order("created_at", { ascending: false }),
  ]);

  const rows = (stalls ?? []).map((s) => {
    const mine = (sales ?? []).filter((x) => x.stall_id === s.id);
    return {
      ...s,
      orders: mine.length,
      units: mine.reduce((n, x) => n + x.qty, 0),
      revenue: mine.reduce((n, x) => n + Number(x.amount), 0),
      upi: mine.filter((x) => x.mode === "upi").reduce((n, x) => n + Number(x.amount), 0),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const total = rows.reduce((n, r) => n + r.revenue, 0);
  const upi = rows.reduce((n, r) => n + r.upi, 0);
  const nameOf = (id: string) => stalls?.find((s) => s.id === id)?.name ?? "—";

  return (
    <Shell title="All stalls" who={`Admin · ${profile.name ?? ""}`}>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total sales" value={rupees(total)} />
        <Stat label="Orders" value={sales?.length ?? 0} />
        <Stat label="UPI" value={rupees(upi)} />
        <Stat label="Cash" value={rupees(total - upi)} />
      </section>

      <section className="card p-6">
        <h2 className="label mb-4 text-blue">Revenue by stall</h2>
        <StallChart data={rows.map((r) => ({ name: r.name, revenue: r.revenue }))} />
      </section>

      <section className="card overflow-x-auto p-6">
        <h2 className="label mb-4 text-blue">Stall-wise data</h2>
        <table className="w-full text-left text-sm">
          <thead className="label text-white/50">
            <tr><th className="py-2">#</th><th>Stall</th><th>Owner</th><th className="text-right">Orders</th><th className="text-right">Units</th><th className="text-right">Revenue</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-3 font-mono text-white/50">{i + 1}</td>
                <td className="font-bold">{r.name}</td>
                <td className="text-white/70">{r.owner}</td>
                <td className="text-right font-mono">{r.orders}</td>
                <td className="text-right font-mono">{r.units}</td>
                <td className="text-right font-mono text-green">{rupees(r.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card overflow-x-auto p-6">
        <h2 className="label mb-4 text-blue">Latest sales</h2>
        <table className="w-full text-left text-sm">
          <tbody>
            {(sales ?? []).slice(0, 25).map((x) => (
              <tr key={x.id} className="border-t border-white/10">
                <td className="py-2 font-mono text-white/50">{new Date(x.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{nameOf(x.stall_id)}</td>
                <td>{x.item} × {x.qty}</td>
                <td className="uppercase text-white/50">{x.mode}</td>
                <td className="text-right font-mono text-green">{rupees(Number(x.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}
