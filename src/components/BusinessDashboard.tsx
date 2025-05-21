import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { 
  fetchBookings,
  fetchRoomServiceRequests,
  fetchHousekeepingStatus,
  fetchGuestSatisfaction
} from '../api/supabaseApi';

interface BusinessDashboardProps {
  session: Session;
}

const BusinessDashboard = ({ session }: BusinessDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    occupancy: 0,
    adr: 0,
    revPAR: 0,
    dailyRevenue: 0,
    checkIns: 0,
    checkOuts: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [housekeeping, setHousekeeping] = useState({
    clean: 0,
    dirty: 0,
    maintenance: 0,
    outOfOrder: 0,
  });
  const [satisfaction, setSatisfaction] = useState({
    overall: 0,
    cleanliness: 0,
    service: 0,
    amenities: 0,
    value: 0,
    recentFeedback: [],
  });

  useEffect(() => {
    // Load data from Supabase when component mounts
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Get user ID from session
        const userId = session?.user?.id;
        if (!userId) {
          console.error('No user ID found in session');
          setLoading(false);
          return;
        }

        // Fetch bookings
        const bookingsData = await fetchBookings();
        setBookings(bookingsData);

        // Calculate KPIs based on bookings
        const today = new Date().toISOString().split('T')[0];
        const checkInsToday = bookingsData.filter(b => b.check_in_date === today).length;
        const checkOutsToday = bookingsData.filter(b => b.check_out_date === today).length;
        
        // For a real app, these would come from actual calculations
        // For now, we'll use some derived values
        const totalRooms = 68; // Example total rooms
        const occupiedRooms = bookingsData.filter(b => 
          new Date(b.check_in_date) <= new Date() && 
          new Date(b.check_out_date) > new Date()
        ).length;
        
        const occupancyRate = (occupiedRooms / totalRooms) * 100;
        const averageDailyRate = 325; // Example ADR
        const revenuePerAvailableRoom = (occupancyRate / 100) * averageDailyRate;
        const dailyRevenue = occupiedRooms * averageDailyRate;

        setKpis({
          occupancy: parseFloat(occupancyRate.toFixed(1)),
          adr: averageDailyRate,
          revPAR: parseFloat(revenuePerAvailableRoom.toFixed(2)),
          dailyRevenue: dailyRevenue,
          checkIns: checkInsToday,
          checkOuts: checkOutsToday,
        });

        // Fetch housekeeping status
        const housekeepingData = await fetchHousekeepingStatus();
        setHousekeeping(housekeepingData);

        // Fetch guest satisfaction
        const satisfactionData = await fetchGuestSatisfaction();
        setSatisfaction(satisfactionData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A237E" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      );
    }

    return (
      <>
        {/* KPI Cards */}
        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis.occupancy}%</Text>
            <Text style={styles.kpiLabel}>Occupancy</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>${kpis.adr}</Text>
            <Text style={styles.kpiLabel}>ADR</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>${kpis.revPAR}</Text>
            <Text style={styles.kpiLabel}>RevPAR</Text>
          </View>
        </View>
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>${kpis.dailyRevenue.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Daily Revenue</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis.checkIns}</Text>
            <Text style={styles.kpiLabel}>Check-ins</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{kpis.checkOuts}</Text>
            <Text style={styles.kpiLabel}>Check-outs</Text>
          </View>
        </View>

        {/* Booking Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booking Overview</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Guest</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Room</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Check-in</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
          </View>
          {bookings.slice(0, 3).map((booking) => (
            <View key={booking.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{booking.guest_name || 'Guest'}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{booking.room_type || 'Standard'}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatDate(booking.check_in_date)}</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: booking.status === 'checked_in' ? '#4CAF50' : 
                               booking.status === 'confirmed' ? '#2196F3' : '#9E9E9E' 
              }]}>
                <Text style={styles.statusText}>{
                  booking.status === 'checked_in' ? 'Checked In' :
                  booking.status === 'confirmed' ? 'Confirmed' :
                  booking.status === 'checked_out' ? 'Checked Out' : 
                  booking.status
                }</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Housekeeping Panel */}
        <Text style={styles.sectionTitle}>Housekeeping Status</Text>
        <View style={styles.housekeepingContainer}>
          <View style={styles.housekeepingCard}>
            <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.housekeepingValue}>{housekeeping.clean}</Text>
            <Text style={styles.housekeepingLabel}>Clean</Text>
          </View>
          <View style={styles.housekeepingCard}>
            <View style={[styles.statusIndicator, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.housekeepingValue}>{housekeeping.dirty}</Text>
            <Text style={styles.housekeepingLabel}>Dirty</Text>
          </View>
          <View style={styles.housekeepingCard}>
            <View style={[styles.statusIndicator, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.housekeepingValue}>{housekeeping.maintenance}</Text>
            <Text style={styles.housekeepingLabel}>Maintenance</Text>
          </View>
          <View style={styles.housekeepingCard}>
            <View style={[styles.statusIndicator, { backgroundColor: '#F44336' }]} />
            <Text style={styles.housekeepingValue}>{housekeeping.outOfOrder}</Text>
            <Text style={styles.housekeepingLabel}>Out of Order</Text>
          </View>
        </View>

        {/* Guest Satisfaction */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guest Satisfaction</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View Reports</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.satisfactionContainer}>
          <View style={styles.satisfactionOverview}>
            <View style={styles.satisfactionScore}>
              <Text style={styles.scoreValue}>{satisfaction.overall}</Text>
              <Text style={styles.scoreLabel}>Overall Rating</Text>
            </View>
            <View style={styles.satisfactionMetrics}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Cleanliness</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(satisfaction.cleanliness / 5) * 100}%` }]} />
                </View>
                <Text style={styles.metricValue}>{satisfaction.cleanliness}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Service</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(satisfaction.service / 5) * 100}%` }]} />
                </View>
                <Text style={styles.metricValue}>{satisfaction.service}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Amenities</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(satisfaction.amenities / 5) * 100}%` }]} />
                </View>
                <Text style={styles.metricValue}>{satisfaction.amenities}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Value</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(satisfaction.value / 5) * 100}%` }]} />
                </View>
                <Text style={styles.metricValue}>{satisfaction.value}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.feedbackTitle}>Recent Feedback</Text>
          {satisfaction.recentFeedback.map((feedback) => (
            <View key={feedback.id} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.guestName}>{feedback.guest}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingValue}>{feedback.rating}</Text>
                  <Text style={styles.ratingMax}>/5</Text>
                </View>
              </View>
              <Text style={styles.feedbackComment}>{feedback.comment}</Text>
              <Text style={styles.feedbackDate}>{formatDate(feedback.date)}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderReports = () => (
    <View style={styles.reportsContainer}>
      <Text style={styles.sectionTitle}>Reports</Text>
      <Text style={styles.reportDescription}>
        Generate and view detailed reports for your hotel operations.
      </Text>
      
      <Text style={styles.reportCategoryTitle}>Business Performance</Text>
      <View style={styles.reportGrid}>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Manager Summary</Text>
          <Text style={styles.reportCardDescription}>Revenue, ADR, RevPAR, Occupancy %</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Forecasting</Text>
          <Text style={styles.reportCardDescription}>Room nights, pickup trends, cancellation rates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Channel Performance</Text>
          <Text style={styles.reportCardDescription}>Revenue and ADR by OTA, direct, corporate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Source Market</Text>
          <Text style={styles.reportCardDescription}>Bookings by country, segment, and device</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.reportCategoryTitle}>Guest Experience</Text>
      <View style={styles.reportGrid}>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Guest Satisfaction</Text>
          <Text style={styles.reportCardDescription}>NPS, CSAT, trending feedback categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Amenity Usage</Text>
          <Text style={styles.reportCardDescription}>Spa, room service, and in-app purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Loyalty Engagement</Text>
          <Text style={styles.reportCardDescription}>Redemption rates, repeat guests, top segments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Resolution Report</Text>
          <Text style={styles.reportCardDescription}>Time to resolve service requests/issues</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.reportCategoryTitle}>Operational Reports</Text>
      <View style={styles.reportGrid}>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Housekeeping & Turnover</Text>
          <Text style={styles.reportCardDescription}>Clean/dirty/OOO rooms, time per clean</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Maintenance Tracker</Text>
          <Text style={styles.reportCardDescription}>Task completion time, repeat issue trends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Staff Productivity</Text>
          <Text style={styles.reportCardDescription}>Labor cost vs occupancy, rooms cleaned per staff</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportCardTitle}>Inventory/Minibar</Text>
          <Text style={styles.reportCardDescription}>Reorder alerts, low stock, amenity usage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation (simplified for mobile) */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'dashboard' && styles.activeTabButton]} 
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'bookings' && styles.activeTabButton]} 
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'reports' && styles.activeTabButton]} 
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'housekeeping' && styles.activeTabButton]} 
          onPress={() => setActiveTab('housekeeping')}
        >
          <Text style={[styles.tabText, activeTab === 'housekeeping' && styles.activeTabText]}>Housekeeping</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'feedback' && styles.activeTabButton]} 
          onPress={() => setActiveTab('feedback')}
        >
          <Text style={[styles.tabText, activeTab === 'feedback' && styles.activeTabText]}>Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reports' && renderReports()}
        {/* Other tabs would be implemented similarly */}
        {(activeTab !== 'dashboard' && activeTab !== 'reports') && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content would be displayed here.</Text>
          </View>
        )}
        
        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1A237E', // Deep navy
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 12,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#1A237E',
    fontWeight: '500',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  housekeepingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  housekeepingCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  housekeepingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  housekeepingLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  satisfactionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  satisfactionOverview: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  satisfactionScore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
  satisfactionMetrics: {
    flex: 1,
    justifyContent: 'space-between',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    width: 80,
    fontSize: 12,
    color: '#666666',
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#1A237E',
  },
  metricValue: {
    width: 24,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  feedbackCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  ratingMax: {
    fontSize: 12,
    color: '#666666',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    lineHeight: 20,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999999',
  },
  reportsContainer: {
    padding: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  reportCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  reportCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
  },
  reportCardDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 20,
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});

export default BusinessDashboard;
