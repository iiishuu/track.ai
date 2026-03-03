import { createClient } from "@supabase/supabase-js";
import { env } from "@/backend/config/env";

export function getSupabaseClient() {
  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function getSupabaseAdmin() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
}
