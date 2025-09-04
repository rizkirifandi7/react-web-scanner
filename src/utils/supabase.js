import { createClient } from "@supabase/supabase-js";

const supabaseConfig = createClient(
	"https://iffeainvhizououuhmyq.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZmVhaW52aGl6b3VvdXVobXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDE1NjksImV4cCI6MjA3MjExNzU2OX0.7zguQMtWfa5IlRfEI1krbOKYzA339MrGbypVC0HyAI8"
);

export default supabaseConfig;
