import Link from "next/link";
import { STALLS } from "@/lib/stalls";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="label flex items-center gap-3 text-green">
        <span className="h-2.5 w-2.5 rounded-full border border-green bg-[linear-gradient(90deg,#33ff67_50%,transparent_50%)]" />
        Equinox 2.0 · 30–31 Oct · MLRIT
      </p>
      <h1 className="display mt-5 text-[clamp(3rem,10vw,8rem)] leading-[0.9]">
        Hustle <span className="text-green">Mania</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/80">
        The Equinox stall expo: food, games, crafts and more. Come hungry, leave with stuff.
      </p>
      <Link href="/login" className="btn mt-8">Stall / Admin login</Link>

      <h2 className="display mt-20 text-3xl">The stalls</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STALLS.map((s, i) => (
          <li key={s.name} className="card p-6 transition hover:border-green">
            <p className="label text-blue">Stall {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-xl font-bold">{s.name}</h3>
            {s.owner && <p className="mt-1 font-mono text-xs text-green">{s.owner}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
