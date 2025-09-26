'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// This component handles the payment initialization
function PaymentContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const paymentSessionId = searchParams.get('paymentSessionId');

  useEffect(() => {
    if (!paymentSessionId) {
      setError('Payment session ID is missing');
      setIsLoading(false);
      return;
    }

    const initializePayment = async () => {
      try {
        const response = await fetch('/api/payment/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentSessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize payment');
        }

        // Load Cashfree SDK and initialize payment
        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({ mode: 'production' });
        
        await cashfree.checkout({
          paymentSessionId,
          redirectTarget: '_self' as const,
        });
      } catch (error) {
        console.error('Payment error:', error);
        setError('Failed to process payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [paymentSessionId, router]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h1>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoading ? 'Preparing payment gateway...' : 'Redirecting to secure payment page...'}
        </p>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  );
}