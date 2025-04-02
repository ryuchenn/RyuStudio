import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, } from 'react-native';
import SectionDivider from '@/components/SectionDivider';
import { useRoute } from '@react-navigation/native';
import UserEventQRCode from '@/components/UserEventQRCode';
import EventDetailTop from '@/components/EventDetailTop';
import EventDetailBottom from '@/components/EventDetailBottom';
import GlobalTheme from '@/styles/Global';
import LoadingScreen from '../System/LoadingScreen';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserEventDetailScreen: React.FC = ({ navigation }: any) => {
  const route = useRoute<any>();
  const { event, orderID } = route.params;
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (event) {
      setOrderData(event);
      setLoading(false);
    } else if (orderID) {
      const fetchOrderDetail = async () => {
        try {
          const response = await fetch(
            WebHelper.joinUrl(Env.API_BASE_URL, `/events/eventOrderDetail/${orderID}`),
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
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
    } else {
      Alert.alert('Error', 'No event data provided.');
      setLoading(false);
    }
  }, [event, orderID]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Events',
                  state: {
                    routes: [
                      {
                        name: 'Event',
                      },
                    ],
                  },
                },],
            });
          }}
          style={{ marginLeft: 10 }}
        >
          <Icon name="chevron-left" size={20} color={GlobalTheme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        <Text style={styles.qrTitle}>Ticket QRCode</Text>
        <UserEventQRCode tickets={orderData.tickets} />

        {/* Add Price Summary */}
        <Text style={styles.priceTitle}>Receipt</Text>
        <View style={styles.orderSummaryContainer}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Subtotal:</Text>
            <Text style={styles.orderValue}>${Number(orderData.subtotal).toFixed(2)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>GST:</Text>
            <Text style={styles.orderValue}>${Number(orderData.GST).toFixed(2)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Discount:</Text>
            <Text style={styles.orderValue}>${orderData.discountAmount ? Number(orderData.discountAmount).toFixed(2) : "0.00"}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total:</Text>
            <Text style={styles.orderValue}>${Number(orderData.total).toFixed(2)}</Text>
          </View>
        </View>
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
  orderSummaryContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: GlobalTheme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    marginBottom: 30,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    margin: 5
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: GlobalTheme.gray4,
  },
  orderValue: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  priceTitle: {
    fontSize: 25,
    color: GlobalTheme.gray4,
    marginLeft: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  qrTitle: {
    fontSize: 25,
    color: GlobalTheme.gray4,
    marginTop: 30,
    marginLeft: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default UserEventDetailScreen;
