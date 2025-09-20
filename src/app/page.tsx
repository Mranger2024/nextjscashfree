'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to payment page with order details
        router.push(`/payment?orderId=${data.orderId}&paymentSessionId=${data.paymentSessionId}`);
      } else {
        setMessage(data.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Book Your <span className="text-emerald-500">Doctor Consultation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get expert medical advice from qualified healthcare professionals. 
            Quick, secure, and convenient online booking with instant payment.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-2xl mx-auto">
          <BookingForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            message={message} 
          />
        </div>
      </div>
    </div>
  );
}
