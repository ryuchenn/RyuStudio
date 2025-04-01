import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import MapView, { Marker } from 'react-native-maps';
import SectionDivider from '@/components/SectionDivider';
import noPicImage from '@/assets/images/NoPic.png';
import HostBlock from '@/components/HostBlock';
import { EventDataEdit } from 'types/EventDataEdit';
import GlobalTheme from '@/styles/Global';
const { width: screenWidth } = Dimensions.get('window');

interface EventDetailBottomProps {
  event: EventDataEdit;
}

const EventDetailBottom: React.FC<EventDetailBottomProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false); // Handle invalid image error

  // Try to take first imageURL. Otherwise, use noPic.png
  const mainImage =
    !imageError && event.imagesURL && event.imagesURL.length > 0
      ? { uri: event.imagesURL[0] }
      : noPicImage;

  // Overview Controller
  const [showOverview, setShowOverview] = useState(false);
  const toggleOverview = () => setShowOverview(!showOverview);

  // Gallery
  const galleryImages = event.imagesURL && event.imagesURL.length > 0 ? event.imagesURL : [null];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    setGalleryIndex(newIndex);
  };

  // Clipboard (Address)
  const copyAddress = async () => {
    try {
      await Clipboard.setStringAsync(event.location.address);
      Alert.alert("Copied", "Address copied to clipboard.");
    } catch (error) {
      console.error("Error copying address: ", error);
    }
  };

  return (
    <View style={styles.container}>

      {/* Overview */}
      <Text style={styles.overviewTitle}>Overview</Text>
      {!showOverview ? (
        <TouchableOpacity onPress={toggleOverview} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.detailContainer}>
            <WebView
              style={{ width: '100%', height: 400 }}
              originWhitelist={['*']}
              source={{
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </head>
                    <body>
                      ${event.eventDetail}
                    </body>
                  </html>
                `,
              }}
            />
          </View>
          <TouchableOpacity onPress={toggleOverview} style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read less</Text>
          </TouchableOpacity>
        </>
      )}
      <SectionDivider />

      {/* Gallery */}
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Gallery</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          ref={scrollRef}
        >
          {galleryImages.map((img: string | null, index: number) => (
            <Image
              key={index}
              source={img ? { uri: img } : noPicImage}
              onError={() => setImageError(true)}
              style={styles.galleryImage}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
        <View style={styles.galleryNavigation}>
          {galleryImages.map((img: string | null, idx: number) => (
            <View
              key={idx}
              style={[
                styles.dot,
                galleryIndex === idx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
      <SectionDivider />

      {/* Host */}
      <View style={styles.hostContainer}>
        <HostBlock hostIds={event.host} />
      </View>
      <SectionDivider />

      {/* Location */}
      <View style={styles.mapContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.row}>
          <Icon name="map-marker" size={16} color={GlobalTheme.gray2} style={styles.icon} />
          <Text style={styles.subText}>{event.location.name}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="location-arrow" size={16} color={GlobalTheme.gray2} style={styles.icon} />
          <Text style={styles.subText}>{event.location.address}</Text>
          <TouchableOpacity onPress={copyAddress} style={styles.copyButton}>
            <Icon name="copy" size={16} color={GlobalTheme.gray3} />
          </TouchableOpacity>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: event.location.latitude || 43.6532,
            longitude: event.location.longitude || -79.3832,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: event.location.latitude || 43.6532,
              longitude: event.location.longitude || -79.3832,
            }}
            title={event.location.name}
            description={event.location.address}
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalTheme.white,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 6,
    color: GlobalTheme.gray4,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  readMoreText: {
    fontSize: 14,
    color: GlobalTheme.primary,
    fontWeight: 'bold',
  },
  detailContainer: {
    margin: 10,
  },
  galleryContainer: {
    marginVertical: 10,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 6,
  },
  galleryImage: {
    width: screenWidth,
    height: 200,
  },
  galleryNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: GlobalTheme.primary,
  },
  dotInactive: {
    backgroundColor: GlobalTheme.gray1,
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
    color: '#888',
    lineHeight: 16,
  },
  hostContainer: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  hostList: {
    flexDirection: 'row',
  },
  hostItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  hostName: {
    fontSize: 12,
    color: '#333',
  },
  mapContainer: {
    margin: 10,
  },
  map: {
    height: 200,
    borderRadius: 8,
  },
  copyButton: {
    marginLeft: 8,
  },
});

export default EventDetailBottom;

