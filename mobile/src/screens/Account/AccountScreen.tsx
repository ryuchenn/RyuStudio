import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { authAuth } from '@/config/authFirebaseConfig';
import AuthStorage from '@/helpers/AuthStorage';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/screens/System/LoadingScreen';
import RequireLoginScreen from '@/screens/System/RequireLoginScreen';
import GlobalTheme from '@/styles/Global';
import SectionDivider from '@/components/SectionDivider';

const AccountScreen: React.FC = ({ navigation }: any) => {
  const { user, isLoggedIn, loading } = useAuth();

  // Signout button
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await authAuth.signOut();
              await AuthStorage.clearUser();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Accounts',
                    state: {
                      routes: [
                        {
                          name: 'Account',
                        },
                      ],
                    },
                  },
                ],
              });
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (!isLoggedIn) return <RequireLoginScreen />;
  if (loading) return <LoadingScreen />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Account</Text>

      {/* User Profile */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('UpdateProfile')}
      >
        <View style={styles.menuLeft}>
          <Icon name="user" size={20} color={GlobalTheme.gray3} style={styles.menuIcon} />
          <Text style={styles.menuText}>Update Profile</Text>
        </View>
        <Icon name="angle-right" size={20} color={GlobalTheme.gray3} />
      </TouchableOpacity>

      {/* User Event */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('UserEvent')}
      >
        <View style={styles.menuLeft}>
          <Icon name="calendar" size={20} color={GlobalTheme.gray3} style={styles.menuIcon} />
          <Text style={styles.menuText}>Your Event</Text>
        </View>
        <Icon name="angle-right" size={20} color={GlobalTheme.gray3} />
      </TouchableOpacity>

      {/* Admin - Add Edit */}
      {user?.role === "Admin" ? (
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EventEdit')}>
          <View style={styles.menuLeft}>
            <Icon name="lock" size={20} color={GlobalTheme.gray3} style={styles.menuIcon} />
            <Text style={styles.menuText}>Admin Only - Add Event</Text>
          </View>
          <Icon name="angle-right" size={20} color={GlobalTheme.gray3} />
        </TouchableOpacity>
      ) : <></>}

      <SectionDivider />

      {/* Sign Out */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleSignOut}
      >
        <View style={styles.menuLeft}>
          <Icon name="sign-out" size={20} color="red" style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: 'red' }]}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalTheme.background,
  },
  header: {
    marginTop: 80,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  menuText: {
    fontSize: 16,
    color: GlobalTheme.gray3,
  },
});

export default AccountScreen;
