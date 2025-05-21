import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { 
  fetchUserProfile, 
  fetchUpcomingStay, 
  fetchOffers,
  fetchRoomServiceRequests,
  createRoomServiceRequest
} from '../api/supabaseApi';

interface ConsumerDashboardProps {
  session: Session;
}

const ConsumerDashboard = ({ session }: ConsumerDashboardProps) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [upcomingStay, setUpcomingStay] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    // Load user data from Supabase when component mounts
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Get user profile data
        const userId = session?.user?.id;
        if (!userId) {
          console.error('No user ID found in session');
          setLoading(false);
          return;
        }

        const profile = await fetchUserProfile(userId);
        const stay = await fetchUpcomingStay(userId);
        const availableOffers = await fetchOffers();

        setUserData({
          name: profile?.name || 'Guest',
          loyaltyTier: 'Gold', // This would come from a loyalty_tiers table in a real app
          points: 2450, // This would come from a user_points table in a real app
        });
        
        setUpcomingStay(stay);
        setOffers(availableOffers);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle room service request
  const handleRoomServiceRequest = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;
      
      // This would typically open a modal for item selection
      // For demo purposes, we'll create a breakfast request
      await createRoomServiceRequest(userId, 'Breakfast', 1);
      alert('Room service request submitted successfully!');
    } catch (error) {
      console.error('Error creating room service request:', error);
      alert('Failed to submit room service request. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.nameText}>{userData?.name}</Text>
        <View style={styles.loyaltyContainer}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{userData?.loyaltyTier}</Text>
          </View>
          <Text style={styles.pointsText}>{userData?.points} Points</Text>
        </View>
      </View>

      {/* Upcoming Stay Module */}
      {upcomingStay && (
        <View style={styles.stayCard}>
          <Text style={styles.sectionTitle}>Upcoming Stay</Text>
          <Text style={styles.hotelName}>{upcomingStay.hotelName}</Text>
          <Text style={styles.locationText}>{upcomingStay.location}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>{formatDate(upcomingStay.checkIn)}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>{formatDate(upcomingStay.checkOut)}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: upcomingStay.status === 'confirmed' ? '#4CAF50' : '#E0E0E0' }]} />
              <View style={styles.statusLine} />
              <View style={[styles.statusDot, { backgroundColor: upcomingStay.status === 'preparing' ? '#FFC107' : '#E0E0E0' }]} />
              <View style={styles.statusLine} />
              <View style={[styles.statusDot, { backgroundColor: upcomingStay.status === 'ready' ? '#4CAF50' : '#E0E0E0' }]} />
            </View>
            <View style={styles.statusLabels}>
              <Text style={styles.statusLabel}>Confirmed</Text>
              <Text style={styles.statusLabel}>Preparing</Text>
              <Text style={styles.statusLabel}>Ready</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.actionTile}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>🔑</Text>
          </View>
          <Text style={styles.actionText}>Digital Key</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionTile}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>📋</Text>
          </View>
          <Text style={styles.actionText}>Check-in/out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionTile}
          onPress={handleRoomServiceRequest}
        >
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>🍽️</Text>
          </View>
          <Text style={styles.actionText}>Room Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionTile}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>💆</Text>
          </View>
          <Text style={styles.actionText}>Spa Booking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionTile}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>👨‍💼</Text>
          </View>
          <Text style={styles.actionText}>Concierge</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionTile}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>🌍</Text>
          </View>
          <Text style={styles.actionText}>Local Experiences</Text>
        </TouchableOpacity>
      </View>

      {/* Offers & Rewards */}
      <Text style={styles.sectionTitle}>Offers & Rewards</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.offersContainer}
      >
        {offers.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.offerCard}>
            <Image 
              source={{ uri: offer.image }} 
              style={styles.offerImage}
              resizeMode="cover"
            />
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
              <Text style={styles.offerValidity}>Valid until {formatDate(offer.validUntil)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Feedback Module */}
      <View style={styles.feedbackCard}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.feedbackText}>
          We value your opinion. Please share your experience with us after your stay.
        </Text>
        <TouchableOpacity style={styles.feedbackButton}>
          <Text style={styles.feedbackButtonText}>View Past Surveys</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const actionTileSize = (width - 60) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Soft ivory background
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  loyaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tierBadge: {
    backgroundColor: '#D4AF37', // Gold color
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 10,
  },
  tierText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pointsText: {
    color: '#666666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 12,
  },
  stayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666666',
    width: '33%',
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionTile: {
    width: actionTileSize,
    height: actionTileSize,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  offersContainer: {
    marginBottom: 16,
  },
  offerCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 140,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  offerValidity: {
    fontSize: 12,
    color: '#999999',
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  feedbackButton: {
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ConsumerDashboard;
