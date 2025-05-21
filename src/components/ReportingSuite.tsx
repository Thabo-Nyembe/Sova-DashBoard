import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { fetchBookings, fetchRoomServiceRequests, fetchOrders } from '../api/supabaseApi';

interface ReportingSuiteProps {
  session: Session;
}

const ReportingSuite = ({ session }: ReportingSuiteProps) => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [roomServiceRequests, setRoomServiceRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgStayLength: 0,
    pendingRequests: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // Load data from Supabase when component mounts
    const loadReportingData = async () => {
      setLoading(true);
      try {
        // Get user ID from session
        const userId = session?.user?.id;
        if (!userId) {
          console.error('No user ID found in session');
          setLoading(false);
          return;
        }

        // Fetch all data needed for reports
        const bookingsData = await fetchBookings();
        const roomServiceData = await fetchRoomServiceRequests(userId);
        const ordersData = await fetchOrders(userId);

        setBookings(bookingsData);
        setRoomServiceRequests(roomServiceData);
        setOrders(ordersData);

        // Calculate statistics
        const totalBookings = bookingsData.length;
        
        // Calculate total revenue from orders
        const totalRevenue = ordersData.reduce((sum, order) => 
          sum + (parseFloat(order.total_amount) || 0), 0);
        
        // Calculate average stay length
        const stayLengths = bookingsData.map(booking => {
          const checkIn = new Date(booking.check_in_date);
          const checkOut = new Date(booking.check_out_date);
          return (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24); // days
        });
        const avgStayLength = stayLengths.length > 0 
          ? stayLengths.reduce((sum, length) => sum + length, 0) / stayLengths.length 
          : 0;
        
        // Count pending requests
        const pendingRequests = roomServiceData.filter(req => req.status === 'pending').length;
        
        // Count completed orders
        const completedOrders = ordersData.filter(order => order.status === 'completed').length;

        setStats({
          totalBookings,
          totalRevenue,
          avgStayLength,
          pendingRequests,
          completedOrders
        });
      } catch (error) {
        console.error('Error loading reporting data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportingData();
  }, [session]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A237E" />
        <Text style={styles.loadingText}>Loading reporting data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Reporting Suite</Text>
      
      {/* Summary Statistics */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Summary Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgStayLength.toFixed(1)} days</Text>
            <Text style={styles.statLabel}>Avg. Stay Length</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed Orders</Text>
          </View>
        </View>
      </View>
      
      {/* Bookings Report */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Bookings Report</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Guest</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Check-in</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Check-out</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
          </View>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{booking.guest_name || 'Guest'}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatDate(booking.check_in_date)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatDate(booking.check_out_date)}</Text>
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
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No bookings found</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Room Service Report */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Room Service Requests</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
          </View>
          {roomServiceRequests.length > 0 ? (
            roomServiceRequests.map((request) => (
              <View key={request.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{request.item}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{request.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{formatDate(request.created_at)}</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: request.status === 'delivered' ? '#4CAF50' : 
                                 request.status === 'pending' ? '#FFC107' : '#2196F3' 
                }]}>
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No room service requests found</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Orders Report */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Orders & Purchases</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
          </View>
          {orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{order.item}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{order.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(parseFloat(order.total_amount) || 0)}</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: order.status === 'completed' ? '#4CAF50' : 
                                 order.status === 'pending' ? '#FFC107' : '#2196F3' 
                }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No orders found</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
  },
  summaryContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  reportSection: {
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
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default ReportingSuite;
