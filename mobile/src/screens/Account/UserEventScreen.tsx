import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchAndEventCard from '@/components/SearchAndEventCard';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/screens/System/LoadingScreen';
import RequireLoginScreen from '@/screens/System/RequireLoginScreen';

const UserEventScreen: React.FC = ({ navigation }: any) => {
  const [accountID, setAccountID] = useState<string | null>(null);
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    const fetchAccountID = async () => {
      const uid = await AsyncStorage.getItem('uid');
      setAccountID(uid);
    };
    fetchAccountID();
  }, []);

  if (!isLoggedIn) return <RequireLoginScreen />;
  if (loading) return <LoadingScreen/>;

  return <SearchAndEventCard page="UserEvent" apiUrl={`/events/eventOrder/${accountID}`} navigation={navigation}/>;
};

export default UserEventScreen;
