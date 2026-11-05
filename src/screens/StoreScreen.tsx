import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface ProductItem {
  id: string;
  category: 'jerseys' | 'coolers' | 'sleeves' | 'fans' | 'accessories';
  title: string;
  badge: string;
  badgeColor: string;
  image: string;
  icon: string;
  description: string;
  features: string[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: '1',
    category: 'jerseys',
    title: 'Pro Tournament Esports Jersey',
    badge: 'CUSTOMIZABLE',
    badgeColor: '#E51025',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    icon: 'shirt-outline',
    description: 'Custom sublimated BGMI team jerseys with your gamer tag & squad logo.',
    features: ['Custom Gamertag & Squad Logo', 'Breathable Dry-Fit Fabric', 'Anti-Fade HD Sublimation Print'],
  },
  {
    id: '2',
    category: 'coolers',
    title: 'Magnetic RGB Phone Air Cooler',
    badge: 'ANTI-LAG • 90 FPS',
    badgeColor: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    icon: 'snow-outline',
    description: 'Semiconductor Peltier cooling fan to eliminate thermal throttling in scrims.',
    features: ['Instant Sub-Zero Cooling', 'RGB Ambient Esports Lighting', 'Silent 7500 RPM Turbo Fan'],
  },
  {
    id: '3',
    category: 'sleeves',
    title: 'Sweatproof Carbon Hand Sleeves',
    badge: 'ZERO FRICTION',
    badgeColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    icon: 'hand-left-outline',
    description: 'Ultra-thin silver fiber finger & palm sleeves for surgical recoil control.',
    features: ['24-Needle Silver Fiber', '100% Sweat & Moisture Proof', 'Seamless High-Touch Sensitivity'],
  },
  {
    id: '4',
    category: 'fans',
    title: 'Turbo Handheld Gaming Fan',
    badge: 'ANTI-SWEAT PALM',
    badgeColor: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    icon: 'airplane-outline',
    description: 'High-speed portable hand cooling fan for intense 1v4 competitive clutches.',
    features: ['Powerful 3-Speed Airflow', 'Type-C Rechargeable Battery', 'Ergonomic Palm Cooling Grip'],
  },
  {
    id: '5',
    category: 'accessories',
    title: 'Mechanical 4-Finger Gaming Triggers',
    badge: 'ZERO LATENCY',
    badgeColor: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
    icon: 'game-controller-outline',
    description: 'Physical zinc-alloy micro switches for rapid burst firing and crouch-jump.',
    features: ['Mechanical Click Switches', 'Case-Friendly Silicone Pads', 'Zero Screen Delay'],
  },
  {
    id: '6',
    category: 'accessories',
    title: 'Esports Gaming Earphones with Mic',
    badge: 'FOOTSTEP AUDIO',
    badgeColor: '#EC4899',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    icon: 'headset-outline',
    description: 'Custom tuned 3D spatial sound drivers to accurately pinpoint enemy footsteps.',
    features: ['Enhanced Footstep Audio EQ', 'Detachable Noise-Cancelling Mic', 'L-Shape 3.5mm Jack'],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Items' },
  { key: 'jerseys', label: 'Jerseys' },
  { key: 'coolers', label: 'Phone Coolers' },
  { key: 'sleeves', label: 'Hand Sleeves' },
  { key: 'fans', label: 'Hand Fans' },
  { key: 'accessories', label: 'Gear & Gadgets' },
];

export const StoreScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleInstagramPress = async () => {
    const instagramAppUrl = 'instagram://user?username=upmi.official';
    const instagramWebUrl = 'https://www.instagram.com/upmi.official';
    try {
      const supported = await Linking.canOpenURL(instagramAppUrl);
      if (supported) {
        await Linking.openURL(instagramAppUrl);
      } else {
        await Linking.openURL(instagramWebUrl);
      }
    } catch {
      await Linking.openURL(instagramWebUrl).catch(() => {
        Alert.alert('Instagram Contact', 'Reach us directly on Instagram: @upmi.official');
      });
    }
  };

  const handleEmailPress = async () => {
    const emailUrl = 'mailto:contact@upmii.in?subject=UPMI%20Store%20Product%20Publishing%20Inquiry';
    try {
      await Linking.openURL(emailUrl);
    } catch {
      Alert.alert('Email Contact', 'Send your inquiry to: contact@upmii.in');
    }
  };

  const handleCallPress = async (phoneNumber: string) => {
    const telUrl = `tel:${phoneNumber}`;
    try {
      await Linking.openURL(telUrl);
    } catch {
      Alert.alert('Contact Number', `Reach us at: ${phoneNumber}`);
    }
  };

  const handleProductInquiry = (product: ProductItem) => {
    Alert.alert(
      `Publish ${product.title}`,
      `Want to list or publish your ${product.title} on UPMI Store?\n\nConnect with our official team to get featured:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'DM on Instagram (@upmi.official)', onPress: handleInstagramPress },
        { text: 'Send Email (contact@upmii.in)', onPress: handleEmailPress },
      ]
    );
  };

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D14" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>UPMI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>ESPORTS STORE</Text>
            <Text style={styles.headerSub}>Gaming Gadgets, Merch & Brand Showcase</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.instaHeaderBtn} onPress={handleInstagramPress}>
          <Icon name="logo-instagram" size={18} color="#FFF" />
          <Text style={styles.instaHeaderBtnText}>@upmi.official</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── SELLER & BRAND PUBLISHING HERO CARD ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.heroBadgeText}>OFFICIAL PARTNER & SELLER PROGRAM</Text>
          </View>

          <Text style={styles.heroTitle}>
            PUBLISH YOUR GAMING MERCH & GADGETS HERE!
          </Text>

          <Text style={styles.heroDesc}>
            Are you a jersey manufacturer, gaming gear brand, or accessory seller? You can publish & showcase your BGMI team jerseys, phone coolers, hand sleeves, and turbo fans directly to thousands of active competitive gamers!
          </Text>

          {/* Action Buttons Row */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.heroInstaBtn}
              activeOpacity={0.88}
              onPress={handleInstagramPress}
            >
              <Icon name="logo-instagram" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.heroBtnTopText}>DM ON INSTAGRAM</Text>
                <Text style={styles.heroBtnBottomText}>@upmi.official</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroEmailBtn}
              activeOpacity={0.88}
              onPress={handleEmailPress}
            >
              <Icon name="mail-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.heroBtnTopText}>OFFICIAL EMAIL</Text>
                <Text style={styles.heroBtnBottomText}>contact@upmii.in</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contact Hotline */}
          <View style={styles.hotlineBar}>
            <Icon name="call-outline" size={15} color="#F87171" style={{ marginRight: 6 }} />
            <Text style={styles.hotlineText}>
              Direct Hotline:{' '}
              <Text style={styles.hotlineNum} onPress={() => handleCallPress('9585716229')}>9585716229</Text>
              {'  '}&{'  '}
              <Text style={styles.hotlineNum} onPress={() => handleCallPress('8056983309')}>8056983309</Text>
            </Text>
          </View>
        </View>

        {/* ── CATEGORY FILTER CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SECTION TITLE ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>BGMI GAMING ESSENTIALS</Text>
            <Text style={styles.sectionSub}>Featured gear ready to be published & promoted</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Icon name="checkmark-circle" size={14} color="#10B981" style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        {/* ── PRODUCTS GRID ── */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.productCard}>
              {/* Product Image Box */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={[styles.productBadge, { backgroundColor: product.badgeColor }]}>
                  <Text style={styles.productBadgeText}>{product.badge}</Text>
                </View>
              </View>

              {/* Details */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Icon name={product.icon} size={18} color={product.badgeColor} style={{ marginRight: 6 }} />
                  <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                </View>

                <Text style={styles.productDesc} numberOfLines={2}>
                  {product.description}
                </Text>

                {/* Features List */}
                <View style={styles.featuresList}>
                  {product.features.map((feat, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Icon name="flash" size={11} color="#E51025" style={{ marginRight: 4 }} />
                      <Text style={styles.featureText} numberOfLines={1}>{feat}</Text>
                    </View>
                  ))}
                </View>

                {/* Publish Action Button */}
                <TouchableOpacity
                  style={styles.publishBtn}
                  activeOpacity={0.85}
                  onPress={() => handleProductInquiry(product)}
                >
                  <Icon name="megaphone-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.publishBtnText}>Publish in UPMI Store</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ── HOW TO PUBLISH BANNER ── */}
        <View style={styles.howToPublishCard}>
          <Text style={styles.howToTitle}>HOW TO LIST YOUR PRODUCTS</Text>
          <Text style={styles.howToSub}>Get your BGMI gadgets, jerseys & accessories live in 3 steps:</Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>1</Text></View>
              <Text style={styles.stepText}>Prepare photos & specs of your jerseys, coolers or fans.</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>2</Text></View>
              <Text style={styles.stepText}>DM us on Instagram <Text style={styles.boldRed}>@upmi.official</Text> or email <Text style={styles.boldRed}>contact@upmii.in</Text>.</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepNum}>3</Text></View>
              <Text style={styles.stepText}>Get verified and sell directly to competitive esports players!</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.contactUsBigBtn} onPress={handleInstagramPress}>
            <Icon name="logo-instagram" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.contactUsBigBtnText}>Send DM to @upmi.official Now</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Guarantee */}
        <View style={styles.footerNote}>
          <Icon name="shield-checkmark" size={16} color="#10B981" style={{ marginRight: 8 }} />
          <Text style={styles.footerNoteText}>UPMI Official Esports Partner & Creator Network</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0D14',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1A202E',
    backgroundColor: '#0B0D14',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    backgroundColor: '#E51025',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 1,
  },
  instaHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1306C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  instaHeaderBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0B0D14',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Hero Card
  heroCard: {
    backgroundColor: '#131826',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E51025',
    marginBottom: 20,
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 16, 37, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E51025',
    marginRight: 6,
  },
  heroBadgeText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 27,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 19,
    marginBottom: 16,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  heroInstaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1306C',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  heroEmailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  heroBtnTopText: {
    color: '#E5E7EB',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroBtnBottomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hotlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262D40',
  },
  hotlineText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
  },
  hotlineNum: {
    color: '#F87171',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // Category Chips
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 10,
  },
  categoryChip: {
    backgroundColor: '#161B28',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#262D40',
  },
  categoryChipActive: {
    backgroundColor: '#E51025',
    borderColor: '#E51025',
  },
  categoryChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionSub: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  // Products Grid
  productsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  productCard: {
    backgroundColor: '#121622',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#22293A',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#181E2E',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  productDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresList: {
    backgroundColor: '#181E2C',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E51025',
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  // How to publish
  howToPublishCard: {
    backgroundColor: '#161B28',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262D40',
    marginBottom: 20,
  },
  howToTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  howToSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 14,
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E51025',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNum: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepText: {
    color: '#D1D5DB',
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  boldRed: {
    color: '#F87171',
    fontWeight: 'bold',
  },
  contactUsBigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1306C',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactUsBigBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131826',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22293A',
  },
  footerNoteText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
});
