import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import useAuth from '@/hooks/useAuth';
import RequireLoginScreen from '@/screens/System/RequireLoginScreen';
import LoadingScreen from '@/screens/System/LoadingScreen';
import GlobalTheme from '@/styles/Global';

const UpdateProfileScreen: React.FC = ({ navigation }: any) => {
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const { isLoggedIn, loading } = useAuth();

  // Get Account Data by token
  const fetchAccountData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "No token found or expired. Please sign in again.");
        return;
      }
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, '/auth/profile'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setDisplayName(data.accountData.displayName || '');
        setphoneNumber(data.accountData.phoneNumber || '');
      } else {
        Alert.alert("Error", data.message || "Failed to fetch profile.");
      }
    } catch (error: any) {
      console.error("Fetch profile error:", error);
      Alert.alert("Error", "Failed to fetch profile. Please try again later.");
    } finally {
    }
  };

  // Update profile by token
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "No token found. Please sign in again.");
        return;
      }
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, '/auth/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          phoneNumber,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Profile updated!');
        await AsyncStorage.setItem('displayName', displayName);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);

        navigation.goBack();
      } else {
        Alert.alert('Update failed', result.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert('Update failed', 'Failed to update profile. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  if (!isLoggedIn) return <RequireLoginScreen />;
  if (loading) return <LoadingScreen />;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Profile</Text>
      
      {/* Display Name */}
      <View style={styles.inputGroup}>
        <Icon name="user" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          value={displayName} 
          onChangeText={setDisplayName} 
          placeholder="Enter your display name" 
        />
      </View>
      
      {/* Phone Number */}
      <View style={styles.inputGroup}>
        <Icon name="phone" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
        <Text style={styles.label}>Phone</Text>
        <TextInput 
          style={styles.input} 
          value={phoneNumber} 
          onChangeText={setphoneNumber} 
          placeholder="Enter your phone number" 
          keyboardType="phone-pad"
        />
      </View>
      
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: GlobalTheme.background
  },
  header: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  inputGroup: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalTheme.background,
  },
  inputIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: GlobalTheme.gray3,
    width: 120,
  },
  input: {
    color: GlobalTheme.gray3,
    flex: 1,
    height: 40,
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateProfileScreen;
