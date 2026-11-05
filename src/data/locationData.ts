export interface LocationOption {
  label: string;
  value: string;
}

export const POPULAR_COUNTRIES: string[] = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
  'Saudi Arabia',
  'Malaysia',
  'Qatar',
  'Kuwait',
  'Oman',
  'Sri Lanka',
  'Bangladesh',
  'Nepal',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'New Zealand',
  'South Africa',
  'Philippines',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Other'
];

export const INDIAN_STATES: string[] = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur',
    'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam (Ooty)', 'Hosur', 'Nagercoil',
    'Kanchipuram', 'Cuddalore', 'Kumbakonam', 'Tiruvannamalai', 'Pollachi',
    'Rajapalayam', 'Pudukkottai', 'Neyveli', 'Ambur', 'Nagapattinam', 'Namakkal',
    'Vaniyambadi', 'Theni', 'Dharmapuri', 'Villupuram', 'Ramanathapuram', 'Krishnagiri'
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi',
    'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur',
    'Bidar', 'Udupi', 'Hassan', 'Bhadravati', 'Chitradurga', 'Kolar', 'Mandya',
    'Chikkamagaluru', 'Gangavati', 'Bagalkot', 'Ranebennur', 'Karwar'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur',
    'Alappuzha', 'Kottayam', 'Palakkad', 'Manjeri', 'Malappuram', 'Thalassery',
    'Ponnani', 'Vatakara', 'Kanhangad', 'Payyanur', 'Koyilandy', 'Neyyattinkara',
    'Kayamkulam', 'Kasargod', 'Pathanamthitta', 'Idukki', 'Wayanad'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajamahendravaram',
    'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Vizianagaram',
    'Proddatur', 'Nandyal', 'Ongole', 'Adoni', 'Madanapalle', 'Machilipatnam',
    'Tenali', 'Chittoor', 'Hindupur', 'Srikakulam', 'Bhimavaram'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam',
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet',
    'Jagtial', 'Mancherial', 'Kothagudem', 'Kamareddy', 'Bodhan', 'Palwancha'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kalyan-Dombivli',
    'Vasai-Virar', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Navi Mumbai', 'Solapur',
    'Mira-Bhayandar', 'Bhiwandi', 'Amravati', 'Nanded', 'Kolhapur', 'Akola',
    'Ulhasnagar', 'Sangli', 'Malegaon', 'Jalgaon', 'Latur', 'Dhule', 'Ahmednagar',
    'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Ambarnath', 'Panvel', 'Satara'
  ],
  'Delhi': [
    'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Central Delhi', 'North West Delhi', 'North East Delhi', 'South West Delhi',
    'South East Delhi', 'Shahdara', 'Connaught Place', 'Dwarka', 'Rohini'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
    'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar',
    'Bharuch', 'Mehsana', 'Bhuj', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Prayagraj',
    'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida',
    'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Budaun', 'Rampur',
    'Shahjahanpur', 'Ayodhya', 'Farrukhabad', 'Hapur', 'Etawah', 'Mirzapur'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda',
    'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat',
    'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Darjeeling'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
    'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh', 'Baran', 'Dholpur',
    'Tonk', 'Beawar', 'Hanumangarh', 'Churu', 'Gangapur', 'Jhunjhunu', 'Barmer'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
    'Ratlam', 'Rewa', 'Murwara (Katni)', 'Singrauli', 'Burhanpur', 'Khandwa',
    'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
    'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah', 'Saharsa'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)',
    'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara'
  ],
  'Haryana': [
    'Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar',
    'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore',
    'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Rayagada', 'Bolangir'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
    'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Cuncolim'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Kullu', 'Manali'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Durg', 'Jagdalpur', 'Ambikapur'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore'
  ],
  'Ladakh': [
    'Leh', 'Kargil'
  ],
  'Tripura': [
    'Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Jowai', 'Nongpoh'
  ],
  'Manipur': [
    'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Champhai', 'Serchhip'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Gyalshing', 'Mangan'
  ],
  'Andaman and Nicobar Islands': [
    'Port Blair'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Daman', 'Diu', 'Silvassa'
  ],
  'Lakshadweep': [
    'Kavaratti', 'Agatti', 'Andrott'
  ]
};
