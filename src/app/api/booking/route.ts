import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// Helper function to generate order ID
const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// POST /api/booking - Create booking and initiate payment
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { patientName, email, mobileNumber, bookingDateTime, reason } = body;

    // Validate required fields
    if (!patientName || !email || !mobileNumber || !bookingDateTime || !reason) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Validate Cashfree configuration
    const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
    const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return NextResponse.json({ 
        message: 'Cashfree configuration is missing. Please check CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables.' 
      }, { status: 500 });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create booking in database
    await Booking.create({
      patientName,
      email,
      mobileNumber,
      orderId,
      bookingDateTime: new Date(bookingDateTime),
      reason,
      amount: 500.00,
      status: 'pending'
    });

    // Initialize Cashfree SDK
    const cashfree = new Cashfree(
      process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
      CASHFREE_APP_ID,
      CASHFREE_SECRET_KEY
    );

    // Create Cashfree order using SDK
    const orderData = {
      order_amount: 500.00,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_phone: mobileNumber,
        customer_name: patientName,
        customer_email: email
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?order_id=${orderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
        payment_methods: "cc,dc,upi"
      },
      cart_details: {
        cart_items: [
          {
            item_id: "consultation_fee",
            item_name: "Doctor Consultation",
            item_description: `Consultation for: ${reason}`,
            item_original_unit_price: 500.00,
            item_discounted_unit_price: 500.00,
            item_quantity: 1,
            item_currency: "INR"
          }
        ]
      },
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      order_note: `Booking for ${patientName} - ${reason}`,
      order_tags: {
        booking_type: "doctor_consultation",
        patient_name: patientName
      }
    };

    console.log('Creating Cashfree order with data:', orderData);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderData);
    console.log('Cashfree response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {
      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link || cashfreeResponse.data.payments?.url,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create payment session');
    }

  } catch (error: any) {
    console.error('Booking error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    return NextResponse.json({ 
      message: 'Failed to create booking',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    }, { status: 500 });
  }
}