import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native-web';
import { supabase } from '../api/supabaseApi';
import { signIn, signUp, resetPassword, getCurrentUser } from '../api/supabaseApi';

const AuthScreen = ({ onSignIn }) => {
  const [mode, setMode] = useState('signIn'); // 'signIn', 'signUp', 'resetPassword'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Check if user is already signed in
    const checkCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        onSignIn(user);
      }
    };
    
    checkCurrentUser();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { user, error } = await signIn(email, password);
      
      if (error) throw error;
      
      if (user) {
        onSignIn(user);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { user, error } = await signUp(email, password, firstName, lastName);
      
      if (error) throw error;
      
      setSuccess('Registration successful! Please check your email to verify your account.');
      setMode('signIn');
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setSuccess('Password reset instructions have been sent to your email.');
      setMode('signIn');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSignInForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Sign In to SOVA</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.formFooter}>
        <TouchableOpacity onPress={() => setMode('resetPassword')}>
          <Text style={styles.formFooterLink}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setMode('signUp')}>
          <Text style={styles.formFooterLink}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Create SOVA Account</Text>
      
      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
          />
        </View>
        
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.formFooter}>
        <TouchableOpacity onPress={() => setMode('signIn')}>
          <Text style={styles.formFooterLink}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResetPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Reset Password</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Send Reset Instructions</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.formFooter}>
        <TouchableOpacity onPress={() => setMode('signIn')}>
          <Text style={styles.formFooterLink}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>SOVA</Text>
          <Text style={styles.brandTagline}>Luxury Hospitality Platform</Text>
        </View>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Digital Check-In</Text>
            <Text style={styles.featureDescription}>Skip the front desk and go straight to your room</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Mobile Room Key</Text>
            <Text style={styles.featureDescription}>Use your phone to unlock your room</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Room Service</Text>
            <Text style={styles.featureDescription}>Order food and amenities with a tap</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Concierge Services</Text>
            <Text style={styles.featureDescription}>Get recommendations and book experiences</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightPanel}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}
        
        {mode === 'signIn' && renderSignInForm()}
        {mode === 'signUp' && renderSignUpForm()}
        {mode === 'resetPassword' && renderResetPasswordForm()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#1A2A3A',
    padding: 40,
    justifyContent: 'center',
  },
  brandContainer: {
    marginBottom: 60,
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  brandTagline: {
    fontSize: 18,
    color: '#D4AF37',
  },
  featureList: {
    marginTop: 40,
  },
  featureItem: {
    marginBottom: 30,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1A2A3A',
    borderRadius: 4,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formFooter: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formFooterLink: {
    color: '#1A2A3A',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  successText: {
    color: '#388E3C',
    fontSize: 14,
  },
  
  // Responsive styles
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
    },
    leftPanel: {
      display: 'none',
    },
    rightPanel: {
      padding: 20,
    },
  },
});

export default AuthScreen;
