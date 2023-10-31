import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient("https://mfhqsajchivethmxjywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maHFzYWpjaGl2ZXRobXhqeXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3ODkxNTQsImV4cCI6MjAxNDM2NTE1NH0.3CX235BOqJdgvme_l4gCDGQ_iN7UGRQY_YGf2ESfX0s", {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});
