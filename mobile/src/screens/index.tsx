import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Other
import GlobalTheme from '@/styles/Global';

// Event
import EventScreen from '@/screens/Event/EventScreen';
import EventDetailScreen from '@/screens/Event/EventDetailScreen';
import EventCheckoutScreen from '@/screens/Event/EventCheckoutScreen';
import EventThankyouScreen from '@/screens/Event/EventThankyouScreen';
import EventEditScreen from '@/screens/Event/EventEditScreen';

// Favorite
import FavoriteScreen from '@/screens/General/FavoriteScreen';

// Account
import AccountScreen from '@/screens/Account/AccountScreen';
import UpdateProfileScreen from '@/screens/Account/UpdateProfileScreen';
import SigninScreen from '@/screens/Account/SigninScreen';
import SignupScreen from '@/screens/Account/SignupScreen';
import UserEventScreen from '@/screens/Account/UserEventScreen';
import UserEventDetailScreen from '@/screens/Account/UserEventDetailScreen';

// Different Stack Navigator
const EventStack = createStackNavigator();
const FavoriteStack = createStackNavigator();
const AccountStack = createStackNavigator();

function EventStackScreen() {
  return (
    <EventStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: GlobalTheme.background },
      }}
    >
      <EventStack.Screen
        name="Event"
        component={EventScreen}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerTitle: '',
        }}
      />
      <EventStack.Screen
        name="EventCheckout"
        component={EventCheckoutScreen}
        options={{
          headerTitle: 'Checkout',
        }}
      />
      <EventStack.Screen
        name="EventThankyou"
        component={EventThankyouScreen}
        options={{
          headerTitle: '',
          headerLeft: () => null, // Diabled return button
          gestureEnabled: false,  // Diabled gesture return button
        }}
      />
    </EventStack.Navigator>
  );
}

function FavoriteStackScreen() {
  return (
    <FavoriteStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: GlobalTheme.background },
      }}
    >
      <FavoriteStack.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
    </FavoriteStack.Navigator>
  );
}

function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: GlobalTheme.background },
      }}
    >
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
      <AccountStack.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={{ headerTitle: '' }}
      />
      <AccountStack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ 
          headerTitle: 'Signin',
          headerShown: false,
          headerLeft: () => null, // Diabled return button
          gestureEnabled: false,  // Diabled gesture return button
        }}
      />
      <AccountStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ 
          headerTitle: '', 
          headerShown: false  
        }}
      />
      <AccountStack.Screen
        name="UserEvent"
        component={UserEventScreen}
        options={{ headerTitle: 'My Event' }}
      />
      <AccountStack.Screen
        name="UserEventDetail"
        component={UserEventDetailScreen}
        options={{ headerTitle: '' }}
      />
      <AccountStack.Screen
        name="EventEdit"
        component={EventEditScreen}
        options={{ 
          headerTitle: 'Edit Event',
        }}
      />
    </AccountStack.Navigator>
  );
}

export { EventStackScreen, FavoriteStackScreen, AccountStackScreen };
