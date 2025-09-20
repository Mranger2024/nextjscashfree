'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setError('No order ID found');
      setLoading(false);
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      // Single API call: verify payment and get booking data
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.message || 'Payment verification failed');
      }
    } catch {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Booking
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your consultation has been booked successfully.</p>

          {booking && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Patient:</span> {booking.patientName}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date:</span> {new Date(booking.bookingDateTime).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Time:</span> {new Date(booking.bookingDateTime).toLocaleTimeString()}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Order ID:</span> {booking.orderId}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Amount:</span> ₹{booking.amount}
                </div>
                {booking.paymentMethod && (
                  <div>
                    <span className="font-medium text-gray-600">Payment Method:</span> {booking.paymentMethod}
                  </div>
                )}
                {booking.paymentId && (
                  <div>
                    <span className="font-medium text-gray-600">Payment ID:</span> {booking.paymentId}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Book Another Consultation
            </button>
            <p className="text-xs text-gray-400">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}