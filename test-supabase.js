const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ylecbkrvdoyggthtjbab.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZWNia3J2ZG95Z2d0aHRqYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Njk3MDYsImV4cCI6MjA4ODA0NTcwNn0.FSc_sVYAiVwRV2xBqCszmslU2g4surG6-OCwqBE9_bQ');
async function run() {
  const { data, error } = await supabase.from('testimonials').select('*').limit(1);
  console.log('Error:', error);
}
run();
