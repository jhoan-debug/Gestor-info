import { createClient } from '@supabase/supabase-js';

// Cliente supabase: crea una instancia para usar en todo el frontend
// ATENCIÓN: Actualmente la URL y la clave están en el código.
// - No comites keys sensibles al repositorio.
// - En producción usa variables de entorno (por ejemplo Vite: import.meta.env.VITE_SUPABASE_URL).
// - La clave que aquí aparece es la "anon" pública; aun así es buena práctica moverla a env.
const supabaseUrl = 'https://omtzdisxefzpkrxczowr.supabase.co';  // Reemplaza con tu URL de Supabase o variable de entorno
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdHpkaXN4ZWZ6cGtyeGN6b3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDkyMjgsImV4cCI6MjA3NjIyNTIyOH0.SfkdpPNj7SIxwKxuqi66NMAgA5Dh5X3WyN9ErP-ZvVw';  // Reemplaza con tu clave anónima

// Exporta la instancia para importarla en componentes/servicios
export const supabase = createClient(supabaseUrl, supabaseKey);