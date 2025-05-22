import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getUserProfile, getBookings, getAmenities } from '../api/supabaseApi';
import { LineChart, BarChart, PieChart } from 'react-chartjs-2';
import 'chart.js/auto';

const InvestorDashboard = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState({
    occupancyRate: 0,
    averageDailyRate: 0,
    revPAR: 0,
    totalRevenue: 0,
    bookings: 0,
    averageStayLength: 0
  });
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [error, setError] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [segmentationData, setSegmentationData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('all');

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, timeframe, selectedProperty]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get user profile
      const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
      
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // In a real implementation, we would fetch actual investor metrics from Supabase
      // For this demo, we'll generate sample data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample metrics based on timeframe
      const sampleMetrics = generateSampleMetrics(timeframe, selectedProperty);
      setMetrics(sampleMetrics);
      
      // Generate sample chart data
      setOccupancyData(generateOccupancyData(timeframe));
      setRevenueData(generateRevenueData(timeframe));
      setSegmentationData(generateSegmentationData());
      setForecastData(generateForecastData(timeframe));
      
      // Sample properties
      setProperties([
        { id: 'property1', name: 'SOVA Grand Hotel - New York' },
        { id: 'property2', name: 'SOVA Luxury Resort - Miami' },
        { id: 'property3', name: 'SOVA Business Hotel - Chicago' },
        { id: 'property4', name: 'SOVA Boutique Hotel - San Francisco' }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching investor data:', error);
      setError('Failed to load investor dashboard. Please try again later.');
      setLoading(false);
    }
  };

  const generateSampleMetrics = (timeframe, property) => {
    // Base values
    let occupancyRate = 75 + Math.random() * 15;
    let averageDailyRate = 250 + Math.random() * 100;
    let bookings = 500 + Math.random() * 300;
    let averageStayLength = 2.5 + Math.random();
    
    // Adjust based on timeframe
    if (timeframe === 'week') {
      bookings = bookings / 4;
    } else if (timeframe === 'quarter') {
      bookings = bookings * 3;
    } else if (timeframe === 'year') {
      bookings = bookings * 12;
    }
    
    // Adjust based on property
    if (property !== 'all') {
      // Simulate different properties having different performance
      const propertyIndex = parseInt(property.replace('property', ''));
      occupancyRate = occupancyRate * (0.9 + (propertyIndex * 0.05));
      averageDailyRate = averageDailyRate * (0.9 + (propertyIndex * 0.1));
      bookings = bookings * (0.8 + (propertyIndex * 0.1));
    }
    
    // Calculate derived metrics
    const revPAR = (occupancyRate / 100) * averageDailyRate;
    const totalRevenue = revPAR * bookings * averageStayLength;
    
    return {
      occupancyRate: occupancyRate.toFixed(1),
      averageDailyRate: averageDailyRate.toFixed(2),
      revPAR: revPAR.toFixed(2),
      totalRevenue: totalRevenue.toFixed(0),
      bookings: bookings.toFixed(0),
      averageStayLength: averageStayLength.toFixed(1)
    };
  };

  const generateOccupancyData = (timeframe) => {
    let labels = [];
    let periods = 0;
    
    if (timeframe === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      periods = 7;
    } else if (timeframe === 'month') {
      labels = Array.from({length: 30}, (_, i) => (i + 1).toString());
      periods = 30;
    } else if (timeframe === 'quarter') {
      labels = ['Jan', 'Feb', 'Mar'];
      periods = 3;
    } else if (timeframe === 'year') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      periods = 12;
    }
    
    // Generate random occupancy data with a realistic pattern
    const baseOccupancy = 70;
    const occupancyData = Array.from({length: periods}, () => 
      baseOccupancy + Math.random() * 25
    );
    
    // Add weekend peaks for weekly view
    if (timeframe === 'week') {
      occupancyData[5] += 15; // Saturday
      occupancyData[6] += 10; // Sunday
    }
    
    // Add seasonal patterns for yearly view
    if (timeframe === 'year') {
      // Summer peak
      occupancyData[5] += 15; // June
      occupancyData[6] += 20; // July
      occupancyData[7] += 15; // August
      
      // Winter holiday peak
      occupancyData[11] += 10; // December
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Occupancy Rate (%)',
          data: occupancyData,
          borderColor: '#1A2A3A',
          backgroundColor: 'rgba(26, 42, 58, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const generateRevenueData = (timeframe) => {
    let labels = [];
    let periods = 0;
    
    if (timeframe === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      periods = 7;
    } else if (timeframe === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      periods = 4;
    } else if (timeframe === 'quarter') {
      labels = ['Month 1', 'Month 2', 'Month 3'];
      periods = 3;
    } else if (timeframe === 'year') {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      periods = 4;
    }
    
    // Generate random revenue data
    const baseRevenue = 50000;
    const roomRevenue = Array.from({length: periods}, () => 
      baseRevenue + Math.random() * 30000
    );
    
    const foodRevenue = Array.from({length: periods}, () => 
      baseRevenue * 0.4 + Math.random() * 10000
    );
    
    const otherRevenue = Array.from({length: periods}, () => 
      baseRevenue * 0.2 + Math.random() * 5000
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Room Revenue',
          data: roomRevenue,
          backgroundColor: '#1A2A3A',
        },
        {
          label: 'F&B Revenue',
          data: foodRevenue,
          backgroundColor: '#D4AF37',
        },
        {
          label: 'Other Revenue',
          data: otherRevenue,
          backgroundColor: '#6B8E23',
        }
      ]
    };
  };

  const generateSegmentationData = () => {
    return {
      labels: ['Business', 'Leisure', 'Group', 'Extended Stay'],
      datasets: [
        {
          data: [40, 35, 15, 10],
          backgroundColor: ['#1A2A3A', '#D4AF37', '#6B8E23', '#B87333'],
          borderWidth: 0,
        }
      ]
    };
  };

  const generateForecastData = (timeframe) => {
    let labels = [];
    let periods = 0;
    
    if (timeframe === 'week') {
      // Next 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (today + i) % 7;
        labels.push(days[dayIndex]);
      }
      
      periods = 7;
    } else if (timeframe === 'month') {
      // Next 4 weeks
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      periods = 4;
    } else if (timeframe === 'quarter') {
      // Next 3 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      for (let i = 0; i < 3; i++) {
        const monthIndex = (currentMonth + i) % 12;
        labels.push(months[monthIndex]);
      }
      
      periods = 3;
    } else if (timeframe === 'year') {
      // Next 4 quarters
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      periods = 4;
    }
    
    // Generate forecast data with a slight upward trend
    const baseOccupancy = 75;
    const forecastData = Array.from({length: periods}, (_, i) => 
      baseOccupancy + (i * 2) + (Math.random() * 10 - 5)
    );
    
    // Add historical data (slightly lower than forecast)
    const historicalData = Array.from({length: periods}, (_, i) => 
      baseOccupancy - 5 + (i * 1.5) + (Math.random() * 10 - 5)
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Historical',
          data: historicalData,
          borderColor: '#6B8E23',
          backgroundColor: 'rgba(107, 142, 35, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Forecast',
          data: forecastData,
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          fill: true,
          tension: 0.4,
          borderDash: [5, 5]
        }
      ]
    };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderMetricsCards = () => (
    <View style={styles.metricsContainer}>
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Occupancy Rate</Text>
        <Text style={styles.metricValue}>{metrics.occupancyRate}%</Text>
        <Text style={styles.metricTrend}>+2.3% vs last period</Text>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Average Daily Rate</Text>
        <Text style={styles.metricValue}>${metrics.averageDailyRate}</Text>
        <Text style={styles.metricTrend}>+5.1% vs last period</Text>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>RevPAR</Text>
        <Text style={styles.metricValue}>${metrics.revPAR}</Text>
        <Text style={styles.metricTrend}>+7.4% vs last period</Text>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Total Revenue</Text>
        <Text style={styles.metricValue}>{formatCurrency(metrics.totalRevenue)}</Text>
        <Text style={styles.metricTrend}>+3.8% vs last period</Text>
      </View>
    </View>
  );

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeContainer}>
      <TouchableOpacity
        style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframe]}
        onPress={() => setTimeframe('week')}
      >
        <Text style={[styles.timeframeText, timeframe === 'week' && styles.activeTimeframeText]}>Week</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframe]}
        onPress={() => setTimeframe('month')}
      >
        <Text style={[styles.timeframeText, timeframe === 'month' && styles.activeTimeframeText]}>Month</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.timeframeButton, timeframe === 'quarter' && styles.activeTimeframe]}
        onPress={() => setTimeframe('quarter')}
      >
        <Text style={[styles.timeframeText, timeframe === 'quarter' && styles.activeTimeframeText]}>Quarter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.timeframeButton, timeframe === 'year' && styles.activeTimeframe]}
        onPress={() => setTimeframe('year')}
      >
        <Text style={[styles.timeframeText, timeframe === 'year' && styles.activeTimeframeText]}>Year</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPropertySelector = () => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyLabel}>Property:</Text>
      
      <View style={styles.propertySelector}>
        <TouchableOpacity
          style={[styles.propertyOption, selectedProperty === 'all' && styles.activeProperty]}
          onPress={() => setSelectedProperty('all')}
        >
          <Text style={[styles.propertyText, selectedProperty === 'all' && styles.activePropertyText]}>All Properties</Text>
        </TouchableOpacity>
        
        {properties.map(property => (
          <TouchableOpacity
            key={property.id}
            style={[styles.propertyOption, selectedProperty === property.id && styles.activeProperty]}
            onPress={() => setSelectedProperty(property.id)}
          >
            <Text style={[styles.propertyText, selectedProperty === property.id && styles.activePropertyText]}>
              {property.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCharts = () => (
    <View style={styles.chartsContainer}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Occupancy Trend</Text>
        {occupancyData && (
          <View style={styles.chart}>
            <LineChart data={occupancyData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  min: 50,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }} />
          </View>
        )}
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Breakdown</Text>
        {revenueData && (
          <View style={styles.chart}>
            <BarChart data={revenueData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }} />
          </View>
        )}
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Guest Segmentation</Text>
          {segmentationData && (
            <View style={styles.chart}>
              <PieChart data={segmentationData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} />
            </View>
          )}
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Occupancy Forecast</Text>
          {forecastData && (
            <View style={styles.chart}>
              <LineChart data={forecastData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                scales: {
                  y: {
                    min: 50,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }} />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderAdditionalMetrics = () => (
    <View style={styles.additionalMetricsContainer}>
      <View style={styles.additionalMetricsCard}>
        <Text style={styles.additionalMetricsTitle}>Performance Indicators</Text>
        
        <View style={styles.additionalMetricsRow}>
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Total Bookings</Text>
            <Text style={styles.additionalMetricValue}>{metrics.bookings}</Text>
          </View>
          
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Avg. Stay Length</Text>
            <Text style={styles.additionalMetricValue}>{metrics.averageStayLength} nights</Text>
          </View>
          
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Direct Bookings</Text>
            <Text style={styles.additionalMetricValue}>68%</Text>
          </View>
        </View>
        
        <View style={styles.additionalMetricsRow}>
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Guest Satisfaction</Text>
            <Text style={styles.additionalMetricValue}>4.8/5.0</Text>
          </View>
          
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Cost per Booking</Text>
            <Text style={styles.additionalMetricValue}>$24.50</Text>
          </View>
          
          <View style={styles.additionalMetric}>
            <Text style={styles.additionalMetricLabel}>Market Share</Text>
            <Text style={styles.additionalMetricValue}>23.5%</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading investor dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Investor Dashboard</Text>
          <Text style={styles.headerSubtitle}>Performance overview for SOVA Luxury Hotels</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>Download Report</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {renderPropertySelector()}
        {renderTimeframeSelector()}
        {renderMetricsCards()}
        {renderCharts()}
        {renderAdditionalMetrics()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data last updated: {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerDisclaimer}>
            This dashboard contains confidential information for SOVA investors only.
          </Text>
        </View>
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
    backgroundColor: '#1A2A3A',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D4AF37',
  },
  headerActions: {
    flexDirection: 'row',
  },
  reportButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  reportButtonText: {
    color: '#1A2A3A',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  propertyContainer: {
    marginBottom: 20,
  },
  propertyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 10,
  },
  propertySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyOption: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  activeProperty: {
    backgroundColor: '#1A2A3A',
    borderColor: '#1A2A3A',
  },
  propertyText: {
    fontSize: 14,
    color: '#1A2A3A',
  },
  activePropertyText: {
    color: '#FFFFFF',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  activeTimeframe: {
    backgroundColor: '#1A2A3A',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  activeTimeframeText: {
    color: '#FFFFFF',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    marginRight: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    marginRight: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    marginRight: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  metricTrend: {
    fontSize: 12,
    color: '#4CAF50',
  },
  chartsContainer: {
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  chart: {
    height: 300,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfChart: {
    width: '48%',
  },
  additionalMetricsContainer: {
    marginBottom: 20,
  },
  additionalMetricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalMetricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  additionalMetricsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  additionalMetric: {
    flex: 1,
    alignItems: 'center',
  },
  additionalMetricLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    textAlign: 'center',
  },
  additionalMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  footerDisclaimer: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default InvestorDashboard;
