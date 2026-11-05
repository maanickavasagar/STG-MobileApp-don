import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TERMS_OF_SERVICE, PRIVACY_POLICY, LegalDocument } from '../data/legalData';

const PolicyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { title } = route.params || { title: 'Privacy Policy' };

  const isPrivacy = title === 'Privacy Policy';
  const isTerms = title === 'Terms of Service';

  const doc: LegalDocument | null = isPrivacy
    ? PRIVACY_POLICY
    : isTerms
    ? TERMS_OF_SERVICE
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {doc ? (
          <>
            {/* Document Header Card */}
            <View style={styles.docHeaderCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Icon name="shield-checkmark" size={13} color="#2563EB" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>Official Legal Document</Text>
                </View>
                <View style={[styles.badge, styles.dateBadge]}>
                  <Text style={styles.dateBadgeText}>Oct 24, 2026</Text>
                </View>
              </View>

              <Text style={styles.mainTitle}>{doc.title}</Text>
              <Text style={styles.effectiveText}>
                Effective Date: {doc.effectiveDate}  •  Last Updated: {doc.lastUpdated}
              </Text>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>App Owner:</Text>
                <Text style={styles.metaValue}>{doc.owner}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Contact Email:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${doc.contactEmail}`)}>
                  <Text style={[styles.metaValue, styles.linkText]}>{doc.contactEmail}</Text>
                </TouchableOpacity>
              </View>
              {doc.contactPhone ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Contact Number:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('tel:9585716229')}>
                    <Text style={[styles.metaValue, styles.linkText]}>{doc.contactPhone}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {doc.address ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Address:</Text>
                  <Text style={[styles.metaValue, { flex: 1, textAlign: 'right', fontSize: 12 }]}>{doc.address}</Text>
                </View>
              ) : null}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Website:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(doc.website)}>
                  <Text style={[styles.metaValue, styles.linkText]}>{doc.website}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sections */}
            {doc.sections.map((section, index) => (
              <View key={index} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            ))}

            {/* Contact Card */}
            {doc.contactInfo && (
              <View style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <Icon name="mail-unread-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                  <Text style={styles.contactCardTitle}>Grievances & Official Contact</Text>
                </View>
                <Text style={styles.contactText}><Text style={styles.bold}>App:</Text> {doc.contactInfo.app}</Text>
                <Text style={styles.contactText}><Text style={styles.bold}>Owner / Company:</Text> {doc.contactInfo.owner}</Text>
                <Text style={styles.contactText}>
                  <Text style={styles.bold}>Email:</Text>{' '}
                  <Text style={styles.linkText} onPress={() => Linking.openURL(`mailto:${doc.contactInfo?.email}`)}>
                    {doc.contactInfo.email}
                  </Text>
                </Text>
                {doc.contactInfo.phone ? (
                  <Text style={styles.contactText}>
                    <Text style={styles.bold}>Contact Number:</Text>{' '}
                    <Text style={styles.linkText} onPress={() => Linking.openURL('tel:9585716229')}>
                      {doc.contactInfo.phone}
                    </Text>
                  </Text>
                ) : null}
                <Text style={styles.contactText}><Text style={styles.bold}>Address:</Text> {doc.contactInfo.address}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>
              {title === 'Paid Service Terms'
                ? "Our PRO memberships and paid tournament entries are non-refundable unless specified otherwise.\n\nSubscriptions are billed automatically unless canceled at least 24 hours before the renewal date.\n\nUPMI is not responsible for prize pool payouts managed by independent third-party tournament organizers."
                : "Content not available."}
            </Text>
          </View>
        )}

        <Text style={styles.footerNote}>© 2026 Upmi. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    zIndex: 10,
  },
  backBtn: { marginRight: 14, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', flex: 1 },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 48 },

  docHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#1D4ED8' },
  dateBadge: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  dateBadgeText: { fontSize: 11, fontWeight: '500', color: '#64748B' },
  mainTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  effectiveText: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  metaLabel: { fontSize: 13, fontWeight: '600', color: '#475569', width: 110 },
  metaValue: { fontSize: 13, color: '#0F172A', flex: 1 },
  linkText: { color: '#2563EB', textDecorationLine: 'underline' },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingBottom: 6,
  },
  sectionContent: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 22,
    textAlign: 'left',
  },

  contactCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  contactCardTitle: { fontSize: 15, fontWeight: '700', color: '#0369A1' },
  contactText: { fontSize: 13, color: '#0C4A6E', marginVertical: 3, lineHeight: 19 },
  bold: { fontWeight: '700', color: '#0369A1' },

  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PolicyScreen;
