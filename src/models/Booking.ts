import { supabase } from '@/lib/db';

// Define the Booking interface
export interface IBooking {
  id?: string;
  patientName: string;
  email: string;
  mobileNumber: string;
  bookingDateTime: Date | string;
  reason: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'completed';
  paymentId?: string | null;
  paymentMethod?: string | null;
  paymentTime?: string | null;
  bankReference?: string | null;
  paymentMessage?: string | null;
  orderId: string;
  amount: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Booking model functions
const Booking = {
  // Create a new booking
  async create(bookingData: Omit<IBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<IBooking> {
    const now = new Date().toISOString();
    
    const booking = {
      ...bookingData,
      amount: bookingData.amount || 500, // Default amount
      status: bookingData.status || 'pending',
      createdAt: now,
      updatedAt: now
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
      
    if (error) throw error;
    return data as IBooking;
  },
  
  // Find a booking by orderId
  async findOne(filter: { orderId?: string; id?: string }): Promise<IBooking | null> {
    let query = supabase.from('bookings').select('*');
    
    if (filter.orderId) {
      query = query.eq('orderId', filter.orderId);
    } else if (filter.id) {
      query = query.eq('id', filter.id);
    }
    
    const { data, error } = await query.single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    
    return data as IBooking;
  },
  
  // Update a booking
  async findOneAndUpdate(filter: { orderId: string }, updateData: Partial<IBooking>): Promise<IBooking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .eq('orderId', filter.orderId)
      .select()
      .single();
      
    if (error) throw error;
    return data as IBooking;
  },
  
  // Save method to mimic mongoose's save
  async save(booking: IBooking): Promise<IBooking> {
    if (booking.id) {
      // Update existing booking
      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...booking,
          updatedAt: new Date().toISOString()
        })
        .eq('id', booking.id)
        .select()
        .single();
        
      if (error) throw error;
      return data as IBooking;
    } else {
      // Create new booking
      return await this.create(booking);
    }
  }
};

export default Booking;