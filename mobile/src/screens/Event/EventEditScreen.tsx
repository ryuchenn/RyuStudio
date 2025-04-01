import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Switch, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/FontAwesome';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/screens/System/LoadingScreen';
import tagList from 'constants/TagList';
import GlobalTheme from '@/styles/Global';
// import { SessionDetail } from 'types/SessionDetail';

interface Session {
  sessionID?: string;
  startDate: Date;
  endDate: Date;
  price: string;
  remain: string;
  available: string;
  type: 'Normal' | 'Golden';
}

interface EventData {
  id?: string;
  name: string;
  host?: string;
  session: Session[];
  location: {
    name: string;
    address: string;
  };
  notice?: Record<string, boolean>;
  tags?: string[];
  eventDetail: string;
  imagesURL?: string[];
}

interface EventEditScreenProps {
  route: any;
  navigation: any;
}

const EventEditScreen: React.FC<EventEditScreenProps> = ({ route, navigation }) => {
  const { user, isLoggedIn, loading } = useAuth();

  // If it didn't have event data -> Add Mode. Otherwise, Edit Mode.
  const editingEvent: EventData | undefined = route.params?.event;
  const isEditing = !!editingEvent;

  // Basic Info
  const [name, setName] = useState(editingEvent ? editingEvent.name : '');
  const [locationName, setLocationName] = useState(editingEvent ? editingEvent.location.name : '');
  const [locationAddress, setLocationAddress] = useState(editingEvent ? editingEvent.location.address : '');
  const [eventDetail, setEventDetail] = useState(editingEvent ? editingEvent.eventDetail : '');
  const [imagesURL, setImagesURL] = useState<string[]>(editingEvent ? editingEvent.imagesURL || [] : []);
  const [imageURLInput, setImageURLInput] = useState('');

  // Session
  const [sessions, setSessions] = useState<Session[]>(editingEvent ? editingEvent.session : []);
  const [newSession, setNewSession] = useState<Session>({
    startDate: new Date(),
    endDate: new Date(),
    price: '',
    remain: '',
    available: '',
    type: 'Normal',
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Notice
  const [notice, setNotice] = useState<Record<string, boolean>>(editingEvent ? editingEvent.notice || {
    inPerson: false,
    indoor: false,
    outdoor: false,
    online: false,
    parking: false,
  } : {
    inPerson: false,
    indoor: false,
    outdoor: false,
    online: false,
    parking: false,
  });

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>(editingEvent ? editingEvent.tags || [] : []);

  // Rich Text Editor
  const richText = useRef<RichEditor>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              navigation.navigate('Events', {
                screen: 'EventDetail',
                params: { event: route.params?.event },
              });
            } else {
              navigation.goBack();
            }
          }}
          style={{ marginLeft: 10 }}
        >
          <Icon name="arrow-left" size={20} color={GlobalTheme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  // Header Right side
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleSubmit}>
          <Text style={styles.headerButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, name, locationName, locationAddress, eventDetail, sessions, imagesURL, notice, selectedTags]);

  if (loading) return <LoadingScreen />;

  // Date Changer
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewSession({ ...newSession, startDate: selectedDate });
    }
  };
  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewSession({ ...newSession, endDate: selectedDate });
    }
  };

  // Add or Edit Session
  const addSession = () => {
    if (!newSession.price || !newSession.available || (isEditing && !newSession.remain)) {
      Alert.alert('Validation Error', 'Please fill in all required session fields.');
      return;
    }

    // Setting remain=available(Add Mode Only)
    if (!isEditing) {
      newSession.remain = newSession.available;
    }

    const sessionWithId = { ...newSession, sessionID: `sess_${Date.now()}` };
    setSessions([...sessions, sessionWithId]);

    // Clear session when session have already added
    setNewSession({
      startDate: new Date(),
      endDate: new Date(),
      price: '',
      remain: '',
      available: '',
      type: 'Normal',
    });
  };

  // Notice options toggle
  const toggleNotice = (key: string) => {
    setNotice(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Tags toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Image URL
  const addImageURL = () => {
    if (imageURLInput.trim() !== '') {
      setImagesURL([...imagesURL, imageURLInput.trim()]);
      setImageURLInput('');
    }
  };

  // ADD: add data to backend
  const handleSubmit = async () => {
    // Filter: location, address
    if (!name.trim() || !locationName.trim() || !locationAddress.trim()) {
      Alert.alert('Validation Error', 'Please fill in required basic fields.');
      return;
    }

    // Filter: each event should have at least one session
    if (sessions.length < 1) {
      Alert.alert('Validation Error', 'Please add at least one session.');
      return;
    }

    // Combine the data and fields before submitting the data to the backend
    const payload: EventData = {
      name,
      host: user?.uid,
      session: sessions,
      location: {
        name: locationName,
        address: locationAddress,
      },
      notice,
      tags: selectedTags,
      eventDetail,
      imagesURL,
    };

    // Edit -> /events/dataEdit/${editingEvent?.id} || Add -> /events/dataEdit
    try {
      const url = isEditing ? `/events/dataEdit/${editingEvent?.id}` : '/events/dataEdit';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, `${url}`), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert(isEditing ? 'Update successful' : 'Add successful');
        if (isEditing) {
          navigation.navigate('Events', {
            screen: 'EventDetail',
            params: { event: result.event },
          });
        }
        else {
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
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to save event.');
      }
    } catch (error) {
      console.error('Submit event error:', error);
      Alert.alert('Error', 'Failed to save event. Please try again later.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* Event Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter event name"
        />
      </View>

      {/* Sessions */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sessions</Text>

        {/* Sessions (Already Existed) */}
        {sessions.map((sess, idx) => (
          <View key={sess.sessionID || idx} style={styles.sessionItem}>
            <Text style={styles.sessionText}>Session {idx + 1}</Text>
            <Text style={styles.sessionText}>Type: {sess.type}</Text>
            <Text style={styles.sessionText}>Price: ${sess.price}</Text>
            <Text style={styles.sessionText}>Start: {sess.startDate.toLocaleString()}</Text>
            <Text style={styles.sessionText}>End: {sess.endDate.toLocaleString()}</Text>
            {isEditing && (
              <Text style={styles.sessionText}>Remain: {sess.remain} | Available: {sess.available}</Text>
            )}
          </View>
        ))}

        {/* Add Session Form */}
        <View style={styles.newSession}>
          <Text style={styles.label}>Add New Session</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>Start: {newSession.startDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (<DateTimePicker value={newSession.startDate} mode="datetime" display="default" onChange={onStartDateChange}/>)}
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>End: {newSession.endDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (<DateTimePicker value={newSession.endDate} mode="datetime" display="default" onChange={onEndDateChange} />)}
          <TextInput style={styles.input} placeholder="Price" value={newSession.price} onChangeText={(text) => setNewSession({ ...newSession, price: text })} keyboardType="numeric"/>
          
          {/* Remain only shows in edit mode */}
          {isEditing && (
            <TextInput
              style={styles.input}
              placeholder="Remain"
              value={newSession.remain}
              onChangeText={(text) => setNewSession({ ...newSession, remain: text })}
              keyboardType="numeric"
            />
          )}

          <TextInput style={styles.input} placeholder="Available" value={newSession.available}
            onChangeText={(text) => setNewSession({ ...newSession, available: text })} keyboardType="numeric" />
          <RNPickerSelect
            onValueChange={(value) => setNewSession({ ...newSession, type: value })}
            items={[
              { label: 'Normal', value: 'Normal' },
              { label: 'Golden', value: 'Golden' },
            ]}
            value={newSession.type} useNativeAndroidPickerStyle={false} style={pickerSelectStyles} placeholder={{}}
          />
          <TouchableOpacity style={styles.addSessionButton} onPress={addSession}>
            <Text style={styles.addSessionButtonText}>Add Session</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location Name</Text>
        <TextInput
          style={styles.input}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Enter location name"
        />
        <Text style={styles.label}>Location Address</Text>
        <TextInput
          style={styles.input}
          value={locationAddress}
          onChangeText={setLocationAddress}
          placeholder="Enter location address"
        />
      </View>

      {/* Notice */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notice Options</Text>
        {['inPerson', 'indoor', 'outdoor', 'online', 'parking'].map(key => (
          <View key={key} style={styles.noticeRow}>
            <Text style={styles.noticeLabel}>{key}</Text>
            <Switch
              value={notice[key]}
              onValueChange={() => toggleNotice(key)}
              trackColor={{ false: GlobalTheme.gray1, true: GlobalTheme.primary }}
            />
          </View>
        ))}
      </View>

      {/* Tags */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tagList.map(tag => {
            const selected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagButton, selected && styles.tagButtonSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagButtonText, selected && styles.tagButtonTextSelected]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Images URL */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Images URL</Text>
        <View style={styles.imageInputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter image URL"
            value={imageURLInput}
            onChangeText={setImageURLInput}
          />
          <TouchableOpacity style={styles.addImageButton} onPress={addImageURL}>
            <Text style={styles.addImageButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Image URL Block (Already exist) */}
        {imagesURL.map((url, index) => (
          <View key={index} style={styles.imageUrlRow}>
            <Text style={styles.imageUrlText}>{url}</Text>
            <TouchableOpacity onPress={() => {
              setImagesURL(prev => prev.filter((_, i) => i !== index));
            }}>
              <Icon name="trash" size={16} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Event Detail（Rich Text Editor） */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Event Detail</Text>
        <RichEditor
          ref={richText}
          initialContentHTML={eventDetail}
          onChange={(html) => setEventDetail(html)}
          placeholder="Enter event detail..."
          style={styles.richEditor}
        />
        <RichToolbar
          editor={richText}
          actions={['bold', 'italic', 'underline', 'heading1', 'insertBulletsList', 'insertLink']}
          iconMap={{
            bold: () => <Icon name="bold" size={20} color={GlobalTheme.black} />,
            italic: () => <Icon name="italic" size={20} color={GlobalTheme.black} />,
            underline: () => <Icon name="underline" size={20} color={GlobalTheme.black} />,
            heading1: () => <Icon name="header" size={20} color={GlobalTheme.black} />,
            insertBulletsList: () => <Icon name="list-ul" size={20} color={GlobalTheme.black} />,
            insertLink: () => <Icon name="link" size={20} color={GlobalTheme.black} />,
          }}
          style={styles.richToolbar}
        />
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalTheme.white,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  formGroup: {
    margin: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  headerButton: {
    marginRight: 10,
    padding: 10,
  },
  headerButtonText: {
    color: GlobalTheme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  richEditor: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    minHeight: 150,
  },
  richToolbar: {
    backgroundColor: GlobalTheme.background,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
  },
  newSession: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: GlobalTheme.lightGray,
  },
  dateText: {
    fontSize: 14,
    color: GlobalTheme.primary,
    marginBottom: 10,
  },
  addSessionButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  addSessionButtonText: {
    color: GlobalTheme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageButton: {
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  addImageButtonText: {
    color: GlobalTheme.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: GlobalTheme.gray1,
    paddingVertical: 5,
  },
  imageUrlText: {
    fontSize: 12,
    color: GlobalTheme.gray4,
    flex: 1,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  noticeLabel: {
    fontSize: 14,
    color: GlobalTheme.gray4,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  tagButton: {
    backgroundColor: GlobalTheme.gray0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    margin: 4,
  },
  tagButtonSelected: {
    backgroundColor: GlobalTheme.primary,
  },
  tagButtonText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  tagButtonTextSelected: {
    fontSize: 14,
    color: GlobalTheme.white,
    fontWeight: 'bold',
  },
  sessionItem: {
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: GlobalTheme.background,
  },
  sessionText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
    marginBottom: 4,
  },
});

export default EventEditScreen;
