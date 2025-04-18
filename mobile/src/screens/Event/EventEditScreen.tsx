import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Switch,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Octicons';
import WebHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import useAuth from '@/hooks/useAuth';
import tagList from 'constants/TagList';
import GlobalTheme from '@/styles/Global';
import SectionDivider from '@/components/SectionDivider';

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
  const { user, loading } = useAuth();

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

  // Edit: existed session index。ADD: null session
  const [currentEditingSessionIndex, setCurrentEditingSessionIndex] = useState<number | null>(null);
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

  const [eventID, setEventID] = useState<string | undefined>(editingEvent?.id);
  
  // Type(drop down menu)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(newSession.type || 'Normal');
  const [items, setItems] = useState([
    { label: 'Normal', value: 'Normal' },
    { label: 'Golden', value: 'Golden' },
  ]);

  // useEffect(() => {
  //   if (editingEvent) {
  //     setEventID(editingEvent.id);
  //     setName(editingEvent.name);
  //     setLocationName(editingEvent.location.name);
  //     setLocationAddress(editingEvent.location.address);
  //     setEventDetail(editingEvent.eventDetail);
  //     setImagesURL(editingEvent.imagesURL || []);
  //     console.log(editingEvent.imagesURL || [])
  //     setSessions(editingEvent.session);
  //     setNotice(editingEvent.notice || {
  //       inPerson: false,
  //       indoor: false,
  //       outdoor: false,
  //       online: false,
  //       parking: false,
  //     });
  //     setSelectedTags(editingEvent.tags || []);
  //   }
  // });

  useFocusEffect(
    useCallback(() => {
      if (editingEvent) {
        setEventID(editingEvent.id);
        setName(editingEvent.name);
        setLocationName(editingEvent.location.name);
        setLocationAddress(editingEvent.location.address);
        setEventDetail(editingEvent.eventDetail);
        setImagesURL(editingEvent.imagesURL || []);
        console.log(editingEvent.imagesURL || []);
        setSessions(editingEvent.session);
        setNotice(editingEvent.notice || {
          inPerson: false,
          indoor: false,
          outdoor: false,
          online: false,
          parking: false,
        });
        setSelectedTags(editingEvent.tags || []);
      }
  
      // optional cleanup on unfocus
      return () => {
        resetFields();
      };
    }, [editingEvent, isEditing])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => {
              if (isEditing) {
                navigation.navigate('Events', {
                  screen: 'EventDetail',
                  params: { event: route.params?.event },
                });

                // navigation.popTo('Events', {
                //   screen: 'Event',
                //   params: { event: route.params?.event },
                // })
                // navigation.popToTop()
              } else {
                navigation.goBack();
              }
              console.log(editingEvent)
            }}
            style={{ marginLeft: 10 }}>
          <Icon name="chevron-left" size={20} color={GlobalTheme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  // Header Right side
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleSubmit}>
          <Text style={styles.headerButtonText}>{isEditing ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, name, locationName, locationAddress, eventDetail, sessions, imagesURL, notice, selectedTags]);
  
  const resetFields = () => {
    // Edit Mode: Recover, Add Mode: Clear 
    setName(editingEvent ? editingEvent.name : '');
    setLocationName(editingEvent ? editingEvent.location.name : '');
    setLocationAddress(editingEvent ? editingEvent.location.address : '');
    setEventDetail(editingEvent ? editingEvent.eventDetail : '');
    setImagesURL(editingEvent ? editingEvent.imagesURL || [] : []);
    setSessions(editingEvent ? editingEvent.session : []);
    setNotice(
      editingEvent
        ? editingEvent.notice || { inPerson: false, indoor: false, outdoor: false, online: false, parking: false }
        : { inPerson: false, indoor: false, outdoor: false, online: false, parking: false }
    );
    setSelectedTags(editingEvent ? editingEvent.tags || [] : []);
  };

  // Date Picker
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

  // ADD, Edit Session
  const addOrUpdateSession = () => {
    if (!newSession.price || !newSession.available || (isEditing && !newSession.remain)) {
      Alert.alert('Validation Error', 'Please fill in all required session fields.');
      return;
    }

    // ADD Mode: available amount = remain amount
    if (!isEditing) {
      newSession.remain = newSession.available;
    }

    if (currentEditingSessionIndex !== null) {
      // Update existed session
      const updatedSessions = sessions.map((sess, idx) =>
        idx === currentEditingSessionIndex ? { ...newSession, sessionID: sess.sessionID } : sess
      );
      setSessions(updatedSessions);
      setCurrentEditingSessionIndex(null);
    } else {
      // Add session
      const sessionWithId = { ...newSession, sessionID: `sess_${Date.now()}` };
      setSessions([...sessions, sessionWithId]);
    }
    
    // Clear session when session have already added
    setNewSession({
      startDate: new Date(),
      endDate: new Date(),
      price: '',
      remain: '',
      available: '',
      type: 'Normal',
    });
    setValue('Normal'); // Reset dropdown value
  };

  // When user click the session want to edit
  const editSession = (session: Session, index: number) => {
    setNewSession(session);
    setValue(session.type);
    setCurrentEditingSessionIndex(index);
  };

  // Notice Toggle
  const toggleNotice = (key: string) => {
    setNotice(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Tags Toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // URL
  const addImageURL = () => {
    if (imageURLInput.trim() !== '') {
      setImagesURL([...imagesURL, imageURLInput.trim()]);
      setImageURLInput('');
    }
  };

  // ADD or EDIT: add/edit data to backend
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
    const basePayload = {
      name,
      session: sessions,
      location: {
        name: locationName,
        address: locationAddress,
      },
      notice,
      tags: selectedTags,
      eventDetail,
      imagesURL,
      logUser: user?.uid,
    };

    const payload: EventData = isEditing
      ? basePayload
      : { ...basePayload, host: user?.uid }; // Only Insert in Add mode

    try {
      const url = isEditing ? `/events/dataEdit/${editingEvent?.id}` : '/events/dataEdit';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(WebHelper.joinUrl(Env.API_BASE_URL, url), {
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
        } else {
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
              },
            ],
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
        <View style={styles.sectionRow}>
          <Icon2 name="event" size={22} color={GlobalTheme.gray2} style={styles.sectionIcon} />
          <Text style={styles.sectionLabel}>Event Name</Text>
        </View>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter event name"
        />
      </View>
      <SectionDivider />

      {/* Sessions */}
      <View style={styles.formGroup}>
        <View style={styles.sectionRow}>
          <Icon3 name="clock" size={22} color={GlobalTheme.gray2} style={styles.sectionIcon} />
          <Text style={styles.sectionLabel}>Sessions</Text>
        </View>

        {/* Sessions (Already Existed) */}
        {sessions.map((sess, idx) => (
          <TouchableOpacity key={sess.sessionID || idx} style={styles.sessionItem} onPress={() => editSession(sess, idx)}>
            <Text style={styles.sessionText}>Session {idx + 1}</Text>
            <Text style={styles.sessionText}>Type: {sess.type}</Text>
            <Text style={styles.sessionText}>Price: ${sess.price}</Text>
            <Text style={styles.sessionText}>Start: {sess.startDate.toLocaleString()}</Text>
            <Text style={styles.sessionText}>End: {sess.endDate.toLocaleString()}</Text>
            {isEditing && (
              <Text style={styles.sessionText}>Remain: {sess.remain} | Available: {sess.available}</Text>
            )}
          </TouchableOpacity>
        ))}
        <View style={styles.newSession}>
          <Text style={styles.label}>Add New Session</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>Start: {newSession.startDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker value={newSession.startDate} mode="datetime" display="default" onChange={onStartDateChange} />
          )}
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>End: {newSession.endDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker value={newSession.endDate} mode="datetime" display="default" onChange={onEndDateChange} />
          )}
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newSession.price}
            onChangeText={(text) => setNewSession({ ...newSession, price: text })}
            keyboardType="numeric"
          />
          {isEditing && (
            <TextInput
              style={styles.input}
              placeholder="Remain"
              value={newSession.remain}
              onChangeText={(text) => setNewSession({ ...newSession, remain: text })}
              keyboardType="numeric"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Available"
            value={newSession.available}
            onChangeText={(text) => setNewSession({ ...newSession, available: text })}
            keyboardType="numeric"
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(val) => {
              setValue(val);
              setNewSession({ ...newSession, type: value });
            }}
            setItems={setItems}
            placeholder="Select session type"
            zIndex={1000}
            listMode="SCROLLVIEW"
            style={{ marginBottom: open ? 100 : 20 }}
          />
          <TouchableOpacity style={styles.addSessionButton} onPress={addOrUpdateSession}>
            <Text style={styles.addSessionButtonText}>
              {currentEditingSessionIndex !== null ? "Update Session" : "Add Session"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SectionDivider />

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
      <SectionDivider />

      {/* Notice */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notice Options</Text>
        {['inPerson', 'indoor', 'outdoor', 'online', 'parking'].map(key => (
          <View key={key} style={styles.noticeRow}>
            <Text style={styles.noticeLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
            </Text>
            <Switch
              value={notice[key]}
              onValueChange={() => toggleNotice(key)}
              trackColor={{ false: GlobalTheme.gray1, true: GlobalTheme.primary }}
            />
          </View>
        ))}
      </View>
      <SectionDivider />

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
      <SectionDivider />

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
        {imagesURL.map((url, index) => (
          <View key={index} style={styles.imageUrlRow}>
            <Text style={styles.imageUrlText}>{url}</Text>
            <TouchableOpacity onPress={() => {
              setImagesURL(prev => prev.filter((_, i) => i !== index));
            }}>
              <Icon name="trash" size={16} color={GlobalTheme.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <SectionDivider />

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
    borderColor: GlobalTheme.gray2,
    borderRadius: 4,
    color: GlobalTheme.black,
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
    color: GlobalTheme.black,
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
    marginTop: 25,
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  datePick: {
    marginBottom: 10,
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
    fontSize: 17,
    color: GlobalTheme.gray2,
    marginTop: 10,
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
    marginBottom: 10,
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
});

export default EventEditScreen;
