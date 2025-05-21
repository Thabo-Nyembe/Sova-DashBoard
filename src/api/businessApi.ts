// Additional API functions for the BusinessDashboard component
import { supabase } from '../../supabaseClient';

// Fetch all bookings
export const fetchBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      user_id,
      check_in_date,
      check_out_date,
      status,
      created_at,
      users (
        name,
        email
      )
    `)
    .order('check_in_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  
  // Format the data to match the expected structure
  return data.map(booking => ({
    id: booking.id,
    guest_name: booking.users?.name || 'Guest',
    room_type: 'Standard', // This would come from a room_types table in a real app
    check_in_date: booking.check_in_date,
    check_out_date: booking.check_out_date,
    status: booking.status,
    created_at: booking.created_at
  }));
};

// Fetch housekeeping status
export const fetchHousekeepingStatus = async () => {
  // In a real app, this would come from a housekeeping_status table
  // For now, we'll return mock data that would typically come from the database
  return {
    clean: 42,
    dirty: 15,
    maintenance: 8,
    outOfOrder: 3,
  };
};

// Fetch guest satisfaction data
export const fetchGuestSatisfaction = async () => {
  // In a real app, this would come from a satisfaction_ratings table
  // For now, we'll return mock data that would typically come from the database
  return {
    overall: 4.7,
    cleanliness: 4.8,
    service: 4.6,
    amenities: 4.5,
    value: 4.4,
    recentFeedback: [
      { id: '1', guest: 'Emma Thompson', rating: 5, comment: 'Exceptional service and beautiful rooms. The staff went above and beyond.', date: '2025-05-20' },
      { id: '2', guest: 'Michael Brown', rating: 4, comment: 'Great stay overall. The spa services were excellent but restaurant was a bit slow.', date: '2025-05-19' },
      { id: '3', guest: 'Olivia Martinez', rating: 5, comment: 'Perfect location and amazing views. Will definitely return!', date: '2025-05-18' },
    ]
  };
};

// Create a new booking
export const createBooking = async (userId: string, checkInDate: string, checkOutDate: string, status: string = 'confirmed') => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      { 
        user_id: userId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        status: status
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  
  return data[0];
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: status })
    .eq('id', bookingId)
    .select();
  
  if (error) {
    console.error('Error updating booking status:', error);
    return null;
  }
  
  return data[0];
};
