import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import noPic from '@/assets/images/NoPic.png';
import DateHelper from '@/helpers/DateHelper';
import GlobalTheme from '@/styles/Global';

interface EventCardProps {
  event: any;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const [imageError, setImageError] = useState(false); // Handle invalid image error

  // Try to take first imageURL. Otherwise, use noPic.png
  let mainImage: ImageSourcePropType = noPic;
  if (!imageError && event.imagesURL && event.imagesURL.length > 0) {
    mainImage = { uri: event.imagesURL[0] };
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image：Display NoPic when no image or error*/}
      <Image
        source={mainImage}
        style={styles.image}
        onError={() => setImageError(true)}
      />

      {/* Title */}
      <Text style={styles.name}>{event.name}</Text>

      {/* Date */}
      <View style={styles.row}>
        <Icon name="calendar" size={14} color={GlobalTheme.gray2} style={styles.icon} />
        <Text style={styles.subText}>{DateHelper.formatDate(event.session[0].startDate)}</Text>
      </View>

      {/* Location: studio name */}
      <View style={styles.row}>
        <Icon name="map-marker" size={14} color={GlobalTheme.gray2} style={styles.icon} />
        <Text style={styles.subText}>{event.location.name}</Text>
      </View>

      {/* Available member */}
      <View style={styles.row}>
        <Icon name="users" size={14} color={GlobalTheme.gray2} style={styles.icon} />
        <Text style={styles.subText}>{`Available: ${event.session[0].remain}`}</Text>
      </View>

      {/* Tags */}
      <View style={styles.tagContainer}>
        {event.tags.map((tag: string, index: number) => (
          <View style={styles.tag} key={index}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: GlobalTheme.white,
    borderRadius: 8,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    shadowColor: GlobalTheme.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  subText: {
    fontSize: 12,
    color: GlobalTheme.gray3,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    backgroundColor: GlobalTheme.gray0,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: GlobalTheme.gray3,
  },
});

export default EventCard;
