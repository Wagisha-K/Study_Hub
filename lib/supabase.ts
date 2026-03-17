import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qdslxwhpkdqarkwsbngn.supabase.co";
const supabaseKey = "sb_publishable_UlYrzwm4crwVFyTEW3tWhQ_sYfKGpRG";

export const supabase = createClient(supabaseUrl, supabaseKey);