import { createClient } from '@supabase/supabase-js'

// Support standard Supabase naming or the user provided keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PROJECT_URL || "https://bnzqxtsjbgivneaxnqzu.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE || import.meta.env.VITE_SUPABASE_SECRET

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase Environment Variables. Database features will not work.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
