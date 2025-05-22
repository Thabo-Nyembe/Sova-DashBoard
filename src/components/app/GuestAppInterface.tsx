import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GuestAppInterface = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock data for the guest app
  const upcomingStay = {
    hotelName: "The Royal Palm Zanzibar",
    checkInDate: "May 25, 2025",
    checkOutDate: "May 30, 2025",
    roomType: "Ocean View Suite",
    reservationCode: "RP-25052025-123"
  };
  
  const loyaltyPoints = {
    current: 2450,
    lifetime: 5800,
    tier: "Gold",
    nextTier: "Platinum",
    pointsToNextTier: 1200
  };
  
  const services = [
    { id: 1, name: "Room Service", icon: "room-service-icon.png" },
    { id: 2, name: "Spa Booking", icon: "spa-icon.png" },
    { id: 3, name: "Digital Key", icon: "key-icon.png" },
    { id: 4, name: "Housekeeping", icon: "housekeeping-icon.png" },
    { id: 5, name: "Concierge", icon: "concierge-icon.png" },
    { id: 6, name: "Transportation", icon: "transport-icon.png" }
  ];
  
  const renderHomeTab = () => (
    <View style={styles.tabContent}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeText}>Welcome back, Sarah</Text>
        <Text style={styles.welcomeSubtext}>Your luxury experience awaits</Text>
      </View>
      
      {/* Upcoming Stay Card */}
      <View style={styles.upcomingStayCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Upcoming Stay</Text>
        </View>
        <View style={styles.stayDetails}>
          <Text style={styles.hotelName}>{upcomingStay.hotelName}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>{upcomingStay.checkInDate}</Text>
            </View>
            <View style={styles.dateDivider}></View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>{upcomingStay.checkOutDate}</Text>
            </View>
          </View>
          <Text style={styles.roomType}>{upcomingStay.roomType}</Text>
          <Text style={styles.reservationCode}>Reservation: {upcomingStay.reservationCode}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CheckIn')}>
              <Text style={styles.actionButtonText}>Digital Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('DigitalKey')}>
              <Text style={styles.actionButtonText}>Room Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Services Grid */}
      <Text style={styles.sectionTitle}>Hotel Services</Text>
      <View style={styles.servicesGrid}>
        {services.map(service => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceItem}
            onPress={() => navigation.navigate(service.name.replace(/\s+/g, ''))}
          >
            <View style={styles.serviceIconContainer}>
              {/* Placeholder for service icon */}
              <View style={styles.serviceIconPlaceholder}></View>
            </View>
            <Text style={styles.serviceName}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Loyalty Points Summary */}
      <View style={styles.loyaltyCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>SOVA Rewards</Text>
        </View>
        <View style={styles.loyaltyContent}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsValue}>{loyaltyPoints.current}</Text>
            <Text style={styles.pointsLabel}>Available Points</Text>
          </View>
          <View style={styles.tierContainer}>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{loyaltyPoints.tier}</Text>
            </View>
            <Text style={styles.tierProgress}>
              {loyaltyPoints.pointsToNextTier} points to {loyaltyPoints.nextTier}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewDetailsButton} onPress={() => setActiveTab('loyalty')}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Services</Text>
      
      {/* Room Service Section */}
      <View style={styles.serviceSection}>
        <Text style={styles.serviceSectionTitle}>Room Service</Text>
        <View style={styles.menuCategories}>
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategory]}>
            <Text style={styles.categoryText}>Breakfast</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Dinner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Drinks</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuItems}>
          {/* Sample menu items */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemName}>Continental Breakfast</Text>
              <Text style={styles.menuItemDescription}>Selection of pastries, fresh fruit, yogurt, and coffee or tea</Text>
              <Text style={styles.menuItemPrice}>$24</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemName}>American Breakfast</Text>
              <Text style={styles.menuItemDescription}>Eggs any style, bacon or sausage, toast, and breakfast potatoes</Text>
              <Text style={styles.menuItemPrice}>$28</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemName}>Healthy Start</Text>
              <Text style={styles.menuItemDescription}>Egg white omelet with spinach, avocado toast, and fresh fruit</Text>
              <Text style={styles.menuItemPrice}>$26</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Spa Booking Section */}
      <View style={styles.serviceSection}>
        <Text style={styles.serviceSectionTitle}>Spa Services</Text>
        <View style={styles.spaServices}>
          <TouchableOpacity style={styles.spaServiceItem}>
            <View style={styles.spaServiceImage}></View>
            <Text style={styles.spaServiceName}>Swedish Massage</Text>
            <Text style={styles.spaServiceDuration}>60 min</Text>
            <Text style={styles.spaServicePrice}>$120</Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.spaServiceItem}>
            <View style={styles.spaServiceImage}></View>
            <Text style={styles.spaServiceName}>Deep Tissue Massage</Text>
            <Text style={styles.spaServiceDuration}>90 min</Text>
            <Text style={styles.spaServicePrice}>$180</Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  const renderLoyaltyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Loyalty Program</Text>
      
      {/* Points Summary */}
      <View style={styles.pointsSummaryCard}>
        <View style={styles.pointsHeader}>
          <Text style={styles.pointsHeaderText}>Your SOVA Rewards</Text>
        </View>
        <View style={styles.pointsBody}>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsRowLabel}>Available Points</Text>
            <Text style={styles.pointsRowValue}>{loyaltyPoints.current}</Text>
          </View>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsRowLabel}>Lifetime Points</Text>
            <Text style={styles.pointsRowValue}>{loyaltyPoints.lifetime}</Text>
          </View>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsRowLabel}>Current Tier</Text>
            <View style={[styles.tierBadge, styles.tierBadgeSmall]}>
              <Text style={styles.tierTextSmall}>{loyaltyPoints.tier}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Tier Progress */}
      <View style={styles.tierProgressCard}>
        <Text style={styles.tierProgressTitle}>Tier Progress</Text>
        <View style={styles.tierProgressBar}>
          <View style={[styles.tierProgressFill, { width: '67%' }]}></View>
        </View>
        <View style={styles.tierLabels}>
          <Text style={styles.tierLabel}>Silver</Text>
          <Text style={styles.tierLabel}>Gold</Text>
          <Text style={styles.tierLabel}>Platinum</Text>
        </View>
        <Text style={styles.tierProgressText}>
          {loyaltyPoints.pointsToNextTier} more points needed to reach {loyaltyPoints.nextTier}
        </Text>
      </View>
      
      {/* Benefits */}
      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>{loyaltyPoints.tier} Tier Benefits</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}></View>
            <Text style={styles.benefitText}>Priority Check-in</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}></View>
            <Text style={styles.benefitText}>Late Check-out (2pm)</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}></View>
            <Text style={styles.benefitText}>Room Upgrade (when available)</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}></View>
            <Text style={styles.benefitText}>Welcome Amenity</Text>
          </View>
        </View>
      </View>
      
      {/* Points History */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Points History</Text>
        <View style={styles.historyList}>
          <View style={styles.historyItem}>
            <View style={styles.historyDetails}>
              <Text style={styles.historyName}>Stay at Royal Palm Zanzibar</Text>
              <Text style={styles.historyDate}>April 15, 2025</Text>
            </View>
            <Text style={styles.historyPoints}>+1,200</Text>
          </View>
          <View style={styles.historyItem}>
            <View style={styles.historyDetails}>
              <Text style={styles.historyName}>Spa Service</Text>
              <Text style={styles.historyDate}>April 16, 2025</Text>
            </View>
            <Text style={styles.historyPoints}>+150</Text>
          </View>
          <View style={styles.historyItem}>
            <View style={styles.historyDetails}>
              <Text style={styles.historyName}>Room Service</Text>
              <Text style={styles.historyDate}>April 17, 2025</Text>
            </View>
            <Text style={styles.historyPoints}>+100</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile</Text>
      
      {/* Profile Information */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@example.com</Text>
            <View style={[styles.tierBadge, styles.tierBadgeSmall]}>
              <Text style={styles.tierTextSmall}>{loyaltyPoints.tier}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Stay History */}
      <View style={styles.stayHistoryCard}>
        <Text style={styles.stayHistoryTitle}>Stay History</Text>
        <View style={styles.stayList}>
          <View style={styles.stayItem}>
            <View style={styles.stayDetails}>
              <Text style={styles.stayHotel}>The Royal Palm Zanzibar</Text>
              <Text style={styles.stayDate}>April 15-20, 2025</Text>
              <Text style={styles.stayRoom}>Ocean View Suite</Text>
            </View>
            <TouchableOpacity style={styles.rateButton}>
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.stayItem}>
            <View style={styles.stayDetails}>
              <Text style={styles.stayHotel}>Serene Luxury Cape Town</Text>
              <Text style={styles.stayDate}>March 5-10, 2025</Text>
              <Text style={styles.stayRoom}>Mountain View Room</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Preferences */}
      <View style={styles.preferencesCard}>
        <Text style={styles.preferencesTitle}>Preferences</Text>
        <View style={styles.preferencesList}>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Room Preferences</Text>
            <Text style={styles.preferenceValue}>High floor, Away from elevator</Text>
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Dietary Restrictions</Text>
            <Text style={styles.preferenceValue}>Vegetarian</Text>
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Special Requests</Text>
            <Text style={styles.preferenceValue}>Extra pillows</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editPreferencesButton}>
          <Text style={styles.editPreferencesText}>Edit Preferences</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render the appropriate tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'home':
        return renderHomeTab();
      case 'services':
        return renderServicesTab();
      case 'loyalty':
        return renderLoyaltyTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderHomeTab();
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderTabContent()}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
          onPress={() => setActiveTab('home')}
        >
          <View style={styles.navIcon}></View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'services' && styles.activeNavItem]} 
          onPress={() => setActiveTab('services')}
        >
          <View style={styles.navIcon}></View>
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'loyalty' && styles.activeNavItem]} 
          onPress={() => setActiveTab('loyalty')}
        >
          <View style={styles.navIcon}></View>
          <Text style={styles.navText}>Rewards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
          onPress={() => setActiveTab('profile')}
        >
          <View style={styles.navIcon}></View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom nav
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 20,
  },
  welcomeBanner: {
    backgroundColor: '#1A2A3A',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeSubtext: {
    color: '#D4AF37',
    fontSize: 16,
    marginTop: 5,
  },
  upcomingStayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: '#1A2A3A',
    padding: 15,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stayDetails: {
    padding: 15,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  dateDivider: {
    width: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 15,
  },
  roomType: {
    fontSize: 16,
    color: '#1A2A3A',
    marginBottom: 5,
  },
  reservationCode: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#1A2A3A',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
    marginTop: 10,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0E6C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceIconPlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 15,
  },
  serviceName: {
    fontSize: 14,
    color: '#1A2A3A',
    textAlign: 'center',
  },
  loyaltyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loyaltyContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666666',
  },
  tierContainer: {
    alignItems: 'center',
  },
  tierBadge: {
    backgroundColor: '#D4AF37',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 5,
  },
  tierText: {
    color: '#1A2A3A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tierProgress: {
    fontSize: 14,
    color: '#666666',
  },
  viewDetailsButton: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    padding: 15,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#1A2A3A',
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  navIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: '#1A2A3A',
  },
  // Service Tab Styles
  serviceSection: {
    marginBottom: 30,
  },
  serviceSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  menuCategories: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
  },
  activeCategory: {
    backgroundColor: '#D4AF37',
  },
  categoryText: {
    color: '#1A2A3A',
    fontWeight: '500',
  },
  menuItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1A2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spaServices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spaServiceItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spaServiceImage: {
    height: 120,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    marginBottom: 10,
  },
  spaServiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  spaServiceDuration: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  spaServicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Loyalty Tab Styles
  pointsSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pointsHeader: {
    backgroundColor: '#1A2A3A',
    padding: 15,
  },
  pointsHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsBody: {
    padding: 15,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  pointsRowLabel: {
    fontSize: 16,
    color: '#666666',
  },
  pointsRowValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A3A',
  },
  tierBadgeSmall: {
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tierTextSmall: {
    fontSize: 14,
  },
  tierProgressCard: {
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
  tierProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  tierProgressBar: {
    height: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    marginBottom: 10,
  },
  tierProgressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tierLabel: {
    fontSize: 14,
    color: '#666666',
  },
  tierProgressText: {
    fontSize: 14,
    color: '#1A2A3A',
    textAlign: 'center',
  },
  benefitsCard: {
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
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  benefitsList: {},
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  benefitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D4AF37',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#1A2A3A',
  },
  historyCard: {
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
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  historyList: {},
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  historyDetails: {},
  historyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#666666',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  // Profile Tab Styles
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAEAEA',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stayHistoryCard: {
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
  stayHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  stayList: {},
  stayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  stayDetails: {
    flex: 1,
  },
  stayHotel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  stayDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  stayRoom: {
    fontSize: 14,
    color: '#666666',
  },
  rateButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  rateButtonText: {
    color: '#1A2A3A',
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  viewButtonText: {
    color: '#1A2A3A',
    fontWeight: '600',
  },
  preferencesCard: {
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
  preferencesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  preferencesList: {},
  preferenceItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  preferenceValue: {
    fontSize: 16,
    color: '#1A2A3A',
  },
  editPreferencesButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  editPreferencesText: {
    color: '#1A2A3A',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#1A2A3A',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#1A2A3A',
    fontWeight: '600',
  },
});

export default GuestAppInterface;
