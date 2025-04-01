import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import GlobalTheme from '@/styles/Global';

const RequireLoginScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.notLoggedContainer}>
      <Image
        source={require('@/assets/logo/signin.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.notLoggedText}>Login to start your event</Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Accounts' as never,
                state: {
                  index: 0,
                  routes: [
                    { name: 'Signin' as never },
                  ],
                },
              },
            ],
          });
        }}>
        <Icon name="sign-in" size={16} color={GlobalTheme.white} style={styles.buttonIcon} />
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequireLoginScreen;

const styles = StyleSheet.create({
  notLoggedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  notLoggedText: {
    fontSize: 18,
    marginBottom: 20,
    color: GlobalTheme.gray3,
    fontWeight: 'bold',
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
