import { createClient } from '@supabase/supabase-js';

// Supabase configuration with the provided URL and anon key
const supabaseUrl = 'https://wmwzrwvfydqbiroxlxgz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3pyd3ZmeWRxYmlyb3hseGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjE4MzMsImV4cCI6MjA2MzQzNzgzM30.2Qg8aOxkQW80gBhnqyMPDuDv5WNb4-50arV1ykyqoXA';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

// User profile helpers
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);
  return { data, error };
};

// Booking helpers
export const getBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: true });
  return { data, error };
};

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData]);
  return { data, error };
};

export const updateBooking = async (bookingId, updates) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId);
  return { data, error };
};

// Room service helpers
export const getRoomServiceRequests = async (userId) => {
  const { data, error } = await supabase
    .from('room_service')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createRoomServiceRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('room_service')
    .insert([requestData]);
  return { data, error };
};

// Shuttle booking helpers
export const getShuttleBookings = async (userId) => {
  const { data, error } = await supabase
    .from('shuttle_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('pickup_time', { ascending: true });
  return { data, error };
};

export const createShuttleBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('shuttle_bookings')
    .insert([bookingData]);
  return { data, error };
};

// Amenities helpers
export const getAmenities = async () => {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

// Countries and Cities helpers
export const getCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

export const getCitiesByCountry = async (countryId) => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_id', countryId)
    .order('name', { ascending: true });
  return { data, error };
};

// Orders helpers
export const getOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData]);
  return { data, error };
};

export const updateOrder = async (orderId, updates) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);
  return { data, error };
};

// Business dashboard helpers
export const getAllBookings = async (filters = {}) => {
  let query = supabase
    .from('bookings')
    .select('*, users(name, email)');
  
  // Apply filters if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.startDate && filters.endDate) {
    query = query.gte('check_in_date', filters.startDate)
      .lte('check_out_date', filters.endDate);
  }
  
  const { data, error } = await query.order('check_in_date', { ascending: true });
  return { data, error };
};

export const getAllRoomServiceRequests = async (filters = {}) => {
  let query = supabase
    .from('room_service')
    .select('*, users(name, email)');
  
  // Apply filters if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.date) {
    query = query.gte('created_at', filters.date)
      .lt('created_at', new Date(new Date(filters.date).getTime() + 86400000).toISOString());
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getAllShuttleBookings = async (filters = {}) => {
  let query = supabase
    .from('shuttle_bookings')
    .select('*, users(name, email)');
  
  // Apply filters if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.date) {
    query = query.gte('pickup_time', filters.date)
      .lt('pickup_time', new Date(new Date(filters.date).getTime() + 86400000).toISOString());
  }
  
  const { data, error } = await query.order('pickup_time', { ascending: true });
  return { data, error };
};

export const getAllOrders = async (filters = {}) => {
  let query = supabase
    .from('orders')
    .select('*, users(name, email)');
  
  // Apply filters if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.date) {
    query = query.gte('created_at', filters.date)
      .lt('created_at', new Date(new Date(filters.date).getTime() + 86400000).toISOString());
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Reporting helpers
export const getOccupancyReport = async (startDate, endDate) => {
  // For now, we'll calculate this from bookings data
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('check_in_date', startDate)
    .lte('check_out_date', endDate);
  
  if (error) {
    return { data: null, error };
  }
  
  // Process bookings to calculate occupancy
  // This is a simplified example - in a real app, this would be a database function
  const totalRooms = 68; // Example total rooms
  const daysInRange = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
  const occupancyData = [];
  
  for (let i = 0; i < daysInRange; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const occupiedRooms = bookings.filter(b => 
      new Date(b.check_in_date) <= currentDate && 
      new Date(b.check_out_date) > currentDate
    ).length;
    
    const occupancyRate = (occupiedRooms / totalRooms) * 100;
    
    occupancyData.push({
      date: dateString,
      occupancy_rate: occupancyRate,
      occupied_rooms: occupiedRooms,
      total_rooms: totalRooms
    });
  }
  
  return { data: occupancyData, error: null };
};

export const getRevenueReport = async (startDate, endDate) => {
  // For now, we'll calculate this from orders data
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate);
  
  if (error) {
    return { data: null, error };
  }
  
  // Process orders to calculate revenue
  // This is a simplified example - in a real app, this would be a database function
  const daysInRange = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
  const revenueData = [];
  
  for (let i = 0; i < daysInRange; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const dayOrders = orders.filter(o => 
      new Date(o.created_at).toISOString().split('T')[0] === dateString
    );
    
    const totalRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    revenueData.push({
      date: dateString,
      total_revenue: totalRevenue,
      order_count: dayOrders.length
    });
  }
  
  return { data: revenueData, error: null };
};

export const getGuestSatisfactionReport = async (startDate, endDate) => {
  // For a real app, this would come from a feedback table
  // For now, we'll return mock data
  const mockData = {
    overall: 4.7,
    cleanliness: 4.8,
    service: 4.6,
    amenities: 4.5,
    value: 4.3,
    recentFeedback: [
      {
        id: '1',
        guest: 'John Smith',
        rating: 5,
        comment: 'Excellent service and beautiful property. The staff was very attentive.',
        date: '2025-05-15'
      },
      {
        id: '2',
        guest: 'Sarah Johnson',
        rating: 4,
        comment: 'Great stay overall. The room was clean and comfortable. Would recommend.',
        date: '2025-05-14'
      },
      {
        id: '3',
        guest: 'Michael Brown',
        rating: 5,
        comment: 'The digital check-in process was seamless. Loved the mobile room key feature!',
        date: '2025-05-12'
      }
    ]
  };
  
  return { data: mockData, error: null };
};

// Housekeeping status helper (mock data for now)
export const fetchHousekeepingStatus = async () => {
  // For a real app, this would come from a housekeeping table
  // For now, we'll return mock data
  const mockData = {
    clean: 42,
    dirty: 15,
    maintenance: 8,
    outOfOrder: 3
  };
  
  return mockData;
};

// Real-time subscriptions
export const subscribeToBookings = (callback) => {
  return supabase
    .channel('bookings-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'bookings' 
    }, callback)
    .subscribe();
};

export const subscribeToRoomService = (callback) => {
  return supabase
    .channel('room-service-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'room_service' 
    }, callback)
    .subscribe();
};

export const subscribeToShuttleBookings = (callback) => {
  return supabase
    .channel('shuttle-bookings-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'shuttle_bookings' 
    }, callback)
    .subscribe();
};

export const subscribeToOrders = (callback) => {
  return supabase
    .channel('orders-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'orders' 
    }, callback)
    .subscribe();
};

// Storage helpers for profile images and other assets
export const uploadProfileImage = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `profile-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return { data: publicUrlData, error: null };
};

export const getProfileImageUrl = (filePath) => {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Helper function for fetching bookings (used by BusinessDashboard)
export const fetchBookings = async () => {
  const { data, error } = await getAllBookings();
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data || [];
};

// Helper function for fetching room service requests (used by BusinessDashboard)
export const fetchRoomServiceRequests = async () => {
  const { data, error } = await getAllRoomServiceRequests();
  if (error) {
    console.error('Error fetching room service requests:', error);
    return [];
  }
  return data || [];
};

// Helper function for fetching guest satisfaction (used by BusinessDashboard)
export const fetchGuestSatisfaction = async () => {
  const { data, error } = await getGuestSatisfactionReport();
  if (error) {
    console.error('Error fetching guest satisfaction:', error);
    return {
      overall: 0,
      cleanliness: 0,
      service: 0,
      amenities: 0,
      value: 0,
      recentFeedback: []
    };
  }
  return data;
};
