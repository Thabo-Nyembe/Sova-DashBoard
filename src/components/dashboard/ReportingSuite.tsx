import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getAllBookings, getAllRoomServiceRequests, getAllShuttleBookings } from '../api/supabaseApi';
import { LineChart, BarChart, PieChart } from 'react-chartjs-2';
import 'chart.js/auto';

const ReportingSuite = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('occupancy');
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [error, setError] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [operationalData, setOperationalData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    if (session) {
      fetchReportData();
    }
  }, [session, activeTab, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch actual reporting data from Supabase
      // For this demo, we'll generate sample data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample data based on active tab and date range
      switch (activeTab) {
        case 'occupancy':
          setOccupancyData(generateOccupancyData(dateRange));
          break;
        case 'revenue':
          setRevenueData(generateRevenueData(dateRange));
          break;
        case 'guest':
          setGuestData(generateGuestData(dateRange));
          break;
        case 'operational':
          setOperationalData(generateOperationalData(dateRange));
          break;
        case 'comparison':
          setComparisonData(generateComparisonData(dateRange));
          break;
        case 'forecast':
          setForecastData(generateForecastData(dateRange));
          break;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load reporting data. Please try again later.');
      setLoading(false);
    }
  };

  const generateOccupancyData = (dateRange) => {
    let labels = [];
    let periods = 0;
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      periods = 7;
    } else if (dateRange === 'month') {
      labels = Array.from({length: 30}, (_, i) => (i + 1).toString());
      periods = 30;
    } else if (dateRange === 'quarter') {
      labels = ['Jan', 'Feb', 'Mar'];
      periods = 3;
    } else if (dateRange === 'year') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      periods = 12;
    }
    
    // Generate random occupancy data with a realistic pattern
    const baseOccupancy = 70;
    const occupancyData = Array.from({length: periods}, () => 
      baseOccupancy + Math.random() * 25
    );
    
    // Add weekend peaks for weekly view
    if (dateRange === 'week') {
      occupancyData[5] += 15; // Saturday
      occupancyData[6] += 10; // Sunday
    }
    
    // Add seasonal patterns for yearly view
    if (dateRange === 'year') {
      // Summer peak
      occupancyData[5] += 15; // June
      occupancyData[6] += 20; // July
      occupancyData[7] += 15; // August
      
      // Winter holiday peak
      occupancyData[11] += 10; // December
    }
    
    // Generate room type breakdown
    const standardRooms = Array.from({length: periods}, (_, i) => 
      occupancyData[i] * 0.4 + (Math.random() * 5 - 2.5)
    );
    
    const deluxeRooms = Array.from({length: periods}, (_, i) => 
      occupancyData[i] * 0.3 + (Math.random() * 5 - 2.5)
    );
    
    const suites = Array.from({length: periods}, (_, i) => 
      occupancyData[i] * 0.2 + (Math.random() * 5 - 2.5)
    );
    
    const penthouses = Array.from({length: periods}, (_, i) => 
      occupancyData[i] * 0.1 + (Math.random() * 5 - 2.5)
    );
    
    return {
      overview: {
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
      },
      breakdown: {
        labels,
        datasets: [
          {
            label: 'Standard Rooms',
            data: standardRooms,
            backgroundColor: '#1A2A3A',
          },
          {
            label: 'Deluxe Rooms',
            data: deluxeRooms,
            backgroundColor: '#D4AF37',
          },
          {
            label: 'Suites',
            data: suites,
            backgroundColor: '#6B8E23',
          },
          {
            label: 'Penthouses',
            data: penthouses,
            backgroundColor: '#B87333',
          }
        ]
      },
      metrics: {
        averageOccupancy: (occupancyData.reduce((a, b) => a + b, 0) / periods).toFixed(1) + '%',
        peakOccupancy: Math.max(...occupancyData).toFixed(1) + '%',
        lowestOccupancy: Math.min(...occupancyData).toFixed(1) + '%',
        occupancyTrend: '+3.2% vs previous period'
      }
    };
  };

  const generateRevenueData = (dateRange) => {
    let labels = [];
    let periods = 0;
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      periods = 7;
    } else if (dateRange === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      periods = 4;
    } else if (dateRange === 'quarter') {
      labels = ['Month 1', 'Month 2', 'Month 3'];
      periods = 3;
    } else if (dateRange === 'year') {
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
    
    const spaRevenue = Array.from({length: periods}, () => 
      baseRevenue * 0.2 + Math.random() * 5000
    );
    
    const otherRevenue = Array.from({length: periods}, () => 
      baseRevenue * 0.1 + Math.random() * 3000
    );
    
    // Calculate total revenue
    const totalRevenue = labels.map((_, i) => 
      roomRevenue[i] + foodRevenue[i] + spaRevenue[i] + otherRevenue[i]
    );
    
    // Calculate costs (approximately 60% of revenue)
    const totalCosts = totalRevenue.map(rev => rev * 0.6);
    
    // Calculate profit
    const profit = totalRevenue.map((rev, i) => rev - totalCosts[i]);
    
    return {
      overview: {
        labels,
        datasets: [
          {
            label: 'Total Revenue',
            data: totalRevenue,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Profit',
            data: profit,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      breakdown: {
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
            label: 'Spa Revenue',
            data: spaRevenue,
            backgroundColor: '#6B8E23',
          },
          {
            label: 'Other Revenue',
            data: otherRevenue,
            backgroundColor: '#B87333',
          }
        ]
      },
      metrics: {
        totalRevenue: formatCurrency(totalRevenue.reduce((a, b) => a + b, 0)),
        averageRevenue: formatCurrency(totalRevenue.reduce((a, b) => a + b, 0) / periods),
        totalProfit: formatCurrency(profit.reduce((a, b) => a + b, 0)),
        profitMargin: (profit.reduce((a, b) => a + b, 0) / totalRevenue.reduce((a, b) => a + b, 0) * 100).toFixed(1) + '%',
        revenueTrend: '+5.7% vs previous period'
      }
    };
  };

  const generateGuestData = (dateRange) => {
    // Guest satisfaction data
    const satisfactionLabels = ['Excellent', 'Good', 'Average', 'Poor', 'Terrible'];
    const satisfactionData = [65, 25, 7, 2, 1];
    
    // Guest demographics
    const demographicLabels = ['Business', 'Leisure', 'Family', 'Group', 'Extended Stay'];
    const demographicData = [40, 30, 15, 10, 5];
    
    // Guest source
    const sourceLabels = ['Direct', 'OTAs', 'Corporate', 'Travel Agents', 'Other'];
    const sourceData = [45, 30, 15, 8, 2];
    
    // Guest nationality (top 5)
    const nationalityLabels = ['USA', 'UK', 'China', 'Germany', 'Other'];
    const nationalityData = [35, 20, 15, 10, 20];
    
    return {
      satisfaction: {
        labels: satisfactionLabels,
        datasets: [
          {
            data: satisfactionData,
            backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
            borderWidth: 0,
          }
        ]
      },
      demographics: {
        labels: demographicLabels,
        datasets: [
          {
            data: demographicData,
            backgroundColor: ['#1A2A3A', '#D4AF37', '#6B8E23', '#B87333', '#9370DB'],
            borderWidth: 0,
          }
        ]
      },
      source: {
        labels: sourceLabels,
        datasets: [
          {
            data: sourceData,
            backgroundColor: ['#1A2A3A', '#D4AF37', '#6B8E23', '#B87333', '#9370DB'],
            borderWidth: 0,
          }
        ]
      },
      nationality: {
        labels: nationalityLabels,
        datasets: [
          {
            data: nationalityData,
            backgroundColor: ['#1A2A3A', '#D4AF37', '#6B8E23', '#B87333', '#9370DB'],
            borderWidth: 0,
          }
        ]
      },
      metrics: {
        averageSatisfaction: '4.5/5.0',
        repeatGuests: '32%',
        averageStayLength: '3.2 nights',
        loyaltyProgram: '45% enrolled'
      }
    };
  };

  const generateOperationalData = (dateRange) => {
    let labels = [];
    let periods = 0;
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      periods = 7;
    } else if (dateRange === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      periods = 4;
    } else if (dateRange === 'quarter') {
      labels = ['Month 1', 'Month 2', 'Month 3'];
      periods = 3;
    } else if (dateRange === 'year') {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      periods = 4;
    }
    
    // Staff efficiency (average tasks completed per hour)
    const staffEfficiency = Array.from({length: periods}, () => 
      5 + Math.random() * 3
    );
    
    // Service response time (minutes)
    const serviceResponseTime = Array.from({length: periods}, () => 
      10 + Math.random() * 5
    );
    
    // Maintenance issues
    const maintenanceIssues = Array.from({length: periods}, () => 
      Math.floor(5 + Math.random() * 10)
    );
    
    // Energy consumption (kWh per occupied room)
    const energyConsumption = Array.from({length: periods}, () => 
      25 + Math.random() * 10
    );
    
    return {
      efficiency: {
        labels,
        datasets: [
          {
            label: 'Staff Efficiency (tasks/hour)',
            data: staffEfficiency,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      response: {
        labels,
        datasets: [
          {
            label: 'Service Response Time (min)',
            data: serviceResponseTime,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      maintenance: {
        labels,
        datasets: [
          {
            label: 'Maintenance Issues',
            data: maintenanceIssues,
            backgroundColor: '#1A2A3A',
          }
        ]
      },
      energy: {
        labels,
        datasets: [
          {
            label: 'Energy Consumption (kWh/room)',
            data: energyConsumption,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      metrics: {
        avgResponseTime: (serviceResponseTime.reduce((a, b) => a + b, 0) / periods).toFixed(1) + ' min',
        staffUtilization: '87%',
        maintenanceResolution: '94% within 24h',
        energyEfficiency: '-5.2% vs last year'
      }
    };
  };

  const generateComparisonData = (dateRange) => {
    let labels = [];
    
    if (dateRange === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (dateRange === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (dateRange === 'quarter') {
      labels = ['Month 1', 'Month 2', 'Month 3'];
    } else if (dateRange === 'year') {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    }
    
    // Occupancy comparison
    const currentOccupancy = labels.map(() => 70 + Math.random() * 20);
    const previousOccupancy = labels.map(() => 65 + Math.random() * 20);
    const competitorOccupancy = labels.map(() => 60 + Math.random() * 25);
    
    // ADR comparison
    const currentADR = labels.map(() => 250 + Math.random() * 50);
    const previousADR = labels.map(() => 240 + Math.random() * 50);
    const competitorADR = labels.map(() => 230 + Math.random() * 60);
    
    // RevPAR comparison
    const currentRevPAR = labels.map((_, i) => currentOccupancy[i] / 100 * currentADR[i]);
    const previousRevPAR = labels.map((_, i) => previousOccupancy[i] / 100 * previousADR[i]);
    const competitorRevPAR = labels.map((_, i) => competitorOccupancy[i] / 100 * competitorADR[i]);
    
    // Market share
    const marketShareLabels = ['SOVA', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'];
    const marketShareData = [30, 25, 20, 15, 10];
    
    return {
      occupancy: {
        labels,
        datasets: [
          {
            label: 'Current Period',
            data: currentOccupancy,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Previous Period',
            data: previousOccupancy,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Competitor Average',
            data: competitorOccupancy,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [2, 2]
          }
        ]
      },
      adr: {
        labels,
        datasets: [
          {
            label: 'Current Period',
            data: currentADR,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Previous Period',
            data: previousADR,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Competitor Average',
            data: competitorADR,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [2, 2]
          }
        ]
      },
      revpar: {
        labels,
        datasets: [
          {
            label: 'Current Period',
            data: currentRevPAR,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Previous Period',
            data: previousRevPAR,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Competitor Average',
            data: competitorRevPAR,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [2, 2]
          }
        ]
      },
      marketShare: {
        labels: marketShareLabels,
        datasets: [
          {
            data: marketShareData,
            backgroundColor: ['#1A2A3A', '#D4AF37', '#6B8E23', '#B87333', '#9370DB'],
            borderWidth: 0,
          }
        ]
      },
      metrics: {
        occupancyVsCompetitors: '+12.5%',
        adrVsCompetitors: '+8.7%',
        revparVsCompetitors: '+21.3%',
        marketShareChange: '+2.3% YoY'
      }
    };
  };

  const generateForecastData = (dateRange) => {
    let labels = [];
    let periods = 0;
    
    if (dateRange === 'week') {
      // Next 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (today + i) % 7;
        labels.push(days[dayIndex]);
      }
      
      periods = 7;
    } else if (dateRange === 'month') {
      // Next 4 weeks
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      periods = 4;
    } else if (dateRange === 'quarter') {
      // Next 3 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      for (let i = 0; i < 3; i++) {
        const monthIndex = (currentMonth + i) % 12;
        labels.push(months[monthIndex]);
      }
      
      periods = 3;
    } else if (dateRange === 'year') {
      // Next 4 quarters
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      periods = 4;
    }
    
    // Generate forecast data with a slight upward trend
    const baseOccupancy = 75;
    const forecastOccupancy = Array.from({length: periods}, (_, i) => 
      baseOccupancy + (i * 2) + (Math.random() * 10 - 5)
    );
    
    // Add historical data (slightly lower than forecast)
    const historicalOccupancy = Array.from({length: periods}, (_, i) => 
      baseOccupancy - 5 + (i * 1.5) + (Math.random() * 10 - 5)
    );
    
    // Revenue forecast
    const baseRevenue = 50000;
    const forecastRevenue = Array.from({length: periods}, (_, i) => 
      baseRevenue + (i * 5000) + (Math.random() * 10000 - 5000)
    );
    
    // Historical revenue
    const historicalRevenue = Array.from({length: periods}, (_, i) => 
      baseRevenue - 8000 + (i * 4000) + (Math.random() * 10000 - 5000)
    );
    
    // Booking pace
    const currentPace = Array.from({length: periods}, (_, i) => 
      80 - (i * 15) + (Math.random() * 10 - 5)
    );
    
    const lastYearPace = Array.from({length: periods}, (_, i) => 
      75 - (i * 15) + (Math.random() * 10 - 5)
    );
    
    return {
      occupancy: {
        labels,
        datasets: [
          {
            label: 'Historical',
            data: historicalOccupancy,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Forecast',
            data: forecastOccupancy,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      revenue: {
        labels,
        datasets: [
          {
            label: 'Historical',
            data: historicalRevenue,
            borderColor: '#6B8E23',
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Forecast',
            data: forecastRevenue,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      pace: {
        labels,
        datasets: [
          {
            label: 'Current Booking Pace',
            data: currentPace,
            borderColor: '#1A2A3A',
            backgroundColor: 'rgba(26, 42, 58, 0.1)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Last Year Pace',
            data: lastYearPace,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      metrics: {
        forecastOccupancy: forecastOccupancy[0].toFixed(1) + '%',
        forecastRevenue: formatCurrency(forecastRevenue[0]),
        paceVsLastYear: '+6.7%',
        forecastConfidence: 'High'
      }
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

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
    >
      <TouchableOpacity
        style={[styles.tab, activeTab === 'occupancy' && styles.activeTab]}
        onPress={() => setActiveTab('occupancy')}
      >
        <Text style={[styles.tabText, activeTab === 'occupancy' && styles.activeTabText]}>Occupancy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'revenue' && styles.activeTab]}
        onPress={() => setActiveTab('revenue')}
      >
        <Text style={[styles.tabText, activeTab === 'revenue' && styles.activeTabText]}>Revenue</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'guest' && styles.activeTab]}
        onPress={() => setActiveTab('guest')}
      >
        <Text style={[styles.tabText, activeTab === 'guest' && styles.activeTabText]}>Guest</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'operational' && styles.activeTab]}
        onPress={() => setActiveTab('operational')}
      >
        <Text style={[styles.tabText, activeTab === 'operational' && styles.activeTabText]}>Operational</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'comparison' && styles.activeTab]}
        onPress={() => setActiveTab('comparison')}
      >
        <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>Comparison</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'forecast' && styles.activeTab]}
        onPress={() => setActiveTab('forecast')}
      >
        <Text style={[styles.tabText, activeTab === 'forecast' && styles.activeTabText]}>Forecast</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderDateRangeSelector = () => (
    <View style={styles.dateRangeContainer}>
      <TouchableOpacity
        style={[styles.dateRangeButton, dateRange === 'week' && styles.activeDateRange]}
        onPress={() => setDateRange('week')}
      >
        <Text style={[styles.dateRangeText, dateRange === 'week' && styles.activeDateRangeText]}>Week</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.dateRangeButton, dateRange === 'month' && styles.activeDateRange]}
        onPress={() => setDateRange('month')}
      >
        <Text style={[styles.dateRangeText, dateRange === 'month' && styles.activeDateRangeText]}>Month</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.dateRangeButton, dateRange === 'quarter' && styles.activeDateRange]}
        onPress={() => setDateRange('quarter')}
      >
        <Text style={[styles.dateRangeText, dateRange === 'quarter' && styles.activeDateRangeText]}>Quarter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.dateRangeButton, dateRange === 'year' && styles.activeDateRange]}
        onPress={() => setDateRange('year')}
      >
        <Text style={[styles.dateRangeText, dateRange === 'year' && styles.activeDateRangeText]}>Year</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOccupancyReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Average Occupancy</Text>
          <Text style={styles.metricValue}>{occupancyData.metrics.averageOccupancy}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Peak Occupancy</Text>
          <Text style={styles.metricValue}>{occupancyData.metrics.peakOccupancy}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Lowest Occupancy</Text>
          <Text style={styles.metricValue}>{occupancyData.metrics.lowestOccupancy}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Trend</Text>
          <Text style={styles.metricValue}>{occupancyData.metrics.occupancyTrend}</Text>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Occupancy Trend</Text>
        <View style={styles.chart}>
          <LineChart data={occupancyData.overview} options={{
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
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Occupancy by Room Type</Text>
        <View style={styles.chart}>
          <BarChart data={occupancyData.breakdown} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              y: {
                min: 0,
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
      </View>
    </View>
  );

  const renderRevenueReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Revenue</Text>
          <Text style={styles.metricValue}>{revenueData.metrics.totalRevenue}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Average Revenue</Text>
          <Text style={styles.metricValue}>{revenueData.metrics.averageRevenue}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Profit</Text>
          <Text style={styles.metricValue}>{revenueData.metrics.totalProfit}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Profit Margin</Text>
          <Text style={styles.metricValue}>{revenueData.metrics.profitMargin}</Text>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue & Profit Trend</Text>
        <View style={styles.chart}>
          <LineChart data={revenueData.overview} options={{
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
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Breakdown</Text>
        <View style={styles.chart}>
          <BarChart data={revenueData.breakdown} options={{
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
      </View>
    </View>
  );

  const renderGuestReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg. Satisfaction</Text>
          <Text style={styles.metricValue}>{guestData.metrics.averageSatisfaction}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Repeat Guests</Text>
          <Text style={styles.metricValue}>{guestData.metrics.repeatGuests}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg. Stay Length</Text>
          <Text style={styles.metricValue}>{guestData.metrics.averageStayLength}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Loyalty Program</Text>
          <Text style={styles.metricValue}>{guestData.metrics.loyaltyProgram}</Text>
        </View>
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Guest Satisfaction</Text>
          <View style={styles.chart}>
            <PieChart data={guestData.satisfaction} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </View>
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Guest Demographics</Text>
          <View style={styles.chart}>
            <PieChart data={guestData.demographics} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </View>
        </View>
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Booking Source</Text>
          <View style={styles.chart}>
            <PieChart data={guestData.source} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </View>
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Guest Nationality</Text>
          <View style={styles.chart}>
            <PieChart data={guestData.nationality} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderOperationalReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg. Response Time</Text>
          <Text style={styles.metricValue}>{operationalData.metrics.avgResponseTime}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Staff Utilization</Text>
          <Text style={styles.metricValue}>{operationalData.metrics.staffUtilization}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Maintenance</Text>
          <Text style={styles.metricValue}>{operationalData.metrics.maintenanceResolution}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Energy Efficiency</Text>
          <Text style={styles.metricValue}>{operationalData.metrics.energyEfficiency}</Text>
        </View>
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Staff Efficiency</Text>
          <View style={styles.chart}>
            <LineChart data={operationalData.efficiency} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </View>
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Service Response Time</Text>
          <View style={styles.chart}>
            <LineChart data={operationalData.response} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </View>
        </View>
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Maintenance Issues</Text>
          <View style={styles.chart}>
            <BarChart data={operationalData.maintenance} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </View>
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>Energy Consumption</Text>
          <View style={styles.chart}>
            <LineChart data={operationalData.energy} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderComparisonReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Occupancy vs Competitors</Text>
          <Text style={styles.metricValue}>{comparisonData.metrics.occupancyVsCompetitors}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ADR vs Competitors</Text>
          <Text style={styles.metricValue}>{comparisonData.metrics.adrVsCompetitors}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>RevPAR vs Competitors</Text>
          <Text style={styles.metricValue}>{comparisonData.metrics.revparVsCompetitors}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Market Share Change</Text>
          <Text style={styles.metricValue}>{comparisonData.metrics.marketShareChange}</Text>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Occupancy Comparison</Text>
        <View style={styles.chart}>
          <LineChart data={comparisonData.occupancy} options={{
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
      </View>
      
      <View style={styles.chartRow}>
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>ADR Comparison</Text>
          <View style={styles.chart}>
            <LineChart data={comparisonData.adr} options={{
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
                      return '$' + value;
                    }
                  }
                }
              }
            }} />
          </View>
        </View>
        
        <View style={[styles.chartCard, styles.halfChart]}>
          <Text style={styles.chartTitle}>RevPAR Comparison</Text>
          <View style={styles.chart}>
            <LineChart data={comparisonData.revpar} options={{
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
                      return '$' + value.toFixed(0);
                    }
                  }
                }
              }
            }} />
          </View>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Market Share</Text>
        <View style={[styles.chart, styles.pieChartContainer]}>
          <PieChart data={comparisonData.marketShare} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
        </View>
      </View>
    </View>
  );

  const renderForecastReport = () => (
    <View style={styles.reportContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Forecast Occupancy</Text>
          <Text style={styles.metricValue}>{forecastData.metrics.forecastOccupancy}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Forecast Revenue</Text>
          <Text style={styles.metricValue}>{forecastData.metrics.forecastRevenue}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Pace vs Last Year</Text>
          <Text style={styles.metricValue}>{forecastData.metrics.paceVsLastYear}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Forecast Confidence</Text>
          <Text style={styles.metricValue}>{forecastData.metrics.forecastConfidence}</Text>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Occupancy Forecast</Text>
        <View style={styles.chart}>
          <LineChart data={forecastData.occupancy} options={{
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
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Forecast</Text>
        <View style={styles.chart}>
          <LineChart data={forecastData.revenue} options={{
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
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Booking Pace</Text>
        <View style={styles.chart}>
          <LineChart data={forecastData.pace} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              y: {
                min: 0,
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
      </View>
    </View>
  );

  const renderActiveReport = () => {
    switch (activeTab) {
      case 'occupancy':
        return occupancyData ? renderOccupancyReport() : null;
      case 'revenue':
        return revenueData ? renderRevenueReport() : null;
      case 'guest':
        return guestData ? renderGuestReport() : null;
      case 'operational':
        return operationalData ? renderOperationalReport() : null;
      case 'comparison':
        return comparisonData ? renderComparisonReport() : null;
      case 'forecast':
        return forecastData ? renderForecastReport() : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading reporting data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reporting Suite</Text>
          <Text style={styles.headerSubtitle}>Comprehensive analytics for SOVA Luxury Hotels</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderTabs()}
      {renderDateRangeSelector()}
      
      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchReportData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderActiveReport()
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data last updated: {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerDisclaimer}>
            This report is for internal use only. Confidential information.
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
  exportButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  exportButtonText: {
    color: '#1A2A3A',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
  },
  activeTab: {
    backgroundColor: '#1A2A3A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: '#F8F7F4',
  },
  activeDateRange: {
    backgroundColor: '#D4AF37',
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  activeDateRangeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#E53935',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reportContainer: {
    marginBottom: 20,
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
  metricLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
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
    marginBottom: 20,
  },
  halfChart: {
    width: '48%',
  },
  pieChartContainer: {
    maxWidth: 500,
    marginHorizontal: 'auto',
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

export default ReportingSuite;
