import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabaseClient'; // Adjust path if necessary

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) Alert.alert('Login Error', error.message);
      // On success, navigation to a different screen will be handled by the App.tsx listener
    } else {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        Alert.alert('Signup Error', error.message);
      } else {
        Alert.alert('Success', 'Check your email for the confirmation link!');
      }
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOVA</Text>
      <Text style={styles.subtitle}>Luxury Hotel Experience</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {!isLogin && (
          <>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </>
        )}
        
        <Button
          title={loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          onPress={handleAuth}
          disabled={loading}
        />
        
        <Text 
          style={styles.toggleText}
          onPress={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  toggleText: {
    marginTop: 20,
    color: '#007BFF',
    textAlign: 'center',
  },
});

export default AuthScreen;
