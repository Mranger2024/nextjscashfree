import { NextResponse } from 'next/server';
import { load } from '@cashfreepayments/cashfree-js';

export async function POST(request: Request) {
  try {
    const { paymentSessionId } = await request.json();
    
    if (!paymentSessionId) {
      return NextResponse.json(
        { error: 'Payment session ID is required' },
        { status: 400 }
      );
    }

    const cashfree = await load({ 
      mode: 'production'
    });
    
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: '_self' as const,
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
