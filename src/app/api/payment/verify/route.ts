import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// POST /api/payment/verify - Verify payment status and return booking data
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    console.log(`Verifying payment for order: ${orderId}`);

    // Validate Cashfree configuration
    const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
    const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return NextResponse.json({ 
        message: 'Cashfree configuration is missing. Please check CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables.' 
      }, { status: 500 });
    }

    // Initialize Cashfree SDK in PRODUCTION mode
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION, // Using PRODUCTION for live environment
      CASHFREE_APP_ID,
      CASHFREE_SECRET_KEY
    );
    
    console.log('Initialized Cashfree in PRODUCTION mode for verification');

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || cashfreeResponse.data.payments || {};

    // Update booking status in database
    const booking = await Booking.findOne({ orderId });
    if (booking) {
      console.log(`Updating booking ${orderId} from status: ${booking.status} to: ${orderStatus}`);
      
      // Prepare update data
      const updateData: Partial<typeof booking> = {};
      
      // Handle different payment statuses
      switch (orderStatus || '') {
        case 'PAID':
          updateData.status = 'paid';
          updateData.paymentId = paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED';
          updateData.paymentMethod = paymentDetails.payment_method;
          updateData.paymentTime = paymentDetails.payment_time;
          updateData.bankReference = paymentDetails.bank_reference;
          console.log(`Payment verified as successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          updateData.status = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          updateData.status = 'failed';
          updateData.paymentMessage = paymentDetails.payment_message;
          console.log(`Payment failed for order ${orderId}`);
          break;
          
        case 'PENDING':
          updateData.status = 'pending';
          console.log(`Payment still pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          updateData.status = orderStatus?.toLowerCase() as any;
      }
      
      // Update booking with new data
      await Booking.findOneAndUpdate({ orderId }, updateData);
      console.log(`Booking ${orderId} updated successfully`);

      // Return both verification result and booking data
      return NextResponse.json({
        success: true,
        orderStatus: orderStatus,
        bookingStatus: booking.status,
        paymentDetails: paymentDetails,
        booking: {
          id: booking.id,
          patientName: booking.patientName,
          email: booking.email,
          mobileNumber: booking.mobileNumber,
          bookingDateTime: booking.bookingDateTime,
          reason: booking.reason,
          status: booking.status,
          orderId: booking.orderId,
          amount: booking.amount,
          paymentId: booking.paymentId,
          paymentMethod: booking.paymentMethod,
          paymentTime: booking.paymentTime,
          bankReference: booking.bankReference,
          paymentMessage: booking.paymentMessage,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        }
      });
    } else {
      console.error(`Booking not found for orderId: ${orderId}`);
      return NextResponse.json({
        success: false,
        message: 'Booking not found',
        orderStatus: orderStatus
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Payment verification error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    return NextResponse.json({ 
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    }, { status: 500 });
  }
}