import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

/**
 * Health check endpoint for the application
 * Used by Docker and other monitoring tools to verify the application is running
 */
export async function GET() {
  try {
    // Check database connection
    const { data, error } = await supabase.from('bookings').select('count', { count: 'exact' }).limit(0);
    
    if (error) {
      console.error('Health check failed - Database error:', error);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }, { status: 500 });
    }
    
    // All checks passed
    return NextResponse.json({ 
      status: 'healthy', 
      message: 'Service is running correctly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Service health check failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}