import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/AntDesign';
import { CardField } from '@stripe/stripe-react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import * as Clipboard from 'expo-clipboard';
import SectionDivider from '@/components/SectionDivider';
import DateHelper from '@/helpers/DateHelper';
import GlobalTheme from '@/styles/Global';

const EventCheckoutScreen: React.FC = ({ route, navigation }: any) => {
  const { event } = route.params;
  const [selectedSession, setSelectedSession] = useState(event.session[0]);
  const [sessionParticipants, setSessionParticipants] = useState<number[]>(event.session.map(() => 0));
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Paypal' | 'ETransfer'>('Stripe');

  // Paymeny method: Stripe Field Status
  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const subtotal = event.session.reduce((sum: number, sess: any, index: number) => {
    return sum + sess.price * (sessionParticipants[index] || 0);
  }, 0);
  const GST = subtotal * 0.13;
  const total = subtotal + GST;

  // Check ticket quantity
  const prepareTickets = () => {
    return event.session.map((sess: any, index: number) => ({
      sessionID: sess.sessionID,
      quantity: sessionParticipants[index] || 0,
    })).filter((ticket: { quantity: number; }) => ticket.quantity > 0);
  };

  // Checkout 
  const handleCheckout = async () => {
    // Filter: User should choose at least one ticket.
    const tickets = prepareTickets();
    if (tickets.length === 0) {
      Alert.alert('Error', 'You must purchase at least one ticket.');
      return;
    }

    // Filter: Check payment field
    if (paymentMethod === 'Stripe') {
      if (!cardName || !country || !postalCode) {
        Alert.alert('Error', 'Please fill in all Stripe payment fields.');
        return;
      }
    } else if (paymentMethod === 'Paypal') {
    }
    else if (paymentMethod === 'ETransfer') {
    }

    // Filter: Check login status
    const accountID = await AsyncStorage.getItem('uid');
    if (!accountID) {
      Alert.alert('Error', 'No account ID found. Please sign in.');
      return;
    }

    // Combine data field before submit to backend
    const payload = {
      event: { id: event.id },
      tickets, 
      accountID,
      couponCode,
      paymentMethod,
      paymentFields: paymentMethod === 'Stripe'
        ? { cardName, country, postalCode }
        : {},
      subtotal,
      GST,
      total,
    };

    // POST /eventOrder API
    try {
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, '/events/eventOrder'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Checkout successful!');
        navigation.navigate('EventThankyou', { orderID: result.orderID });
      } else {
        Alert.alert('Error', result.message || 'Checkout failed.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Checkout failed. Please try again later.');
    }

  };

  const copyAddress = async () => {
    try {
      await Clipboard.setStringAsync('studio@gmail.com');
      Alert.alert("Copied", "studio@gmail.com copied to clipboard.");
    } catch (error) {
      console.error("Error copying address: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, styles.sessionSection]}>

          {/* Ticket Options */}
          <View style={styles.sectionRow}>
            <Icon2 name="ticket-outline" size={22} color={GlobalTheme.gray2} style={styles.sectionIcon} />
            <Text style={styles.sectionLabel}>Ticket Options</Text>
          </View>

          {/* Ticket Type, Price, Date, Remain */}
          {event.session.map((sess: any, index: number) => (
            <TouchableOpacity
              key={sess.sessionID}
              style={[
                styles.sessionOption,
                selectedSession.sessionID === sess.sessionID && styles.sessionOptionSelected
              ]}
              onPress={() => setSelectedSession(sess)}
            >

              {/* Ticket Type */}
              <View style={styles.sessionRow}>
                <Text style={styles.sessionOptionTitle}>{sess.type}</Text>
              </View>

              {/* Price */}
              <View style={styles.sessionRow}>
                <Text style={styles.sessionOptionText}>$ {sess.price} CAD</Text>
              </View>

              {/* Date */}
              <View style={styles.sessionDateRow}>
                <Text style={styles.sessionOptionText}>
                  {DateHelper.formatDateWithoutYear(sess.startDate, true)}
                  {/* ~ {DateHelper.formatDateWithoutYear(sess.endDate, true)} */}
                </Text>
              </View>
              <SectionDivider />

              {/* Remain, Available */}
              <View style={styles.sessionFooterRow}>
                <Text style={styles.sessionOptionText}>
                  Remain: {sess.remain} | Available: {sess.available}
                </Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => {
                      const newCounts = [...sessionParticipants];
                      newCounts[index] = Math.max(0, newCounts[index] - 1);
                      setSessionParticipants(newCounts);
                    }}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{sessionParticipants[index]}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => {
                      const newCounts = [...sessionParticipants];
                      newCounts[index] = Math.min(sess.remain, newCounts[index] + 1);
                      setSessionParticipants(newCounts);
                    }}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coupon */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Icon3 name="discount" size={20} color={GlobalTheme.gray2} style={styles.sectionIcon} />
            <Text style={styles.sectionLabel}>Promo Code</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Promo Code"
            value={couponCode}
            onChangeText={setCouponCode}
          />
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Icon4 name="creditcard" size={20} color={GlobalTheme.gray2} style={styles.sectionIcon} />
            <Text style={styles.sectionLabel}>Payment</Text>
          </View>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'Stripe' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('Stripe')}
            >
              <Text style={styles.paymentOptionText}>Stripe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'Paypal' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('Paypal')}
            >
              <Text style={styles.paymentOptionText}>Paypal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'ETransfer' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('ETransfer')}
            >
              <Text style={styles.paymentOptionText}>E-Transfer</Text>
            </TouchableOpacity>
          </View>

          {/* Stripe Block */}
          {paymentMethod === 'Stripe' && (
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailText}>Card Info</Text>
              <TextInput
                style={styles.cardInput}
                placeholder="Name on Card"
                value={cardName}
                onChangeText={setCardName}
              />
              <TextInput
                style={styles.cardInput}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
              />
              <TextInput
                style={styles.cardInput}
                placeholder="Postal Code"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="number-pad"
              />
              <CardField
                postalCodeEnabled={false}
                placeholders={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                  backgroundColor: GlobalTheme.white,
                  textColor: GlobalTheme.black,
                  borderColor: GlobalTheme.gray1,
                  borderWidth: 1,
                  borderRadius: 4,
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                  // console.log('Card details:', cardDetails);
                }}
              />
            </View>
          )}

          {/* Paypal Block */}
          {paymentMethod === 'Paypal' && (
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailText}>Paypal Form</Text>
            </View>
          )}

          {/* ETransfer Block */}
          {paymentMethod === 'ETransfer' && (
            <View style={styles.paymentDetail}>
              <View style={styles.etransferRow}>
                <Text style={styles.etransferLabel}>EMT Email: studio@gmail.com</Text>
                <TouchableOpacity onPress={() => {
                  copyAddress()
                }} style={styles.etransferCopyButton}>
                  <Icon name="copy" size={16} color={GlobalTheme.gray2} />
                </TouchableOpacity>
              </View>
              <View style={styles.webViewContainer}>
                <WebView
                  source={{ uri: 'https://forms.gle/JKcDFsWT6kMmPD9N9' }}
                  style={styles.webView}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Price Block */}
      <View style={styles.priceContainer}>
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST</Text>
            <Text style={styles.priceValue}>${GST.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventCheckoutScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalTheme.white,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  section: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    margin: 10,
    padding: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionIcon: {
    marginRight: 6,
    marginBottom: 5,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 4,
    padding: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    marginTop: 8,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  paymentOptionSelected: {
    borderColor: GlobalTheme.primary,
    backgroundColor: GlobalTheme.white,
  },
  paymentOptionText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  paymentDetail: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 4,
    backgroundColor: GlobalTheme.background,
  },
  paymentDetailText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  etransferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  etransferLabel: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  etransferCopyButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
  },
  webViewContainer: {
    height: 300,
    marginTop: 10,
  },
  webView: {
    flex: 1,
  },
  sessionSection: {},
  sessionOption: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  sessionOptionSelected: { // Ticket Options: selected color and border
    // borderColor: GlobalTheme.black,
    // backgroundColor: GlobalTheme.primary,
  },
  sessionOptionTitle: {
    fontWeight: 'bold',
    fontSize: 19,
    color: GlobalTheme.gray4,
    marginBottom: 4,
  },
  sessionOptionText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
    marginBottom: 4,
  },
  sessionDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  sessionFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 20,
  },
  qtyButtonText: {
    fontSize: 16,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: GlobalTheme.white,
    borderTopWidth: 1,
    borderColor: GlobalTheme.gray1,
    padding: 10,
    paddingBottom: 35,
  },
  priceSummary: {},
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  checkoutButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardInput: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
});