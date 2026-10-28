"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <form action={action} className="card flex w-full max-w-sm flex-col gap-4 p-8">
        <p className="label text-green">Hustle Mania portal</p>
        <h1 className="display text-3xl">Sign in</h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className="input" />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className="input" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="btn" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        <Link href="/" className="text-center text-sm text-white/60 hover:text-green">← Back to site</Link>
      </form>
    </main>
  );
}
