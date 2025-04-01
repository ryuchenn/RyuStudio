import React from 'react';
import SearchAndEventCard from '@/components/SearchAndEventCard';

const EventScreen: React.FC = ({ navigation }: any) => {
  return <SearchAndEventCard page="Event" apiUrl="/events" navigation={navigation}/>;
};

export default EventScreen;