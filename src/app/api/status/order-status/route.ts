import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// GET /api/status/order-status?orderId=:orderId - Get booking status
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({ orderId });
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return the booking data
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id || '',
        patientName: booking.patientName,
        email: booking.email,
        mobileNumber: booking.mobileNumber,
        bookingDateTime: new Date(booking.bookingDateTime),
        reason: booking.reason,
        status: booking.status,
        orderId: booking.orderId,
        amount: booking.amount,
        ...(booking.paymentId && { paymentId: booking.paymentId }),
        ...(booking.paymentMethod && { paymentMethod: booking.paymentMethod }),
        ...(booking.paymentTime && { paymentTime: booking.paymentTime }),
        ...(booking.bankReference && { bankReference: booking.bankReference }),
        ...(booking.paymentMessage && { paymentMessage: booking.paymentMessage }),
        createdAt: new Date(booking.createdAt || Date.now()),
        updatedAt: new Date(booking.updatedAt || Date.now())
      }
    });

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to get booking status',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
