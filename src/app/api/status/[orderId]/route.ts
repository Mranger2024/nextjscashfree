
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// GET /api/status/:orderId - Get booking status
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    
    const params = await context.params;
    const { orderId } = params;

    const booking = await Booking.findOne({ orderId });
    
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json({ 
      message: 'Failed to get booking status',
      error: error.message 
    }, { status: 500 });
  }
}