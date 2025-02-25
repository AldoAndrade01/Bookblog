import { createClient } from '@supabase/supabase-js';

// Usa tus propias credenciales de Supabase
const supabaseUrl = 'https://foqxfkkrtruohgeoemyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcXhma2tydHJ1b2hnZW9lbXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjI2MDksImV4cCI6MjA1NTczODYwOX0.qwUJftawZV3aIyWaX6UhKEstBDJPFaGPmbCqvy80Ajg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
