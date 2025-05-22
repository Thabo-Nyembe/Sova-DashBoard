import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getUserProfile, getBookings } from '../api/supabaseApi';

const DigitalKey = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [keyActive, setKeyActive] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    let timer;
    if (keyActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && keyActive) {
      setKeyActive(false);
    }
    
    return () => clearTimeout(timer);
  }, [countdown, keyActive]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get user profile
      const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // Get active booking
      const { data: bookingsData, error: bookingsError } = await getBookings(session.user.id);
      
      if (bookingsError) throw bookingsError;
      
      // Find the active booking (checked in but not checked out)
      const activeBooking = bookingsData?.find(b => b.status === 'checked_in');
      
      setBooking(activeBooking);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load your booking information. Please try again later.');
      setLoading(false);
    }
  };

  const generateAccessCode = () => {
    // In a real implementation, this would call an API to generate a secure access code
    // For demo purposes, we'll generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAccessCode(code);
    return code;
  };

  const activateKey = async () => {
    try {
      setLoading(true);
      
      // Generate access code
      const code = generateAccessCode();
      
      // In a real implementation, this would call an API to register the access code with the door lock system
      // For demo purposes, we'll simulate this with a timeout
      
      // Update booking with access code (in a real system, this might be encrypted or handled differently)
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          access_code: code,
          last_key_activation: new Date().toISOString()
        })
        .eq('id', booking.id);
      
      if (updateError) throw updateError;
      
      // Activate key for 5 minutes (300 seconds)
      setKeyActive(true);
      setCountdown(300);
      setLoading(false);
    } catch (error) {
      console.error('Error activating digital key:', error);
      setError('Failed to activate digital key. Please try again or contact reception.');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderActiveKey = () => (
    <View style={styles.keyContainer}>
      <View style={styles.keyHeader}>
        <Text style={styles.keyTitle}>Your Digital Key is Active</Text>
        <Text style={styles.keySubtitle}>Use this code to access your room</Text>
      </View>
      
      <View style={styles.accessCodeContainer}>
        <Text style={styles.accessCode}>{accessCode}</Text>
      </View>
      
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownLabel}>Expires in:</Text>
        <Text style={styles.countdown}>{formatTime(countdown)}</Text>
      </View>
      
      <View style={styles.roomInfoContainer}>
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Room Number:</Text>
          <Text style={styles.roomInfoValue}>{booking.room_number || '203'}</Text>
        </View>
        
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Floor:</Text>
          <Text style={styles.roomInfoValue}>{booking.floor || '2'}</Text>
        </View>
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to use:</Text>
        <Text style={styles.instructionsText}>
          1. Approach your room door{'\n'}
          2. Enter the access code on the keypad{'\n'}
          3. Wait for the green light and enter your room
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => window.location.href = '/consumer'}
      >
        <Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInactiveKey = () => (
    <View style={styles.keyContainer}>
      <View style={styles.keyHeader}>
        <Text style={styles.keyTitle}>Digital Room Key</Text>
        <Text style={styles.keySubtitle}>Activate your digital key to access your room</Text>
      </View>
      
      <View style={styles.keyImageContainer}>
        <View style={styles.keyImage}></View>
      </View>
      
      <View style={styles.roomInfoContainer}>
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Room Number:</Text>
          <Text style={styles.roomInfoValue}>{booking.room_number || '203'}</Text>
        </View>
        
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Floor:</Text>
          <Text style={styles.roomInfoValue}>{booking.floor || '2'}</Text>
        </View>
        
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Check-in Date:</Text>
          <Text style={styles.roomInfoValue}>{new Date(booking.check_in_date).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.roomInfoRow}>
          <Text style={styles.roomInfoLabel}>Check-out Date:</Text>
          <Text style={styles.roomInfoValue}>{new Date(booking.check_out_date).toLocaleDateString()}</Text>
        </View>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={activateKey}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Activate Digital Key</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => window.location.href = '/consumer'}
      >
        <Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNoBooking = () => (
    <View style={styles.noBookingContainer}>
      <Text style={styles.noBookingTitle}>No Active Booking</Text>
      <Text style={styles.noBookingMessage}>
        You don't have an active booking that allows digital key access.
        Please complete check-in at the front desk or through the digital check-in feature.
      </Text>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => window.location.href = '/check-in'}
      >
        <Text style={styles.buttonText}>Go to Digital Check-in</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => window.location.href = '/consumer'}
      >
        <Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading your digital key...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Room Key</Text>
      </View>
      
      <View style={styles.content}>
        {booking ? (
          keyActive ? renderActiveKey() : renderInactiveKey()
        ) : (
          renderNoBooking()
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  keyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  keySubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  keyImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  keyImage: {
    width: 150,
    height: 150,
    backgroundColor: '#F8F7F4',
    borderRadius: 75,
  },
  accessCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  accessCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A2A3A',
    letterSpacing: 8,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#666666',
    marginRight: 10,
  },
  countdown: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  roomInfoContainer: {
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  roomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roomInfoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  roomInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  instructionsContainer: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  noBookingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noBookingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  noBookingMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
});

export default DigitalKey;
