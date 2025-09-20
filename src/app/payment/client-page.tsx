'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { load } from '@cashfreepayments/cashfree-js';

export default function PaymentClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');
  const paymentSessionId = searchParams.get('paymentSessionId');

  useEffect(() => {
    if (!orderId || !paymentSessionId) {
      setError('Missing payment information');
      return;
    }

    initializePayment();
  }, [orderId, paymentSessionId]);

  const initializePayment = async () => {
    try {
      const cashfree = await load({ mode: 'sandbox' });
      
      // Ensure paymentSessionId is not null (we already checked above, but TypeScript needs this)
      if (!paymentSessionId) {
        throw new Error('Payment session ID is required');
      }
      
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self' as const,
      };

      await cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initialize payment');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Initializing Payment</h2>
          <p className="text-gray-600">Please wait while we redirect you to the payment gateway...</p>
        </div>
      </div>
    </div>
  );
}