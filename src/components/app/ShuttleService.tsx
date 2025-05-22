import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getUserProfile, getShuttleBookings, createShuttleBooking } from '../api/supabaseApi';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

const ShuttleService = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour from now
    passengers: 1,
    specialRequests: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  const [step, setStep] = useState(1);

  const pickupLocations = [
    'Hotel Lobby',
    'Airport',
    'Train Station',
    'Restaurant District',
    'Shopping Mall',
    'Convention Center',
    'Beach',
    'City Center'
  ];

  const dropoffLocations = [
    'Hotel Lobby',
    'Airport',
    'Train Station',
    'Restaurant District',
    'Shopping Mall',
    'Convention Center',
    'Beach',
    'City Center'
  ];

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get user profile
      const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // Get shuttle bookings
      const { data: bookingsData, error: bookingsError } = await getShuttleBookings(session.user.id);
      
      if (bookingsError) throw bookingsError;
      
      setBookings(bookingsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load shuttle service information. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.pickupLocation) {
      setError('Please select a pickup location.');
      return;
    }
    
    if (!formData.dropoffLocation) {
      setError('Please select a dropoff location.');
      return;
    }
    
    if (formData.pickupLocation === formData.dropoffLocation) {
      setError('Pickup and dropoff locations cannot be the same.');
      return;
    }
    
    if (!formData.pickupTime) {
      setError('Please select a pickup time.');
      return;
    }
    
    // Ensure pickup time is at least 30 minutes in the future
    const minTime = new Date(new Date().getTime() + 30 * 60 * 1000);
    if (formData.pickupTime < minTime) {
      setError('Pickup time must be at least 30 minutes from now.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Generate booking number
      const generatedBookingNumber = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Create shuttle booking
      const bookingData = {
        user_id: session.user.id,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        pickup_time: formData.pickupTime.toISOString(),
        passengers: formData.passengers,
        special_requests: formData.specialRequests,
        status: 'confirmed',
        booking_number: generatedBookingNumber
      };
      
      const { data, error } = await createShuttleBooking(bookingData);
      
      if (error) throw error;
      
      setBookingNumber(generatedBookingNumber);
      setSuccess(true);
      setSubmitting(false);
      
      // Reset form
      setFormData({
        pickupLocation: '',
        dropoffLocation: '',
        pickupTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        passengers: 1,
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error submitting shuttle booking:', error);
      setError('Failed to submit your booking. Please try again later.');
      setSubmitting(false);
    }
  };

  const renderBookingHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Shuttle Bookings</Text>
      
      {bookings.length > 0 ? (
        <ScrollView style={styles.bookingsList}>
          {bookings.map(booking => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingNumber}>#{booking.booking_number}</Text>
                <View style={[
                  styles.statusBadge,
                  booking.status === 'confirmed' ? styles.confirmedStatus :
                  booking.status === 'completed' ? styles.completedStatus :
                  booking.status === 'cancelled' ? styles.cancelledStatus :
                  styles.pendingStatus
                ]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
              
              <View style={styles.bookingDetails}>
                <View style={styles.locationContainer}>
                  <View style={styles.locationPoint}>
                    <View style={styles.pickupDot}></View>
                    <Text style={styles.locationLabel}>Pickup</Text>
                  </View>
                  <Text style={styles.locationText}>{booking.pickup_location}</Text>
                </View>
                
                <View style={styles.locationLine}></View>
                
                <View style={styles.locationContainer}>
                  <View style={styles.locationPoint}>
                    <View style={styles.dropoffDot}></View>
                    <Text style={styles.locationLabel}>Dropoff</Text>
                  </View>
                  <Text style={styles.locationText}>{booking.dropoff_location}</Text>
                </View>
              </View>
              
              <View style={styles.bookingInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pickup Time:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(booking.pickup_time).toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Passengers:</Text>
                  <Text style={styles.infoValue}>{booking.passengers}</Text>
                </View>
                
                {booking.special_requests && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Special Requests:</Text>
                    <Text style={styles.infoValue}>{booking.special_requests}</Text>
                  </View>
                )}
              </View>
              
              {booking.status === 'confirmed' && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {/* Handle cancellation */}}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noBookingsText}>You don't have any shuttle bookings yet.</Text>
      )}
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setStep(2)}
      >
        <Text style={styles.buttonText}>Book New Shuttle</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBookingForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Book a Shuttle</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pickup Location</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.locationPicker}
        >
          {pickupLocations.map(location => (
            <TouchableOpacity
              key={location}
              style={[
                styles.locationOption,
                formData.pickupLocation === location && styles.selectedLocationOption
              ]}
              onPress={() => handleInputChange('pickupLocation', location)}
            >
              <Text 
                style={[
                  styles.locationOptionText,
                  formData.pickupLocation === location && styles.selectedLocationOptionText
                ]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dropoff Location</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.locationPicker}
        >
          {dropoffLocations.map(location => (
            <TouchableOpacity
              key={location}
              style={[
                styles.locationOption,
                formData.dropoffLocation === location && styles.selectedLocationOption
              ]}
              onPress={() => handleInputChange('dropoffLocation', location)}
            >
              <Text 
                style={[
                  styles.locationOptionText,
                  formData.dropoffLocation === location && styles.selectedLocationOptionText
                ]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pickup Time</Text>
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={formData.pickupTime}
            onChange={(value) => handleInputChange('pickupTime', value)}
            minDate={new Date(new Date().getTime() + 30 * 60 * 1000)}
            format="y-MM-dd h:mm a"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Passengers</Text>
        <View style={styles.passengerPicker}>
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() => handleInputChange('passengers', Math.max(1, formData.passengers - 1))}
          >
            <Text style={styles.passengerButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.passengerCount}>{formData.passengers}</Text>
          
          <TouchableOpacity
            style={styles.passengerButton}
            onPress={() => handleInputChange('passengers', Math.min(10, formData.passengers + 1))}
          >
            <Text style={styles.passengerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Special Requests (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.specialRequests}
          onChangeText={(value) => handleInputChange('specialRequests', value)}
          placeholder="Any special requirements or requests?"
          multiline
          numberOfLines={4}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setStep(1)}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.primaryButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccessMessage = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Text style={styles.successIconText}>✓</Text>
      </View>
      
      <Text style={styles.successTitle}>Shuttle Booked Successfully!</Text>
      <Text style={styles.successMessage}>
        Your shuttle booking has been confirmed. You will receive a notification before pickup.
      </Text>
      
      <View style={styles.bookingDetails}>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Booking Number:</Text>
          <Text style={styles.bookingDetailValue}>{bookingNumber}</Text>
        </View>
        
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Pickup:</Text>
          <Text style={styles.bookingDetailValue}>{formData.pickupLocation}</Text>
        </View>
        
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Dropoff:</Text>
          <Text style={styles.bookingDetailValue}>{formData.dropoffLocation}</Text>
        </View>
        
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Time:</Text>
          <Text style={styles.bookingDetailValue}>
            {formData.pickupTime.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Passengers:</Text>
          <Text style={styles.bookingDetailValue}>{formData.passengers}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => {
          setSuccess(false);
          setStep(1);
          fetchData();
        }}
      >
        <Text style={styles.buttonText}>Return to Shuttle Service</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading shuttle service...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shuttle Service</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {success ? (
          renderSuccessMessage()
        ) : (
          step === 1 ? renderBookingHistory() : renderBookingForm()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 20,
  },
  bookingsList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  bookingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  confirmedStatus: {
    backgroundColor: '#E3F2FD',
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
  },
  cancelledStatus: {
    backgroundColor: '#FFEBEE',
  },
  pendingStatus: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingDetails: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  dropoffDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666666',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: '#EAEAEA',
    marginLeft: 6,
    marginBottom: 10,
  },
  bookingInfo: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1A2A3A',
  },
  cancelButton: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
  noBookingsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    padding: 20,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2A3A',
    marginBottom: 10,
  },
  locationPicker: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedLocationOption: {
    backgroundColor: '#1A2A3A',
    borderColor: '#1A2A3A',
  },
  locationOptionText: {
    fontSize: 14,
    color: '#1A2A3A',
  },
  selectedLocationOptionText: {
    color: '#FFFFFF',
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  passengerPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  passengerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#1A2A3A',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#1A2A3A',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  successContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  bookingDetails: {
    width: '100%',
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bookingDetailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  bookingDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A2A3A',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
});

export default ShuttleService;
