// Shared Supabase client for every page that needs live data.
// The publishable key is safe to expose in client-side code by design —
// it can only do what the RLS policies in backend/supabase/schema.sql allow.
const SUPABASE_URL = "https://rwvvedejzmjyttrdnkox.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zcwDaDDG8V8ZnDHJkLz72g_41bhKdb0";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
