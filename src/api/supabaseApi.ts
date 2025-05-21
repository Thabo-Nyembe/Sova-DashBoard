import { supabase } from '../../supabaseClient';

// User and Profile API functions
export const fetchUserProfile = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', userId)
    .single();
  
  if (userError) {
    console.error('Error fetching user data:', userError);
    return null;
  }
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('bio')
    .eq('user_id', userId)
    .single();
  
  if (profileError && profileError.code !== 'PGRST116') { // Not found is ok
    console.error('Error fetching profile data:', profileError);
  }
  
  return {
    ...userData,
    profile: profileData || {}
  };
};

// Bookings API functions
export const fetchUpcomingStay = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      check_in_date,
      check_out_date,
      status,
      cities(name, countries(name))
    `)
    .eq('user_id', userId)
    .gte('check_in_date', today)
    .order('check_in_date', { ascending: true })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found is ok
    console.error('Error fetching upcoming stay:', error);
    return null;
  }
  
  if (!data) return null;
  
  // Format the data to match the expected structure
  return {
    hotelName: `SOVA Grand ${data.cities?.name || 'Hotel'}`,
    location: `${data.cities?.name || ''}, ${data.cities?.countries?.name || ''}`,
    checkIn: data.check_in_date,
    checkOut: data.check_out_date,
    status: data.status
  };
};

// Amenities API functions
export const fetchAmenities = async () => {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .eq('availability', true);
  
  if (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
  
  return data;
};

// Offers API functions
export const fetchOffers = async () => {
  // In a real app, you would have an offers table
  // For now, we'll return mock data that would typically come from the database
  return [
    {
      id: '1',
      title: 'Free Night Stay',
      description: 'Book 3 nights, get 1 night free',
      validUntil: '2025-08-30',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '2',
      title: 'Spa Credit',
      description: '$100 spa credit with any booking',
      validUntil: '2025-07-15',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '3',
      title: 'Room Upgrade',
      description: 'Complimentary upgrade to suite',
      validUntil: '2025-09-01',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bHV4dXJ5JTIwc3VpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    },
  ];
};

// Room Service API functions
export const fetchRoomServiceRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('room_service')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching room service requests:', error);
    return [];
  }
  
  return data;
};

// Create a new room service request
export const createRoomServiceRequest = async (userId: string, item: string, quantity: number) => {
  const { data, error } = await supabase
    .from('room_service')
    .insert([
      { 
        user_id: userId,
        item,
        quantity,
        status: 'pending'
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating room service request:', error);
    return null;
  }
  
  return data[0];
};

// Shuttle Booking API functions
export const fetchShuttleBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('shuttle_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('pickup_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching shuttle bookings:', error);
    return [];
  }
  
  return data;
};

// Create a new shuttle booking
export const createShuttleBooking = async (userId: string, pickupTime: string, dropoffLocation: string) => {
  const { data, error } = await supabase
    .from('shuttle_bookings')
    .insert([
      { 
        user_id: userId,
        pickup_time: pickupTime,
        dropoff_location: dropoffLocation,
        status: 'pending'
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating shuttle booking:', error);
    return null;
  }
  
  return data[0];
};

// Orders API functions
export const fetchOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return data;
};

// Create a new order
export const createOrder = async (userId: string, item: string, quantity: number, totalAmount: number) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      { 
        user_id: userId,
        item,
        quantity,
        total_amount: totalAmount,
        status: 'pending'
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  
  return data[0];
};
