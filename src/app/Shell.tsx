import { logout } from "./actions";

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function Shell({ title, who, children }: { title: string; who: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label text-green">{who}</p>
          <h1 className="display text-4xl">{title}</h1>
        </div>
        <form action={logout}><button className="btn btn-ghost">Sign out</button></form>
      </header>
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </main>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="label text-white/50">{label}</p>
      <p className="mt-1 text-3xl font-black text-green">{value}</p>
    </div>
  );
}
