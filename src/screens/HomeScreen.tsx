import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../../supabaseClient'; // Adjust path if necessary
import type { Session } from '@supabase/supabase-js';

interface HomeScreenProps {
  session: Session;
}

const HomeScreen = ({ session }: HomeScreenProps) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Error', error.message);
    }
    // On success, navigation to AuthScreen will be handled by App.tsx listener
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sova!</Text>
      {session?.user?.email && <Text style={styles.emailText}>Logged in as: {session.user.email}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </View>
      <View style={styles.dashboardContent}>
        <Text style={styles.contentText}>Your Mobile Dashboard Content Goes Here.</Text>
        {/* Placeholder for future dashboard items */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 30,
  },
  dashboardContent: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#444',
  },
});

export default HomeScreen;
