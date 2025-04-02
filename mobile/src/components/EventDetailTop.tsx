import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SectionDivider from '@/components/SectionDivider';
import noPicImage from '@/assets/images/NoPic.png';
import DateHelper from '@/helpers/DateHelper';
import { EventData } from 'types/EventData';
import GlobalTheme from '@/styles/Global';
import tagColors from 'constants/TagColors';
import tagList from 'constants/TagList';
interface EventDetailTopProps {
  event: EventData;
}

const EventDetailTop: React.FC<EventDetailTopProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false); // Handle invalid image error

  // Try to take first imageURL. Otherwise, use noPic.png
  const mainImage =
    !imageError && event.imagesURL && event.imagesURL.length > 0
      ? { uri: event.imagesURL[0] }
      : noPicImage;

  return (
    <View style={styles.container}>
      {/* Top image */}
      <Image
        source={mainImage}
        style={styles.image}
        onError={() => setImageError(true)}
        resizeMode="cover"
      />

      {/* Title */}
      <Text style={styles.eventName}>{event.name}</Text>

      {/* Date */}
      <View style={styles.row}>
        <Icon name="calendar" size={16} color={GlobalTheme.gray2} style={styles.icon} />
        <Text style={styles.subText}>
          {event.session && event.session.length > 0 ? DateHelper.formatDate(event.session[0].startDate) : 'N/A'}
        </Text>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Icon name="map-marker" size={16} color={GlobalTheme.gray2} style={styles.icon} />
        <Text style={styles.subText}>{event.location?.name}</Text>
      </View>

      {/* Notice */}
      <View style={styles.row}>
        {event.notice &&
          Object.entries(event.notice).map(([key, value]) => {
            if (value) {
              let iconName = "";
              switch (key) {
                case 'inPerson': iconName = 'users'; break;
                case 'indoor': iconName = 'home'; break;
                case 'outdoor': iconName = 'tree'; break;
                case 'online': iconName = 'globe'; break;
                case 'parking': iconName = 'car'; break;
                default: iconName = 'info';
              }
              return (
                <View style={styles.noticeItem} key={key}>
                  <Icon name={iconName} size={14} color={GlobalTheme.gray2} style={styles.noticeIcon} />
                  <Text style={styles.noticeText}>{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}</Text>
                </View>
              );
            }
            return null;
          })}
      </View>

      {/* Tags */}
      <View style={styles.row}>
        {event.tags.map((tag: string, index: number) => {
          const tagIndex = tagList.indexOf(tag);
          const color = tagIndex >= 0 ? tagColors[tagIndex % tagColors.length] : GlobalTheme.background;
          return (
            <View key={index} style={[styles.tag, { backgroundColor: color }]}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          );
        })}
      </View>
      <SectionDivider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalTheme.white,
  },
  image: {
    width: '100%',
    height: 240,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
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
  subText: {
    fontSize: 12,
    color: GlobalTheme.gray2,
    lineHeight: 16,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 4,
  },
  noticeIcon: {
    width: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  noticeText: {
    fontSize: 12,
    color: GlobalTheme.gray2,
    lineHeight: 16,
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

export default EventDetailTop;
