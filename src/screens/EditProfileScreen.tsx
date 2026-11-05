import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput, ScrollView, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageZoomCropModal from '../components/ImageZoomCropModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '../components/SafeDateTimePicker';
import { Platform, Modal } from 'react-native';
import { POPULAR_COUNTRIES, INDIAN_STATES, CITIES_BY_STATE } from '../data/locationData';
import { colors } from '../theme/colors';

const EditProfileScreen = ({ navigation }: any) => {
  const { userProfile, updateUserProfile } = useContext(AppContext);

  if (!userProfile) return null;

  const nameParts = (userProfile?.fullName || '').split(' ');

  const [profilePic, setProfilePic] = useState(userProfile.profilePicture || '');
  const [tempProfilePic, setTempProfilePic] = useState<string | null>(null);
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [username, setUsername] = useState(userProfile.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [bio, setBio] = useState(userProfile.bio || '');
  
  const [dob, setDob] = useState(userProfile.dateOfBirth || '');
  const [gender, setGender] = useState(userProfile.gender || '');
  
  // Location States
  const [region, setRegion] = useState(userProfile.region || 'India');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState(userProfile.liveLocation || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(() => {
    if (userProfile.dateOfBirth) {
      const parts = userProfile.dateOfBirth.split('-').map(Number);
      if (parts.length === 3 && parts[0] > 1900 && parts[1] >= 1 && parts[2] >= 1) {
        return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      }
    }
    return new Date(2000, 0, 1, 12, 0, 0);
  });

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const genderOptions = ['Male', 'Female', 'Other'];

  // Instagram-style username sanitizer and validator
  const handleUsernameChange = (text: string) => {
    const sanitized = text
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9._]/g, '');

    setUsername(sanitized);

    if (text !== sanitized) {
      if (/\s/.test(text)) {
        setUsernameError('Spaces are not allowed in username.');
      } else if (/[A-Z]/.test(text)) {
        setUsernameError('Uppercase converted to lowercase.');
      } else {
        setUsernameError('Only lowercase, numbers, underscores (_), and dots (.) allowed.');
      }
    } else if (sanitized.length > 0 && sanitized.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else if (sanitized.startsWith('.') || sanitized.endsWith('.')) {
      setUsernameError('Username cannot start or end with a period.');
    } else if (sanitized.includes('..')) {
      setUsernameError('Username cannot contain consecutive periods (..).');
    } else {
      setUsernameError('');
    }
  };

  // Safe local date formatting (eliminating timezone 1-day backward shift)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDob(formattedDate);
    }
  };

  const openDatePicker = () => {
    if (dob) {
      const parts = dob.split('-').map(Number);
      if (parts.length === 3 && parts[0] > 1900 && parts[1] >= 1 && parts[2] >= 1) {
        setDateObj(new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
      }
    }
    setShowDatePicker(true);
  };

  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.mobileNumber || '');
  const [languages, setLanguages] = useState(userProfile.languages || '');
  
  const [yt, setYt] = useState(userProfile.socialLinks?.youtube || '');
  const [insta, setInsta] = useState(userProfile.socialLinks?.instagram || '');
  const [discord, setDiscord] = useState(userProfile.socialLinks?.discord || '');
  const [fb, setFb] = useState(userProfile.socialLinks?.facebook || '');

  const filteredCountries = POPULAR_COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredStates = INDIAN_STATES.filter(s => 
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const availableCities = stateName && CITIES_BY_STATE[stateName] 
    ? CITIES_BY_STATE[stateName] 
    : [];

  const filteredCities = availableCities.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleChangePhoto = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setTempProfilePic(result.assets[0].uri);
        setIsCropModalVisible(true);
      }
    } catch (e) {
      console.log('Error selecting photo:', e);
    }
  };

  const handleSave = async () => {
    if (username.length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
      return;
    }

    if (!/^[a-z0-9_]+(?:\.[a-z0-9_]+)*$/.test(username)) {
      Alert.alert('Invalid Username', 'Username can only contain lowercase letters, numbers, underscores, and dots (no spaces).');
      return;
    }

    const combinedLocation = cityName 
      ? (stateName ? `${cityName}, ${stateName}` : cityName) 
      : (stateName || userProfile.liveLocation || '');

    await updateUserProfile({
      profilePicture: profilePic,
      fullName: `${firstName} ${lastName}`.trim(),
      username,
      bio,
      dateOfBirth: dob,
      gender,
      email,
      mobileNumber: phone,
      region: region || 'India',
      liveLocation: combinedLocation,
      languages,
      socialLinks: {
        youtube: yt,
        instagram: insta,
        discord: discord,
        facebook: fb
      }
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Icon name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={{ padding: 10 }}>
          <Icon name="checkmark" size={28} color="#10B981" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }} enableOnAndroid={true} extraScrollHeight={20}>
        <View style={styles.photoSection}>
          <Image 
            source={{ uri: profilePic || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleChangePhoto}>
              <Text style={styles.uploadBtnText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setProfilePic('')}>
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Basic Info</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="#666" />
        </View>
        
        {/* Username with Instagram-style rules */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={[styles.input, !!usernameError && { borderBottomColor: '#E51025' }]} 
            value={username} 
            onChangeText={handleUsernameChange} 
            placeholder="Username" 
            placeholderTextColor="#666" 
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={{ fontSize: 11, color: usernameError ? '#E51025' : '#888', marginTop: 4 }}>
            {usernameError || 'Instagram style: lowercase, numbers, underscores (_), and dots (.) only. No spaces.'}
          </Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Tell us about yourself..." placeholderTextColor="#666" multiline />
        </View>

        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={{ color: gender ? '#FFF' : '#666' }}>{gender || 'Select Gender'}</Text>
          </TouchableOpacity>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={openDatePicker}
          >
            <Text style={{ color: dob ? '#FFF' : '#666' }}>{dob || 'YYYY-MM-DD'}</Text>
          </TouchableOpacity>
        </View>

        <ImageZoomCropModal
        visible={isCropModalVisible}
        imageUri={tempProfilePic}
        cropShape="circle"
        title="Adjust & Crop Profile Photo"
        onApply={(croppedUri) => {
          setProfilePic(croppedUri);
          setIsCropModalVisible(false);
          setTempProfilePic(null);
        }}
        onCancel={() => {
          setIsCropModalVisible(false);
          setTempProfilePic(null);
        }}
      />

      {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor="#666" keyboardType="email-address" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Mobile Number" placeholderTextColor="#666" keyboardType="phone-pad" />
        </View>

        {/* Region / Country */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country / Region</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => { setCountrySearch(''); setShowCountryModal(true); }}
          >
            <Text style={{ color: region ? '#FFF' : '#666' }}>{region || 'Select Country / Region'}</Text>
          </TouchableOpacity>
        </View>

        {/* State */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>State</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => { setStateSearch(''); setShowStateModal(true); }}
          >
            <Text style={{ color: stateName ? '#FFF' : '#666' }}>
              {stateName || (region === 'India' ? 'Select State' : 'Select State / Province')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => {
              if (!stateName && region === 'India') {
                Alert.alert('Select State First', 'Please select your state to see the list of cities.');
                return;
              }
              setCitySearch('');
              setShowCityModal(true);
            }}
          >
            <Text style={{ color: cityName ? '#FFF' : '#666' }}>
              {cityName || (stateName ? `Select City in ${stateName}` : 'Select City')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages Known</Text>
          <TextInput style={styles.input} value={languages} onChangeText={setLanguages} placeholder="Languages (e.g. Tamil, English)" placeholderTextColor="#666" />
        </View>

        <Text style={styles.sectionTitle}>Social Links</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>YouTube Link</Text>
          <TextInput style={styles.input} value={yt} onChangeText={setYt} placeholder="YouTube URL" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instagram Link</Text>
          <TextInput style={styles.input} value={insta} onChangeText={setInsta} placeholder="Instagram Handle" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discord ID</Text>
          <TextInput style={styles.input} value={discord} onChangeText={setDiscord} placeholder="Discord Tag" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Facebook Link</Text>
          <TextInput style={styles.input} value={fb} onChangeText={setFb} placeholder="Facebook URL" placeholderTextColor="#666" />
        </View>
      </KeyboardAwareScrollView>
    
      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent={true} animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowGenderModal(false)}>
          <View style={{ width: '80%', backgroundColor: '#222', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#FFF' }}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#444' }}
                onPress={() => {
                  setGender(item);
                  setShowGenderModal(false);
                }}
              >
                <Text style={{ fontSize: 16, color: '#FFF' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Country Modal */}
      <Modal visible={showCountryModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentDark, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitleDark}>Select Country / Region</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInputDark}
              placeholder="Search country..."
              placeholderTextColor="#888"
              value={countrySearch}
              onChangeText={setCountrySearch}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOptionDark, region === item && styles.modalOptionSelectedDark]}
                  onPress={() => {
                    setRegion(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionTextDark, region === item && { color: colors.primary, fontWeight: 'bold' }]}>
                    {item}
                  </Text>
                  {region === item && <Icon name="checkmark" size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* State Modal */}
      <Modal visible={showStateModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentDark, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitleDark}>Select State</Text>
              <TouchableOpacity onPress={() => setShowStateModal(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInputDark}
              placeholder="Search state..."
              placeholderTextColor="#888"
              value={stateSearch}
              onChangeText={setStateSearch}
            />
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOptionDark, stateName === item && styles.modalOptionSelectedDark]}
                  onPress={() => {
                    setStateName(item);
                    setCityName('');
                    setShowStateModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionTextDark, stateName === item && { color: colors.primary, fontWeight: 'bold' }]}>
                    {item}
                  </Text>
                  {stateName === item && <Icon name="checkmark" size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentDark, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitleDark}>Select City ({stateName || 'All'})</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInputDark}
              placeholder="Search or type custom city..."
              placeholderTextColor="#888"
              value={citySearch}
              onChangeText={setCitySearch}
            />
            {citySearch.trim().length > 0 && !filteredCities.some(c => c.toLowerCase() === citySearch.trim().toLowerCase()) && (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#331111', borderRadius: 8, marginBottom: 8 }}
                onPress={() => {
                  setCityName(citySearch.trim());
                  setShowCityModal(false);
                }}
              >
                <Icon name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Use "{citySearch.trim()}"</Text>
              </TouchableOpacity>
            )}
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOptionDark, cityName === item && styles.modalOptionSelectedDark]}
                  onPress={() => {
                    setCityName(item);
                    setShowCityModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionTextDark, cityName === item && { color: colors.primary, fontWeight: 'bold' }]}>
                    {item}
                  </Text>
                  {cityName === item && <Icon name="checkmark" size={18} color={colors.primary} />}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#888', fontSize: 14 }}>
                    {citySearch.trim() ? 'No predefined city found. Tap above to use custom city.' : 'No cities listed for this state.'}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  content: { flex: 1, paddingHorizontal: 20 },
  photoSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', borderWidth: 2, borderColor: '#444' },
  uploadBtn: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  uploadBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  deleteBtnText: { color: '#E51025', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#888', fontSize: 14, fontWeight: 'bold', marginBottom: 15, marginTop: 10, textTransform: 'uppercase' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#CCC', fontSize: 13, marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#333', color: '#FFF', fontSize: 16, paddingVertical: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContentDark: { width: '88%', backgroundColor: '#1A1A1A', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#333' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitleDark: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  modalSearchInputDark: { borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 15, color: '#FFF', backgroundColor: '#252525', marginBottom: 10 },
  modalOptionDark: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2B2B2B', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOptionSelectedDark: { backgroundColor: '#331515', paddingHorizontal: 8, borderRadius: 6 },
  modalOptionTextDark: { fontSize: 15, color: '#DDD' },
});

export default EditProfileScreen;
