import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Modal,
  FlatList,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '../components/SafeDateTimePicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { colors } from '../theme/colors';
import { POPULAR_COUNTRIES, INDIAN_STATES, CITIES_BY_STATE } from '../data/locationData';

const PlayerDetailsScreen = ({ route, navigation }: any) => {
  const { loginUser, setUserProfile, currentUserId, logoutUser } = useContext(AppContext);
  
  const userIdFromRoute = route?.params?.userId || currentUserId || '';
  const mobileNumberFromRoute = route?.params?.mobileNumber || '';
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  // Location States
  const [region, setRegion] = useState('India');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [liveLocation, setLiveLocation] = useState('');
  
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState(mobileNumberFromRoute);
  const [email, setEmail] = useState('');
  const [languages, setLanguages] = useState('');
  
  // Social Links
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [facebook, setFacebook] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Modals / Pickers state
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date(2000, 0, 1, 12, 0, 0));
  
  const genderOptions = ['Male', 'Female', 'Other'];

  // Instagram-style username sanitizer and validator
  const handleUsernameChange = (text: string) => {
    // 1. Force lowercase
    // 2. Remove all whitespace
    // 3. Remove characters that are NOT a-z, 0-9, period (.), or underscore (_)
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
        setUsernameError('Only lowercase (a-z), numbers (0-9), periods (.), and underscores (_) allowed.');
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

  // Fixed Date Picker handler - Uses local date components (no UTC shift)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDateOfBirth(formattedDate);
    }
  };

  const openDatePicker = () => {
    if (dateOfBirth) {
      const parts = dateOfBirth.split('-').map(Number);
      if (parts.length === 3 && parts[0] > 1900 && parts[1] >= 1 && parts[2] >= 1) {
        setDateObj(new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
      }
    }
    setShowDatePicker(true);
  };

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

  const handleSave = async () => {
    if (!firstName.trim() || !username.trim() || !mobileNumber.trim()) {
      Alert.alert('Error', 'First Name, Username, and Mobile Number are required.');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
      return;
    }

    if (!/^[a-z0-9_]+(?:\.[a-z0-9_]+)*$/.test(username)) {
      Alert.alert('Invalid Username', 'Username can only contain lowercase letters, numbers, underscores, and dots (no spaces).');
      return;
    }
    
    setLoading(true);
    const finalUserId = userIdFromRoute || mobileNumber.replace(/[^0-9]/g, '') || Date.now().toString();

    const combinedLocation = cityName 
      ? (stateName ? `${cityName}, ${stateName}` : cityName) 
      : (stateName || liveLocation || '');

    const profile = { 
      id: finalUserId, 
      username, 
      fullName: `${firstName} ${lastName}`.trim(), 
      liveLocation: combinedLocation, 
      gender, 
      dateOfBirth, 
      mobileNumber, 
      profilePicture: null, 
      email,
      region: region || 'India',
      languages,
      followers: 0,
      following: 0,
      bio: '',
      socialLinks: { youtube, instagram, discord, facebook }
    };

    try {
      try {
        await apiService.createProfile(profile);
      } catch (apiErr) {
        console.log('Profile sync notice:', apiErr);
      }
      await setUserProfile(profile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(finalUserId);
      navigation.replace('MainTabs');
    } catch (e) {
      console.log('Profile save fallback error:', e);
      navigation.replace('MainTabs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" translucent={false} />
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={20}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text style={styles.title}>Player Details</Text>
          <TouchableOpacity onPress={async () => { await logoutUser(); navigation.replace("Login"); }}>
            <Text style={{ color: "#E51025", fontWeight: "bold" }}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Complete your profile to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Enter first name" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Enter last name" placeholderTextColor="#9CA3AF" />
        </View>

        {/* Username with Instagram-style rules */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username *</Text>
          <TextInput 
            style={[styles.input, !!usernameError && styles.inputError]} 
            value={username} 
            onChangeText={handleUsernameChange} 
            placeholder="e.g. stg_warrior" 
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={usernameError ? styles.errorHelpText : styles.helperText}>
            {usernameError || 'Instagram style: lowercase, numbers, underscores (_), and dots (.) only. No spaces.'}
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput style={styles.input} value={mobileNumber} onChangeText={setMobileNumber} placeholder="Enter 10-digit mobile number" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />
        </View>

        {/* Region / Country Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country / Region</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => { setCountrySearch(''); setShowCountryModal(true); }}>
            <Text style={[styles.dropdownText, !region && { color: '#999' }]}>
              {region || 'Select Country / Region'}
            </Text>
            <Icon name="globe-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* State Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>State</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => { 
              setStateSearch(''); 
              setShowStateModal(true); 
            }}
          >
            <Text style={[styles.dropdownText, !stateName && { color: '#999' }]}>
              {stateName || (region === 'India' ? 'Select State' : 'Select State / Province')}
            </Text>
            <Icon name="map-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* City Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => { 
              if (!stateName && region === 'India') {
                Alert.alert('Select State First', 'Please select your state to see the list of cities.');
                return;
              }
              setCitySearch(''); 
              setShowCityModal(true); 
            }}
          >
            <Text style={[styles.dropdownText, !cityName && { color: '#999' }]}>
              {cityName || (stateName ? `Select City in ${stateName}` : 'Select City')}
            </Text>
            <Icon name="location-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages Known</Text>
          <TextInput style={styles.input} value={languages} onChangeText={setLanguages} placeholder="e.g. Tamil, English" placeholderTextColor="#9CA3AF" />
        </View>
        
        {/* Gender Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowGenderModal(true)}>
            <Text style={[styles.dropdownText, !gender && { color: '#999' }]}>
              {gender || 'Select Gender'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Date of Birth Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={openDatePicker}>
            <Text style={[styles.dropdownText, !dateOfBirth && { color: '#999' }]}>
              {dateOfBirth || 'YYYY-MM-DD'}
            </Text>
            <Icon name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Social Links */}
        <Text style={[styles.subtitle, { marginTop: 20, marginBottom: 10, fontWeight: 'bold' }]}>Social Links (Optional)</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>YouTube URL</Text>
          <TextInput style={styles.input} value={youtube} onChangeText={setYoutube} placeholder="https://youtube.com/..." placeholderTextColor="#9CA3AF" autoCapitalize="none" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instagram Username</Text>
          <TextInput style={styles.input} value={instagram} onChangeText={setInstagram} placeholder="@username" placeholderTextColor="#9CA3AF" autoCapitalize="none" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discord ID/Link</Text>
          <TextInput style={styles.input} value={discord} onChangeText={setDiscord} placeholder="Username#1234" placeholderTextColor="#9CA3AF" autoCapitalize="none" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Facebook URL</Text>
          <TextInput style={styles.input} value={facebook} onChangeText={setFacebook} placeholder="https://facebook.com/..." placeholderTextColor="#9CA3AF" autoCapitalize="none" />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save & Continue'}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={styles.modalOption}
                onPress={() => {
                  setGender(item);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Country Modal */}
      <Modal visible={showCountryModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Country / Region</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search country..."
              placeholderTextColor="#999"
              value={countrySearch}
              onChangeText={setCountrySearch}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOption, region === item && styles.modalOptionSelected]}
                  onPress={() => {
                    setRegion(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, region === item && styles.modalOptionTextSelected]}>
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
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setShowStateModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search state..."
              placeholderTextColor="#999"
              value={stateSearch}
              onChangeText={setStateSearch}
            />
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOption, stateName === item && styles.modalOptionSelected]}
                  onPress={() => {
                    setStateName(item);
                    setCityName(''); // Reset city when state changes
                    setShowStateModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, stateName === item && styles.modalOptionTextSelected]}>
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
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select City ({stateName || 'All'})</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search or type custom city..."
              placeholderTextColor="#999"
              value={citySearch}
              onChangeText={setCitySearch}
            />
            {citySearch.trim().length > 0 && !filteredCities.some(c => c.toLowerCase() === citySearch.trim().toLowerCase()) && (
              <TouchableOpacity
                style={styles.customAddButton}
                onPress={() => {
                  setCityName(citySearch.trim());
                  setShowCityModal(false);
                }}
              >
                <Icon name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.customAddText}>Use "{citySearch.trim()}"</Text>
              </TouchableOpacity>
            )}
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOption, cityName === item && styles.modalOptionSelected]}
                  onPress={() => {
                    setCityName(item);
                    setShowCityModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, cityName === item && styles.modalOptionTextSelected]}>
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
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#444', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, color: '#111', backgroundColor: '#F9FAFB' },
  inputError: { borderColor: '#E51025' },
  helperText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  errorHelpText: { fontSize: 12, color: '#E51025', marginTop: 4, fontWeight: '500' },
  
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdownText: { fontSize: 16, color: '#111' },
  
  saveButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '88%', backgroundColor: '#FFF', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  modalSearchInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 15, color: '#111', backgroundColor: '#F9FAFB', marginBottom: 10 },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOptionSelected: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, borderRadius: 6 },
  modalOptionText: { fontSize: 15, color: '#333' },
  modalOptionTextSelected: { color: colors.primary, fontWeight: '700' },
  customAddButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#FEE2E2', borderRadius: 8, marginBottom: 8 },
  customAddText: { color: colors.primary, fontWeight: '600', fontSize: 14 }
});

export default PlayerDetailsScreen;
