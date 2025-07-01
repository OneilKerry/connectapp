import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://urhkgblikosidrqlajix.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyaGtnYmxpa29zaWRycWxhaml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDQzMDIsImV4cCI6MjA2NjMyMDMwMn0.bMq_BtZB2DFfRSxUtaABH7XWVE-yoPXqFXo6mv8dM3s"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
