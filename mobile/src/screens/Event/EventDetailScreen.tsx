import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRequireLogin } from '@/hooks/useRequireLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/screens/System/LoadingScreen';
import EventDetailTop from '@/components/EventDetailTop';
import EventDetailBottom from '@/components/EventDetailBottom';
import DateHelper from '@/helpers/DateHelper';
import GlobalTheme from '@/styles/Global';

interface EventDetailProps {
  route: any;
  navigation: any;
}

const EventDetailScreen: React.FC<EventDetailProps> = ({ route, navigation }) => {
  const { event } = route.params;
  const requireLogin = useRequireLogin();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    // check the favorite status
    const checkFavorite = async () => {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return;
      try {
        const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `/favorites/isFavorite?uid=${uid}&eventID=${event.id}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        const fav = data.find((item: any) => item.eventID === event.id);
        if (fav) {
          setIsFavorite(true);
          setFavoriteId(fav.id);
        } else {
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } catch (error) {
        console.error('Check favorite error:', error);
      }
    };
    checkFavorite();
  }, [event.id]);

  // Like or dislike favorite item
  const toggleFavorite = async () => {
    const uid = await AsyncStorage.getItem('uid');
    if (!uid) {
      requireLogin(handleAction)
      return;
    }
    try {
      if (!isFavorite) {
        const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, '/favorites'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountID: uid, eventID: event.id }),
        });
        const result = await response.json();
        if (response.ok) {
          setIsFavorite(true);
          setFavoriteId(result.id);
        } else {
          Alert.alert('Error', result.message || 'Failed to add favorite');
        }
      } else {
        const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `favorites/${favoriteId}`), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          setIsFavorite(false);
          setFavoriteId(null);
        } else {
          const result = await response.json();
          Alert.alert('Error', result.message || 'Failed to delete favorite');
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  // Share button
  const handleShare = async () => {
    try {
      const shareResult = await Share.share({
        title: 'Check out this event!',
        message: `Join this awesome event: ${event.name}\n\nView details here: https://studio.com/event/${event.id}`,
        url: `https://studio.com/event/${event.id}`,
      });
      if (shareResult.action === Share.sharedAction) {
        if (shareResult.activityType) {
          console.log('Shared with activity type: ', shareResult.activityType);
        } else {
          console.log('Shared');
        }
      } else if (shareResult.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  // Delete：Admin Only
  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `/events/dataEdit/${event.id}`), { method: 'DELETE' });
            if(response.ok) {
              Alert.alert("Deleted", "The event has been deleted.");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Event' }],
              });
            } else {
              const result = await response.json();
              Alert.alert("Error", result.message || "Failed to delete event");
            }
          } catch(error) {
            Alert.alert("Error", "Failed to delete event");
          }
      }}
    ]);
  };

  // Edit：Admin Only
  const handleEdit = () => {
    navigation.navigate('Accounts', {
      screen: 'EventEdit', 
      params: { event },
    });
  };

  // Header icon setting
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>

          {/* Admin Only Block */}
          {user && user.role && user.role.toLowerCase() === 'admin' && (
            <>
              {/* Delete */}
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={handleDelete}>
                  <Icon name="trash" size={20} color={GlobalTheme.danger} />
              </TouchableOpacity>

              {/* Edit */}
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={handleEdit}>
                <Icon name="edit" size={20} color={GlobalTheme.primary} />
              </TouchableOpacity>
            </>
          )}

          {/* Share */}
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={handleShare}>
            <Icon name="share-alt" size={20} color={GlobalTheme.primary} />
          </TouchableOpacity>

          {/* Favorite */}
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={toggleFavorite}>
            <Icon name={isFavorite ? "bookmark" : "bookmark-o"} size={20} color={GlobalTheme.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isFavorite, user]);

  const handleAction = () => {
    navigation.navigate('EventCheckout', { event });
  };

  // Session (Calendar)
  const [sessionCardVisible, setSessionCardVisible] = useState(false);
  const toggleSessionCard = () => setSessionCardVisible(!sessionCardVisible);

  if (loading) return <LoadingScreen/>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Information */}
        <EventDetailTop event={event} />

        {/* Event Detail */}
        <EventDetailBottom event={event}/>
      </ScrollView>

      <View style={styles.bottomBar}>
        {/* Date Button */}
        <TouchableOpacity style={styles.calendarButton} onPress={toggleSessionCard}>
          <Icon name="calendar" size={20} color={GlobalTheme.primary} />
        </TouchableOpacity>

        {/* Attend */}
        <TouchableOpacity style={styles.attendButton} onPress={() => requireLogin(handleAction)}>
          <Text style={styles.attendButtonText}>Attend</Text>
          <Icon name="arrow-right" size={20} color={GlobalTheme.white} style={styles.attendIcon} />
        </TouchableOpacity>
      </View>

      {/* The inside of calendar button: Price, Remain, StartDate, EndDate */}
      {sessionCardVisible && (
        <ScrollView
          horizontal
          style={styles.sessionCardContainer}
          contentContainerStyle={styles.sessionCardContent}
        >
          {event.session.map((sess: any, index: number) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <Icon name="star" size={14} color={GlobalTheme.gray2} style={styles.sessionIcon} />
                <Text style={styles.sessionLabel}>Type:</Text>
                <Text style={styles.sessionText}>{sess.type}</Text>
              </View>
              <View style={styles.sessionRow}>
                <Icon name="dollar" size={14} color={GlobalTheme.gray2} style={styles.sessionIcon} />
                <Text style={styles.sessionLabel}>Price:</Text>
                <Text style={styles.sessionText}>{`$ ${sess.price}`} CAD</Text>
              </View>
              <View style={styles.sessionRow}>
                <Icon name="users" size={14} color={GlobalTheme.gray2} style={styles.sessionIcon} />
                <Text style={styles.sessionLabel}>Remain:</Text>
                <Text style={styles.sessionText}>{sess.remain}</Text>
              </View>
              <View style={styles.sessionRow}>
                <Icon name="clock-o" size={14} color={GlobalTheme.gray2} style={styles.sessionIcon} />
                <Text style={styles.sessionLabel}>Start:</Text>
              </View>
              <Text style={styles.sessionTextDate}>{DateHelper.formatDate(sess.startDate, true)}</Text>
              <View style={styles.sessionRow}>
                <Icon name="clock-o" size={14} color={GlobalTheme.gray2} style={styles.sessionIcon} />
                <Text style={styles.sessionLabel}>End:</Text>
              </View>
              <Text style={styles.sessionTextDate}>{DateHelper.formatDate(sess.endDate, true)}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalTheme.white,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 4,
  },
  icon: {
    width: 16,   
    textAlign: 'center',
    marginRight: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: GlobalTheme.gray1,
    backgroundColor: GlobalTheme.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 35
  },
  calendarButton: {
    padding: 10,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10
  },
  attendButtonText: {
    color: GlobalTheme.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  attendIcon: {
    marginLeft: 6,
  },
  sessionCardContainer: {
    position: 'absolute',
    bottom: 85,
    width: '100%',
  },
  sessionCardContent: {
    paddingHorizontal: 10,
  },
  sessionCard: {
    backgroundColor: GlobalTheme.white,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    shadowColor: GlobalTheme.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    minWidth: 120,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sessionIcon: {
    marginRight: 4,
  },
  sessionLabel: {
    fontSize: 12,
    color: GlobalTheme.gray2,
    marginRight: 4,
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 12,
    color: GlobalTheme.gray4,
  },
  sessionTextDate: {
    fontSize: 12,
    color: GlobalTheme.gray4,
    marginBottom: 8,
  },
});
