import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import noPicImage from '@/assets/images/NoPic.png';
import GlobalTheme from '@/styles/Global';

interface HostProfile {
  displayName: string;
  phoneNumber: string;
  pictureURL: string;
}

interface HostBlockProps {
  hostIds: string | string[];
}

const HostBlock: React.FC<HostBlockProps> = ({ hostIds }) => {
  const [hostData, setHostData] = useState<HostProfile[]>([]);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        // If hostIds is a string, convert it to an array. Also, it only take the first three records
        const ids = (typeof hostIds === 'string' ? [hostIds] : hostIds || []).slice(0, 3);
        
        const profiles = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `/auth/hostProfile/${id}`));
            const data = await response.json();
            const profile = Array.isArray(data) ? data[0] : data;
            return profile;
          })
        );
        
        const validProfiles = profiles.filter((p) => p); // Delete the result is undefined
        setHostData(validProfiles);
      } catch (error) {
        console.error('Error fetching host data:', error);
      }
    };
  
    if (hostIds) {
      fetchHostData();
    }
  }, [hostIds]);
  

  return (
    <View style={styles.hostContainer}>
      <Text style={styles.sectionTitle}>Host</Text>

      {/* Picture URL */}
      <View style={styles.hostList}>
        {hostData.map((host, index) => (
          <View key={index} style={styles.hostItem}>
            <Image
              source={host.pictureURL ? { uri: host.pictureURL } : noPicImage}
              style={styles.hostImage}
              onError={() => {}}
            />
            <Text style={styles.hostName}>{host.displayName ? host.displayName : "Unknown"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hostContainer: {
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  hostList: {
    flexDirection: 'row',
    marginLeft: 10
  },
  hostItem: {
    alignItems: 'center',
    marginTop: 10,
    marginRight: 20,
  },
  hostImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: 4,
  },
  hostName: {
    fontSize: 12,
    color: GlobalTheme.gray4,
  },
});

export default HostBlock;
