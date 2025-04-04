import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EventStackScreen, FavoriteStackScreen, AccountStackScreen } from '@/screens/index';
import { StripeProvider } from '@stripe/stripe-react-native';
import Env from '@/config/Env';
import { getTabBarVisibility } from '@/helpers/NavigationHelper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalTheme from '@/styles/Global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebHelper from '@/helpers/WebHelper';
import AuthStorage from '@/helpers/AuthStorage';
import { navigationRef, resetStackToTop } from '@/helpers/NavigationHelper';

const Tab = createBottomTabNavigator();


export default function App() {
  
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, '/auth/checkToken'), {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
          });
          if (!response.ok) {
            await AuthStorage.clearUser();
          }
        } catch (error) {
          console.error('Error checking token:', error);
          await AuthStorage.clearUser();
        }
      }
    };
    checkToken();
  }, []);

  return (
    <StripeProvider publishableKey={Env.STRIPE_PK_KEY}>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator>
          <Tab.Screen
            name="Events"
            component={EventStackScreen}
            listeners={{
              tabPress: (e) => {
                e.preventDefault(); 
                resetStackToTop('Events', 'Event'); // The First Screen
              },
            }}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: getTabBarVisibility(route),
              tabBarActiveTintColor: GlobalTheme.primary,
              tabBarInactiveTintColor: GlobalTheme.gray2,
              tabBarIcon: ({ focused }) => (
                <Icon name="calendar" size={22} color={focused ? GlobalTheme.primary : GlobalTheme.gray2} />
              ),
            })}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoriteStackScreen}
            listeners={{
              tabPress: (e) => {
                e.preventDefault(); 
                resetStackToTop('Favorites', 'Favorites'); // The First Screen
              },
            }}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: getTabBarVisibility(route),
              tabBarActiveTintColor: GlobalTheme.primary,
              tabBarInactiveTintColor: GlobalTheme.gray2,
              tabBarLabel: 'Favorites',
              tabBarIcon: ({ color }) => (
                <Icon name="heart" size={22} color={color} />
              ),
            })}
          />
          <Tab.Screen
            name="Accounts" // Navigate route use this. NOT tabBarLabel.
            component={AccountStackScreen}
            listeners={{
              tabPress: (e) => {
                e.preventDefault(); 
                resetStackToTop('Accounts', 'Account'); // The First Screen
              },
            }}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: getTabBarVisibility(route),
              tabBarActiveTintColor: GlobalTheme.primary,
              tabBarInactiveTintColor: GlobalTheme.gray2,
              tabBarLabel: 'Account',
              tabBarIcon: ({ color }) => (
                <Icon2 name="account" size={26} color={color} />
              ),
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}