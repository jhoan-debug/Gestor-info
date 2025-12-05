import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omtzdisxefzpkrxczowr.supabase.co';  // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdHpkaXN4ZWZ6cGtyeGN6b3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDkyMjgsImV4cCI6MjA3NjIyNTIyOH0.SfkdpPNj7SIxwKxuqi66NMAgA5Dh5X3WyN9ErP-ZvVw';  // Reemplaza con tu clave anónima

export const supabase = createClient(supabaseUrl, supabaseKey);