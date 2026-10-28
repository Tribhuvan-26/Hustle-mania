"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile, supabaseServer } from "@/lib/supabase";

export async function login(_: string | null, form: FormData) {
  const db = await supabaseServer();
  const { error } = await db.auth.signInWithPassword({
    email: String(form.get("email")),
    password: String(form.get("password")),
  });
  if (error) return "Wrong email or password.";
  const { data: { user } } = await db.auth.getUser();
  const { data: p } = await db.from("profiles").select("role").eq("id", user!.id).single();
  if (!p) return "No portal access for this account. Ask the admin.";
  redirect(p.role === "admin" ? "/admin" : "/stall");
}

export async function logout() {
  const db = await supabaseServer();
  await db.auth.signOut();
  redirect("/login");
}

export async function addSale(_: string | null, form: FormData) {
  const { db, profile } = await requireProfile("stall");
  const item = String(form.get("item")).trim();
  const qty = Number(form.get("qty"));
  const amount = Number(form.get("amount"));
  if (!item || !(qty > 0) || !(amount >= 0)) return "Check item, qty and amount.";
  const { error } = await db.from("sales").insert({
    stall_id: profile.stall_id,
    item,
    qty,
    amount,
    mode: form.get("mode") === "upi" ? "upi" : "cash",
  });
  if (error) return error.message;
  revalidatePath("/stall");
  return null;
}

export async function deleteSale(form: FormData) {
  const { db } = await requireProfile();
  await db.from("sales").delete().eq("id", String(form.get("id")));
  revalidatePath("/stall");
  revalidatePath("/admin");
}
