import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, 
  ImageBackground, StyleSheet, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import authFirebaseApp from '@/config/authFirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebHelper from '@/helpers/WebHelper';
import AuthStorage from '@/helpers/AuthStorage';
import Env from '@/config/Env';
import GlobalTheme from '@/styles/Global';

const auth = getAuth(authFirebaseApp);

const SigninScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      const response = await fetch(
        WebHelper.joinUrl(Env.API_BASE_URL, '/auth/profile'),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        const { accountData } = result;
        if (rememberMe) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('uid', user.uid);
          await AsyncStorage.setItem('role', accountData.role);
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('phoneNumber', accountData.phoneNumber);
          await AsyncStorage.setItem('displayName', user.displayName || '');
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('rememberMe', 'true');
          await AsyncStorage.setItem('rememberEmail', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.setItem('rememberMe', 'false');
          await AsyncStorage.setItem('rememberEmail', '');
          await AsyncStorage.setItem('password', '');
        }

        await AuthStorage.saveUser({
          uid: user.uid,
          role: accountData.role,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          displayName: user.displayName || '',
          token,
        });

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Events',
              state: {
                routes: [
                  {
                    name: 'Event',
                    params: { result },
                  },
                ],
              },
            },
          ],
        });
      } else {
        Alert.alert('Error', result.message || 'Failed to get account information');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert('Sign in failed', error.message);
    }
  };

  useEffect(() => {
    const loadRemembered = async () => {
      const remember = await AsyncStorage.getItem('rememberMe');
      if (remember === 'true') {
        const storedEmail = await AsyncStorage.getItem('rememberEmail');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
        setRememberMe(true);
      }
    };
    loadRemembered();
  }, []);
  
  return (
    // Background Image
    <ImageBackground
      source={require('@/assets/images/background.webp')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain" 
          />
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Event Pro</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={16} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={16} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Remember */}
          <View style={styles.rememberMeRow}>
            <Text style={styles.rememberMeText}>Remember</Text>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: GlobalTheme.gray1, true: GlobalTheme.primary }}
            />
          </View>

          {/* Signin button */}
          <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
            <Text style={styles.signinButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Signup button */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupButtonText}> Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Back to Event Button */}
          <View style={styles.backToRow}>
            <Text style={styles.backToText}>Back to</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.backToButtonText}> Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center' 
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  logo: { 
    width: 275, 
    height: 275, 
    marginTop: 50,
  },
  formContainer: {
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: GlobalTheme.gray3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: GlobalTheme.background,
  },
  inputIcon: { 
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  rememberMeText: {
    marginRight: 15,
    fontSize: 14,
    color: GlobalTheme.gray3,
  },
  signinButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  signinButtonText: {
    color: GlobalTheme.white,
    fontSize: GlobalTheme.buttonFontSize,
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
    color: GlobalTheme.gray3,
  },
  signupButtonText: {
    fontSize: 14,
    color: GlobalTheme.buttonText,
    fontWeight: 'bold',
  },
  backToRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  backToText: {
    fontSize: 14,
    color: GlobalTheme.gray3,
  },
  backToButtonText: {
    fontSize: 14,
    color: GlobalTheme.buttonText,
    fontWeight: 'bold',
  },
});

export default SigninScreen;
