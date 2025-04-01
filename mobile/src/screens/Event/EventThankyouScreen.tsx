import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalTheme from '@/styles/Global';
import Icon from 'react-native-vector-icons/FontAwesome';

const EventThankyouScreen: React.FC = ({ navigation, route }: any) => {
  const { orderID } = route.params;
  return (
    
    <View style={styles.container}>
      <Icon name="check-circle" size={150} color={GlobalTheme.green} />
      <Text style={styles.title}>Thank You!</Text>
      <Text>Your registration has been completed.</Text>
      <TouchableOpacity 
        style={styles.eventButton} 
        onPress={() => navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Accounts',
              state: {
                routes: [
                  {
                    name: 'UserEventDetail',
                    params: { orderID: orderID },
                  },
                ],
              },
            },
          ],
        })
      }
      >
        <Text style={styles.eventButtonText}>Your Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    color: GlobalTheme.green,
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  eventButton: {
    marginTop: 20,
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  eventButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventThankyouScreen;
