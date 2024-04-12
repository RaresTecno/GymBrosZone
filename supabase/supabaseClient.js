import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient('https://uzhueypybtukmxtgjpxy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6aHVleXB5YnR1a214dGdqcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NjcwMzgsImV4cCI6MjAyODI0MzAzOH0.5RFeeYx6kaKsEQjyhHZsjKC0tcQyGhtFMc2h_TdSP0E');