import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, } from 'react-native';
import SectionDivider from '@/components/SectionDivider';
import { useRoute } from '@react-navigation/native';
import UserEventQRCode from '@/components/UserEventQRCode';
import EventDetailTop from '@/components/EventDetailTop';
import EventDetailBottom from '@/components/EventDetailBottom';
import GlobalTheme from '@/styles/Global';
import LoadingScreen from '../System/LoadingScreen';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';

const UserEventDetailScreen: React.FC = ({ navigation }: any) => {
  const route = useRoute<any>();
  const { event, orderID } = route.params;
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the data if the event data is exist
    if (event) { // UserEventScreen -> UserEventDetailScreen
      setOrderData(event);
      setLoading(false);
    }
    else if (orderID) { // EventThankyouScreen -> UserEventDetailScreen
      const fetchOrderDetail = async () => {
        try {
          const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `/events/eventOrderDetail/${orderID}`), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          if (response.ok) {
            setOrderData(data);
          } else {
            Alert.alert('Error', data.message || 'Failed to fetch order detail.');
          }
        } catch (error) {
          console.error('Fetch order detail error:', error);
          Alert.alert('Error', 'Failed to fetch order detail.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetail();
    }
    else {
      Alert.alert('Error', 'No event data provided.');
    }
  }, [event, orderID]);

  if (loading) return <LoadingScreen />;
  if (!orderData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No order data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Information */}
        <EventDetailTop event={orderData.event} />

        {/* Event QRCode */}
        <UserEventQRCode tickets={orderData.tickets} />
        <SectionDivider />

        {/* Event Detail */}
        <EventDetailBottom event={orderData.event} />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalTheme.white
  },
  scrollContent: {
    paddingBottom: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { fontSize: 16, color: GlobalTheme.danger },
});

export default UserEventDetailScreen;
