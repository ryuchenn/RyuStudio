import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, 
  ImageBackground, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import GlobalTheme from '@/styles/Global';

const SignupScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = async () => {
    try {
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, "/auth/signup"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phoneNumber,
          displayName,
          password,
          pictureURL: `https://i.pravatar.cc/150?u=${displayName}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setSignupSuccess(true); // See the success message when signup success
      } else {
        Alert.alert(`Failed：\n${result.message}`);
      }
    } catch (error) {
      console.error('Failed：\n', error);
      Alert.alert('Failed. Try again later.');
    }
  };

  return (
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

        {/* Signup Form */}
        <View style={styles.formContainer}>
          {!signupSuccess ? (
            <>
              <Text style={styles.title}>Sign Up</Text>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="user" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="phone" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={16} color={GlobalTheme.gray2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.signinRow}>
                <Text style={styles.signinText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                  <Text style={styles.signinButtonText}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Icon name="check-circle" size={48} color={GlobalTheme.green} />
              <Text style={styles.successText}>Signup Success！</Text>
              <Text style={styles.successSubText}>Now you can login!</Text>
              <TouchableOpacity style={styles.signinButton} onPress={() => navigation.navigate('Signin')}>
                <Text style={styles.signupButtonText}>Go to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 30,
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
  signupButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signinText: {
    fontSize: 14,
    color: GlobalTheme.gray3,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: GlobalTheme.green,
    marginVertical: 10,
  },
  successSubText: {
    fontSize: 16,
    color: GlobalTheme.gray3,
    marginBottom: 20,
  },
  signinButton: {
    flexDirection: 'row',
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  signinButtonText: {
    fontSize: 16,
    color: GlobalTheme.buttonText,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
