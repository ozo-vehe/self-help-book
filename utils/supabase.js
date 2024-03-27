import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yyjyongxvhlzolvgdopk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5anlvbmd4dmhsem9sdmdkb3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxNTkyNzUsImV4cCI6MjAxMTczNTI3NX0.K4pbhbgh3jGgRXW0nh2NtIW7sL_a8WXwgoN6d2nG-yY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})