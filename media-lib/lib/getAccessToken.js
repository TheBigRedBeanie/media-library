"use client";
import { supabase } from "./supabaseClient";

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}