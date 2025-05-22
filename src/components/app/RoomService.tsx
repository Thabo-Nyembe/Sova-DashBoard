import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { getUserProfile, getAmenities, createRoomServiceRequest } from '../api/supabaseApi';

const RoomService = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedItems, setSelectedItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const categories = [
    { id: 'food', name: 'Food & Dining' },
    { id: 'beverage', name: 'Beverages' },
    { id: 'amenity', name: 'Room Amenities' },
    { id: 'housekeeping', name: 'Housekeeping' },
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
      
      // Get amenities
      const { data: amenitiesData, error: amenitiesError } = await getAmenities();
      
      if (amenitiesError) throw amenitiesError;
      
      setAmenities(amenitiesData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load room service options. Please try again later.');
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleItemToggle = (item) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Generate order number
      const generatedOrderNumber = `RS-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Create room service request
      const requestData = {
        user_id: session.user.id,
        items: JSON.stringify(selectedItems),
        special_instructions: specialInstructions,
        delivery_time: deliveryTime || 'As soon as possible',
        status: 'pending',
        total_amount: calculateTotal(),
        order_number: generatedOrderNumber
      };
      
      const { data, error } = await createRoomServiceRequest(requestData);
      
      if (error) throw error;
      
      setOrderNumber(generatedOrderNumber);
      setSuccess(true);
      setSubmitting(false);
      
      // Reset form
      setSelectedItems([]);
      setSpecialInstructions('');
      setDeliveryTime('');
    } catch (error) {
      console.error('Error submitting room service request:', error);
      setError('Failed to submit your request. Please try again later.');
      setSubmitting(false);
    }
  };

  const filteredAmenities = amenities.filter(item => item.category === selectedCategory);

  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryTabs}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.selectedCategoryTab
          ]}
          onPress={() => handleCategoryChange(category.id)}
        >
          <Text 
            style={[
              styles.categoryTabText,
              selectedCategory === category.id && styles.selectedCategoryTabText
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItems = () => (
    <View style={styles.itemsContainer}>
      {filteredAmenities.length > 0 ? (
        filteredAmenities.map(item => {
          const isSelected = selectedItems.some(selected => selected.id === item.id);
          const selectedItem = selectedItems.find(selected => selected.id === item.id);
          
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              
              <View style={styles.itemActions}>
                {isSelected ? (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, (selectedItem.quantity - 1))}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <TextInput
                      style={styles.quantityInput}
                      value={selectedItem.quantity.toString()}
                      onChangeText={(text) => handleQuantityChange(item.id, text)}
                      keyboardType="numeric"
                    />
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, (selectedItem.quantity + 1))}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleItemToggle(item)}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.noItemsText}>No items available in this category.</Text>
      )}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.orderSummaryTitle}>Order Summary</Text>
      
      {selectedItems.length > 0 ? (
        <>
          <View style={styles.selectedItemsList}>
            {selectedItems.map(item => (
              <View key={item.id} style={styles.selectedItemRow}>
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemName}>{item.name}</Text>
                  <Text style={styles.selectedItemQuantity}>x{item.quantity}</Text>
                </View>
                <Text style={styles.selectedItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleItemToggle(item)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}
    </View>
  );

  const renderOrderForm = () => (
    <View style={styles.orderForm}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Special Instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Any special requests or dietary requirements?"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Preferred Delivery Time</Text>
        <TextInput
          style={styles.input}
          value={deliveryTime}
          onChangeText={setDeliveryTime}
          placeholder="e.g., 7:30 PM or 'As soon as possible'"
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TouchableOpacity
        style={[
          styles.submitButton,
          (selectedItems.length === 0 || submitting) && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={selectedItems.length === 0 || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSuccessMessage = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Text style={styles.successIconText}>✓</Text>
      </View>
      
      <Text style={styles.successTitle}>Order Placed Successfully!</Text>
      <Text style={styles.successMessage}>
        Your room service order has been received and is being processed.
        You can track the status of your order in the dashboard.
      </Text>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumberLabel}>Order Number:</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => window.location.href = '/consumer'}
      >
        <Text style={styles.buttonText}>Return to Dashboard</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setSuccess(false);
          setSelectedCategory('food');
        }}
      >
        <Text style={styles.secondaryButtonText}>Place Another Order</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading room service options...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Room Service</Text>
      </View>
      
      {success ? (
        <View style={styles.content}>
          {renderSuccessMessage()}
        </View>
      ) : (
        <>
          {renderCategoryTabs()}
          
          <ScrollView style={styles.content}>
            {renderItems()}
            {renderOrderSummary()}
            {renderOrderForm()}
          </ScrollView>
        </>
      )}
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
  categoryTabs: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
  },
  selectedCategoryTab: {
    backgroundColor: '#1A2A3A',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  selectedCategoryTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  itemActions: {
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#F8F7F4',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1A2A3A',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    padding: 20,
  },
  orderSummary: {
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
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  selectedItemsList: {
    marginBottom: 15,
  },
  selectedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: 14,
    color: '#1A2A3A',
  },
  selectedItemQuantity: {
    fontSize: 12,
    color: '#666666',
  },
  selectedItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2A3A',
    marginRight: 10,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  emptyCartText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    padding: 10,
  },
  orderForm: {
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
  formGroup: {
    marginBottom: 15,
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
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto',
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
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    width: '100%',
  },
  orderNumberLabel: {
    fontSize: 16,
    color: '#666666',
    marginRight: 10,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
  },
  primaryButton: {
    backgroundColor: '#1A2A3A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#1A2A3A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoomService;
