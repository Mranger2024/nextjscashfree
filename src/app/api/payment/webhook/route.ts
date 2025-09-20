import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// POST /api/payment/webhook - Handle Cashfree webhooks
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    const { 
      orderId, 
      orderAmount, 
      orderCurrency, 
      orderStatus, 
      paymentId,
      paymentAmount,
      paymentCurrency,
      paymentStatus,
      paymentMessage,
      paymentTime,
      bankReference,
      authId,
      paymentMethod
    } = body;

    if (!orderId) {
      console.error('Webhook missing orderId');
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Update booking status in database
    const booking = await Booking.findOne({ orderId });
    if (booking) {
      console.log(`Updating booking ${orderId} from status: ${booking.status} to: ${orderStatus}`);
      
      // Prepare update data
      const updateData: Partial<typeof booking> = {};
      
      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          updateData.status = 'paid';
          updateData.paymentId = paymentId || authId || 'PAYMENT_COMPLETED';
          updateData.paymentMethod = paymentMethod;
          updateData.paymentTime = paymentTime;
          updateData.bankReference = bankReference;
          console.log(`Payment successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          updateData.status = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          updateData.status = 'failed';
          updateData.paymentMessage = paymentMessage;
          console.log(`Payment failed for order ${orderId}: ${paymentMessage}`);
          break;
          
        case 'PENDING':
          updateData.status = 'pending';
          console.log(`Payment pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          updateData.status = orderStatus?.toLowerCase() as any;
      }
      
      // Update booking with new data
      await Booking.findOneAndUpdate({ orderId }, updateData);
      console.log(`Booking ${orderId} updated successfully`);
    } else {
      console.error(`Booking not found for orderId: ${orderId}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: orderId,
      status: orderStatus
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      message: 'Failed to process webhook',
      error: error.message 
    }, { status: 500 });
  }
}