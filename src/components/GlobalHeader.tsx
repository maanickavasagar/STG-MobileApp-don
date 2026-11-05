import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

const GlobalHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { 
    setIsDrawerOpen, 
    appNotifications = [], 
    unreadNotificationCount = 0, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useContext(AppContext);

  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);

  return (
    <>
      <View style={[styles.navbar, { paddingTop: insets.top + 10 }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        
        {/* Left Side: Drawer Hamburger + UPMI Logo */}
        <View style={styles.navLeft}>
          <TouchableOpacity onPress={() => setIsDrawerOpen(true)} activeOpacity={0.8} style={styles.iconHitArea}>
            <Icon name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>UPMI</Text>
          </View>
        </View>

        {/* Right Side: Notification Bell + Messages */}
        <View style={styles.navRight}>
          {/* Notification Bell with Badge */}
          <TouchableOpacity 
            onPress={() => setIsNotifModalVisible(true)} 
            activeOpacity={0.8} 
            style={[styles.iconHitArea, styles.bellContainer]}
          >
            <Icon name="notifications-outline" size={24} color="#FFFFFF" />
            {unreadNotificationCount > 0 && (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Messages / Chat Icon */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('InboxScreen')} 
            activeOpacity={0.8} 
            style={styles.iconHitArea}
          >
            <Icon name="chatbubble-ellipses-outline" size={23} color="#FFFFFF" style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={isNotifModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsNotifModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.notifIconCircle}>
                  <Icon name="notifications" size={20} color="#E51025" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>Notifications & CRM</Text>
                  <Text style={styles.modalSubtitle}>App updates, tournament & match alerts</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setIsNotifModalVisible(false)} 
                style={styles.closeBtn}
              >
                <Icon name="close" size={22} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* Sub-bar with Mark All as Read */}
            <View style={styles.modalActionsRow}>
              <Text style={styles.notifCounter}>
                {unreadNotificationCount} Unread Updates
              </Text>
              {unreadNotificationCount > 0 && (
                <TouchableOpacity onPress={markAllNotificationsAsRead} style={styles.markAllBtn}>
                  <Icon name="checkmark-done" size={15} color="#E51025" style={{ marginRight: 4 }} />
                  <Text style={styles.markAllText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Notification List */}
            <ScrollView 
              style={styles.notifList}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {appNotifications.length === 0 ? (
                <View style={styles.emptyNotifs}>
                  <Icon name="notifications-off-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No Notifications</Text>
                  <Text style={styles.emptySub}>You are all caught up with tournament & app alerts!</Text>
                </View>
              ) : (
                appNotifications.map((notif: any) => {
                  let typeIcon = 'information-circle';
                  let iconColor = '#3B82F6';
                  let iconBg = '#EFF6FF';
                  if (notif.type === 'tournament') {
                    typeIcon = 'trophy';
                    iconColor = '#F59E0B';
                    iconBg = '#FEF3C7';
                  } else if (notif.type === 'chat') {
                    typeIcon = 'chatbubbles';
                    iconColor = '#10B981';
                    iconBg = '#DEF7EC';
                  }

                  return (
                    <TouchableOpacity
                      key={notif.id}
                      style={[
                        styles.notifCard,
                        !notif.isRead && styles.notifCardUnread,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (markNotificationAsRead) markNotificationAsRead(notif.id);
                        if (notif.link === 'InboxScreen') {
                          setIsNotifModalVisible(false);
                          navigation.navigate('InboxScreen');
                        }
                      }}
                    >
                      <View style={[styles.cardIconBox, { backgroundColor: iconBg }]}>
                        <Icon name={typeIcon} size={20} color={iconColor} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={[styles.cardTitle, !notif.isRead && styles.cardTitleUnread]} numberOfLines={1}>
                            {notif.title}
                          </Text>
                          <Text style={styles.cardTime}>{notif.time}</Text>
                        </View>
                        <Text style={styles.cardMessage} numberOfLines={3}>
                          {notif.message}
                        </Text>
                      </View>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  navLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconHitArea: {
    padding: 4,
  },
  logoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 12 
  },
  logoText: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '900', 
    fontStyle: 'italic', 
    marginTop: 2, 
    paddingRight: 4 
  },
  navRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  bellContainer: {
    position: 'relative',
    marginRight: 6,
  },
  navIcon: { 
    marginLeft: 8 
  },
  badgePill: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    minWidth: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#E51025',
    elevation: 3,
  },
  badgeText: {
    color: '#E51025',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notifIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  notifCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E51025',
  },
  notifList: {
    marginTop: 6,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notifCardUnread: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  cardTitleUnread: {
    fontWeight: '800',
    color: '#111827',
  },
  cardTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  cardMessage: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E51025',
    marginLeft: 8,
    marginTop: 6,
  },
  emptyNotifs: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default GlobalHeader;
