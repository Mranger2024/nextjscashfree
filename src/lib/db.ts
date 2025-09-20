import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to initialize database connection
export async function connectDB() {
  try {
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('bookings').select('count', { count: 'exact' }).limit(0);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Connected to Supabase');
    return supabase;
  } catch (e) {
    console.error('❌ Supabase connection error:', e);
    throw e;
  }
}

// Export supabase client for direct use
export { supabase };