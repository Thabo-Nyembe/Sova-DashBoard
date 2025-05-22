import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getUserProfile, getBookings, getRoomServiceRequests, getShuttleBookings } from '../api/supabaseApi';

const DigitalCheckIn = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    estimatedArrival: '',
    specialRequests: '',
    identificationUploaded: false,
    termsAccepted: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get user profile
      const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // Get upcoming booking
      const { data: bookingsData, error: bookingsError } = await getBookings(session.user.id);
      
      if (bookingsError) throw bookingsError;
      
      // Find the next upcoming booking that hasn't been checked in
      const upcomingBooking = bookingsData?.find(b => 
        new Date(b.check_in_date) >= new Date() && 
        b.status !== 'checked_in' &&
        b.status !== 'checked_out'
      );
      
      setBooking(upcomingBooking);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load your booking information. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckIn = async () => {
    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions to proceed.');
      return;
    }

    try {
      setLoading(true);
      
      // Update booking status to checked_in
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'checked_in',
          arrival_time: formData.estimatedArrival,
          special_requests: formData.specialRequests
        })
        .eq('id', booking.id);
      
      if (updateError) throw updateError;
      
      // Move to success step
      setStep(4);
      setLoading(false);
    } catch (error) {
      console.error('Error during check-in:', error);
      setError('Failed to complete check-in. Please try again or contact reception.');
      setLoading(false);
    }
  };

  const renderBookingDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Booking Details</Text>
      
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{booking.id.substring(0, 8)}</Text>
          <Text style={styles.bookingStatus}>{booking.status}</Text>
        </View>
        
        <View style={styles.bookingDates}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{new Date(booking.check_in_date).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.dateSeparator}></View>
          
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{new Date(booking.check_out_date).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Room Type:</Text>
            <Text style={styles.detailValue}>{booking.room_type}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guests:</Text>
            <Text style={styles.detailValue}>{booking.guests} Adults</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rate:</Text>
            <Text style={styles.detailValue}>${booking.rate_per_night} per night</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setStep(2)}
      >
        <Text style={styles.buttonText}>Begin Check-in</Text>
      </TouchableOpacity>
    </View>
  );

  const renderArrivalInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Arrival Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Estimated Arrival Time</Text>
        <TextInput
          style={styles.input}
          value={formData.estimatedArrival}
          onChangeText={(value) => handleInputChange('estimatedArrival', value)}
          placeholder="e.g., 2:00 PM"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Special Requests</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.specialRequests}
          onChangeText={(value) => handleInputChange('specialRequests', value)}
          placeholder="Any special requests for your stay?"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setStep(1)}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setStep(3)}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTermsAndConditions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Terms & Conditions</Text>
      
      <View style={styles.termsContainer}>
        <ScrollView style={styles.termsScroll}>
          <Text style={styles.termsText}>
            Welcome to SOVA Luxury Hotel. Please read and accept our terms and conditions before completing your digital check-in.
            {'\n\n'}
            1. CHECK-IN AND CHECK-OUT
            {'\n'}
            Check-in time is from 3:00 PM, and check-out time is until 12:00 PM. Early check-in and late check-out may be available upon request and may incur additional charges.
            {'\n\n'}
            2. IDENTIFICATION
            {'\n'}
            All guests are required to present valid government-issued identification upon check-in.
            {'\n\n'}
            3. PAYMENT
            {'\n'}
            Full payment for your stay will be processed at check-in. We accept major credit cards and cash.
            {'\n\n'}
            4. CANCELLATION POLICY
            {'\n'}
            Cancellations must be made at least 48 hours prior to arrival to avoid a cancellation fee equivalent to one night's stay.
            {'\n\n'}
            5. DAMAGE POLICY
            {'\n'}
            Guests will be held responsible for any damage to hotel property during their stay.
            {'\n\n'}
            6. PRIVACY POLICY
            {'\n'}
            We respect your privacy and will handle your personal information in accordance with our privacy policy.
          </Text>
        </ScrollView>
      </View>
      
      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={[styles.checkbox, formData.termsAccepted && styles.checkboxChecked]}
          onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
        >
          {formData.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I accept the terms and conditions</Text>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setStep(2)}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleCheckIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Complete Check-in</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.section}>
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        
        <Text style={styles.successTitle}>Check-in Successful!</Text>
        <Text style={styles.successMessage}>
          Welcome to SOVA Luxury Hotel. Your room will be ready at 3:00 PM.
          You can now use the digital key feature to access your room when it's ready.
        </Text>
        
        <View style={styles.successDetails}>
          <View style={styles.successDetailRow}>
            <Text style={styles.successDetailLabel}>Room Number:</Text>
            <Text style={styles.successDetailValue}>{booking.room_number || '203'}</Text>
          </View>
          
          <View style={styles.successDetailRow}>
            <Text style={styles.successDetailLabel}>Floor:</Text>
            <Text style={styles.successDetailValue}>{booking.floor || '2'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => window.location.href = '/digital-key'}
        >
          <Text style={styles.buttonText}>Access Digital Key</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNoBooking = () => (
    <View style={styles.section}>
      <View style={styles.noBookingContainer}>
        <Text style={styles.noBookingTitle}>No Upcoming Bookings</Text>
        <Text style={styles.noBookingMessage}>
          You don't have any upcoming bookings that are eligible for check-in at this time.
        </Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => window.location.href = '/consumer'}
        >
          <Text style={styles.buttonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading your check-in information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Check-in</Text>
        {booking && (
          <View style={styles.stepIndicator}>
            <View style={[styles.step, step >= 1 && styles.activeStep]}>
              <Text style={[styles.stepText, step >= 1 && styles.activeStepText]}>1</Text>
            </View>
            <View style={styles.stepConnector}></View>
            <View style={[styles.step, step >= 2 && styles.activeStep]}>
              <Text style={[styles.stepText, step >= 2 && styles.activeStepText]}>2</Text>
            </View>
            <View style={styles.stepConnector}></View>
            <View style={[styles.step, step >= 3 && styles.activeStep]}>
              <Text style={[styles.stepText, step >= 3 && styles.activeStepText]}>3</Text>
            </View>
            <View style={styles.stepConnector}></View>
            <View style={[styles.step, step >= 4 && styles.activeStep]}>
              <Text style={[styles.stepText, step >= 4 && styles.activeStepText]}>4</Text>
            </View>
          </View>
        )}
      </View>
      
      <ScrollView style={styles.content}>
        {error && !booking ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={fetchUserData}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : booking ? (
          <>
            {step === 1 && renderBookingDetails()}
            {step === 2 && renderArrivalInfo()}
            {step === 3 && renderTermsAndConditions()}
            {step === 4 && renderSuccess()}
          </>
        ) : (
          renderNoBooking()
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
    marginBottom: 15,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#D4AF37',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  stepConnector: {
    height: 2,
    width: 40,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 5,
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
  bookingCard: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
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
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  bookingStatus: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '500',
  },
  bookingDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  dateSeparator: {
    width: 30,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  bookingDetails: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#1A2A3A',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
    marginBottom: 8,
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
  termsContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    marginBottom: 20,
  },
  termsScroll: {
    maxHeight: 200,
    padding: 15,
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1A2A3A',
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
    minWidth: 150,
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
    minWidth: 100,
  },
  secondaryButtonText: {
    color: '#1A2A3A',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 15,
  },
  errorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
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
  successDetails: {
    width: '100%',
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  successDetailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  successDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  noBookingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noBookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  noBookingMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
});

export default DigitalCheckIn;
