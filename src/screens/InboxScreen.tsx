import React, { useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, TextInput, Modal, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';

const InboxScreen = () => {
  const navigation = useNavigation<any>();

  const { chats, addMultipleChats, userProfile, currentUserId, markChatAsRead } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<string>('Chats');

  const [userCreatedGroupIds, setUserCreatedGroupIds] = useState<string[]>([]);

  const loadLocalGroupIds = async () => {
    try {
      const res = await AsyncStorage.getItem('user_created_group_ids');
      if (res) {
        setUserCreatedGroupIds(JSON.parse(res));
      }
      const persisted = await AsyncStorage.getItem('@persisted_chats');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (Array.isArray(parsed) && parsed.length > 0) {
          addMultipleChats(parsed);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadLocalGroupIds();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInboxData = async () => {
    try {
      const uid = (userProfile?.id || currentUserId || '1').toString().replace('user_', '');
      const inboxData = await apiService.getInbox(uid);
      if (inboxData && Array.isArray(inboxData)) {
        addMultipleChats(inboxData);
      }
    } catch (e) {
      console.log('Error refreshing inbox:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLocalGroupIds();
      fetchInboxData();
    }, [currentUserId, userProfile?.id])
  );
  const [customLists, setCustomLists] = useState<string[]>([]);
  const [isCustomizeVisible, setCustomizeVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [chatSearchText, setChatSearchText] = useState('');

  // Filter and sort chats based on tab, search query, and timing
  const getFilteredChats = () => {
    let list = chats;
    if (activeTab === 'Groups') {
      list = chats.filter(c => c.isGroup);
    } else if (activeTab === 'Favorites') {
      list = chats.filter(c => c.isFavorite);
    } else if (customLists.includes(activeTab)) {
      list = [];
    } else {
      list = chats.filter(c => !c.isGroup);
    }

    if (chatSearchText.trim().length > 0) {
      const q = chatSearchText.trim().toLowerCase();
      list = list.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q)) ||
        (c.tournamentName && c.tournamentName.toLowerCase().includes(q)) ||
        (c.stageName && c.stageName.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a: any, b: any) => {
      const timeA = a.updatedAt || a.createdAt || a.timestamp || 0;
      const timeB = b.updatedAt || b.createdAt || b.timestamp || 0;
      return timeB - timeA;
    });
  };

  const filteredChatList = getFilteredChats();

  const handleDeleteChat = (id: string, name: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete your chat with ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => { console.log('Chat deleted:', id); }
        }
      ]
    );
  };

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => {
        if (markChatAsRead) markChatAsRead(item.id);
        navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, isGroup: item.isGroup, isCreator: false });
      }}
      onLongPress={() => handleDeleteChat(item.id, item.name)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.avatar} />
        {item.unread > 0 && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.unread > 0 && styles.chatNameUnread]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const [isCreateGroupVisible, setCreateGroupVisible] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState<1 | 2>(1);
  const [groupPermissions, setGroupPermissions] = useState({
    editSettings: true,
    sendMessages: true,
    addMembers: true,
    approveMembers: false
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  interface SearchUser {
    id: string;
    name: string;
    username: string;
    avatar: string;
  }

  const [registeredUsers, setRegisteredUsers] = useState<SearchUser[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@app_registered_users_cache').then(cached => {
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegisteredUsers(parsed);
          }
        } catch {}
      }
    });
    syncAllUsers();
  }, []);

  const syncAllUsers = async () => {
    try {
      const userMap = new Map<string, SearchUser>();

      registeredUsers.forEach(u => userMap.set(u.id, u));

      const uid = (userProfile?.id || currentUserId || '1').toString().replace('user_', '');
      const inboxData = await apiService.getInbox(uid).catch(() => null);
      if (Array.isArray(inboxData)) {
        inboxData.forEach((c: any) => {
          const cid = String(c.userId || c.id || '').replace('user_', '').trim();
          if (cid && !c.isGroup) {
            const rawUser = (c.username || c.name || `user_${cid}`).trim();
            const formattedUser = rawUser.startsWith('@') ? rawUser : '@' + rawUser;
            userMap.set(cid, {
              id: cid,
              name: c.name || rawUser,
              username: formattedUser,
              avatar: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || rawUser)}&background=E51025&color=fff`,
            });
          }
        });
      }

      const feedData = await apiService.getLookingFeed().catch(() => null);
      const posts = feedData?.data || (Array.isArray(feedData) ? feedData : []);
      if (Array.isArray(posts)) {
        posts.forEach((p: any) => {
          const pUid = String(p.user_id || '').replace('user_', '').trim();
          if (pUid) {
            const rawUser = (p.creator_username || p.name || `user_${pUid}`).trim();
            const formattedUser = rawUser.startsWith('@') ? rawUser : '@' + rawUser;
            const existing = userMap.get(pUid);
            userMap.set(pUid, {
              id: pUid,
              name: existing?.name || p.name || p.player_name || rawUser,
              username: formattedUser,
              avatar: p.creator_avatar || existing?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser)}&background=E51025&color=fff`,
            });
          }
        });
      }

      const profileIds = Array.from({ length: 15 }, (_, i) => String(i + 1));
      await Promise.all(
        profileIds.map(async pid => {
          try {
            const pRes = await apiService.getProfile(pid);
            if (pRes?.status && pRes?.data) {
              const d = pRes.data;
              const rawUser = (d.username || '').trim();
              const formattedUser = rawUser ? (rawUser.startsWith('@') ? rawUser : '@' + rawUser) : `@user_${pid}`;
              const fullName = (d.fullName || d.name || rawUser || `User ${pid}`).trim();
              const avatar = d.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E51025&color=fff`;
              userMap.set(pid, {
                id: pid,
                name: fullName,
                username: formattedUser,
                avatar,
              });
            }
          } catch {}
        })
      );

      const allUsers = Array.from(userMap.values());
      if (allUsers.length > 0) {
        setRegisteredUsers(allUsers);
        AsyncStorage.setItem('@app_registered_users_cache', JSON.stringify(allUsers));
      }
    } catch (e) {
      console.log('Error syncing registered users:', e);
    }
  };

  const myCleanId = (userProfile?.id || currentUserId || '').toString().replace('user_', '').trim();
  const myCleanUsername = (userProfile?.username || '').toString().toLowerCase().replace('@', '').trim();

  const cleanQuery = searchQuery.trim().toLowerCase().replace('@', '');
  const filteredUsers = registeredUsers.filter(u => {
    const cleanId = u.id.replace('user_', '').trim();
    const cleanUName = (u.username || '').toLowerCase().replace('@', '').trim();
    if (myCleanId && cleanId === myCleanId) return false;
    if (myCleanUsername && cleanUName === myCleanUsername) return false;

    if (!cleanQuery) return true;
    const cleanName = (u.name || '').toLowerCase();
    return cleanUName.includes(cleanQuery) || cleanName.includes(cleanQuery);
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    setCreateGroupVisible(false);
    
    const finalName = newGroupName.trim().length > 0 ? newGroupName : 'New Group';
    const newChatId = 'group_' + Date.now();

    // Build member list
    const members: any[] = [
      { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', role: 'super_admin' }
    ];
    selectedUsers.forEach(uid => {
      const u = registeredUsers.find(du => du.id === uid);
      if (u) {
        members.push({ id: u.id, name: u.name, avatar: u.avatar, role: 'member' });
      }
    });

    const updatedIds = [...userCreatedGroupIds, newChatId];
    setUserCreatedGroupIds(updatedIds);
    AsyncStorage.setItem('user_created_group_ids', JSON.stringify(updatedIds));

    const newGroupObj = {
      isUserCreated: true,
      id: newChatId,
      name: finalName,
      lastMessage: 'Group created.',
      time: 'Just now',
      unread: 0,
      isGroup: true,
      members,
      permissions: { ...groupPermissions }
    };

    // Add to context
    addMultipleChats([newGroupObj]);

    setNewGroupName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setCreateGroupStep(1);

    // Navigate to ChatScreen
    navigation.navigate('ChatScreen', {
      userId: newChatId,
      userName: finalName,
      isGroup: true,
      isCreator: true,
      permissions: groupPermissions,
      members: members
    });
  };

  const handleHeaderEditPress = () => {
    syncAllUsers();
    setCreateGroupStep(1);
    setSearchQuery('');
    setSelectedUsers([]);
    setNewGroupName('');
    setCreateGroupVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerRightBtn} onPress={handleHeaderEditPress}>
          <Icon name="create-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search messages, groups..."
            placeholderTextColor="#9CA3AF"
            value={chatSearchText}
            onChangeText={setChatSearchText}
          />
          {chatSearchText.length > 0 && (
            <TouchableOpacity onPress={() => setChatSearchText('')} style={{ padding: 4 }}>
              <Icon name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={{ minHeight: 52, paddingVertical: 4, marginBottom: 10 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
        >
          {['Chats', 'Groups', 'Favorites', ...customLists].map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={{ 
                marginRight: 10, 
                paddingVertical: 9, 
                paddingHorizontal: 18, 
                borderRadius: 22, 
                backgroundColor: activeTab === tab ? '#E51025' : '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 40
              }}>
              <Text style={{ 
                color: activeTab === tab ? '#FFFFFF' : '#4B5563', 
                fontWeight: '700', 
                fontSize: 14,
                lineHeight: 20,
                textAlignVertical: 'center'
              }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            onPress={() => setCustomizeVisible(true)}
            style={{ 
              paddingVertical: 9, 
              paddingHorizontal: 16, 
              borderRadius: 22, 
              backgroundColor: '#F3F4F6',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 40
            }}>
            <Icon name="add" size={16} color="#4B5563" />
            <Text style={{ 
              color: '#4B5563', 
              fontWeight: '700', 
              fontSize: 13, 
              marginLeft: 4,
              lineHeight: 20,
              textAlignVertical: 'center' 
            }}>
              Customize
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChatList}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 30 }}>
            <Icon 
              name={activeTab === 'Groups' ? 'people-outline' : activeTab === 'Favorites' ? 'heart-outline' : 'chatbubbles-outline'} 
              size={48} 
              color="#9CA3AF" 
            />
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#374151', marginTop: 14 }}>
              {activeTab === 'Groups' 
                ? 'No Groups Yet' 
                : activeTab === 'Favorites' 
                ? 'No Favorite Chats' 
                : 'No Messages Yet'}
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
              {activeTab === 'Groups'
                ? 'Tap the edit icon at the top right to create a new group.'
                : 'Your messages will appear here.'}
            </Text>
          </View>
        }
        refreshing={isRefreshing}
        onRefresh={async () => {
          setIsRefreshing(true);
          await fetchInboxData();
          setIsRefreshing(false);
        }}
      />

      {/* Create Group / New Message Modal */}
      <Modal visible={isCreateGroupVisible} transparent={true} animationType="slide" onRequestClose={() => { setCreateGroupVisible(false); setSelectedUsers([]); }}>
        <TouchableOpacity style={styles.modalOverlayFull} activeOpacity={1} onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContentFull}>
            
            
            {activeTab === 'Chats' ? (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Chat</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>
                
                <View style={styles.searchBoxModal}>
                  <Text style={{ fontWeight: '600', marginRight: 10, color: '#111827' }}>To:</Text>
                  <TextInput 
                    style={styles.searchInputModal}
                    placeholder="Search people..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionLabel}>{cleanQuery ? 'Search Results' : 'Suggested'}</Text>
                  {filteredUsers.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 30, paddingHorizontal: 20 }}>
                      <Icon name="search-outline" size={40} color="#9CA3AF" />
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#374151', marginTop: 10 }}>
                        No accounts found
                      </Text>
                      <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
                        No users matching "{searchQuery}"
                      </Text>
                    </View>
                  ) : (
                    filteredUsers.map(user => (
                      <TouchableOpacity 
                        key={user.id} 
                        style={styles.userRow}
                        activeOpacity={0.7}
                        onPress={() => {
                          setCreateGroupVisible(false);
                          navigation.navigate('ChatScreen', {
                            userId: user.id,
                            userName: user.name,
                            userAvatar: user.avatar,
                            username: user.username,
                            isGroup: false,
                            isCreator: false
                          });
                        }}
                      >
                        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userSub}>{user.username}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </>
            ) : (
              // Groups Flow
              createGroupStep === 1 ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Group</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchBoxModal}>
                    <Text style={{ fontWeight: '600', marginRight: 10, color: '#111827' }}>To:</Text>
                    <TextInput 
                      style={styles.searchInputModal}
                      placeholder="Search people..."
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

                  <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionLabel}>{cleanQuery ? 'Search Results' : 'Suggested'}</Text>
                    {filteredUsers.map(user => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <TouchableOpacity 
                          key={user.id} 
                          style={styles.userRow}
                          activeOpacity={0.7}
                          onPress={() => toggleUserSelection(user.id)}
                        >
                          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userSub}>{user.username}</Text>
                          </View>
                          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {selectedUsers.length > 0 && (
                    <TouchableOpacity style={styles.createBtn} onPress={() => setCreateGroupStep(2)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.createBtnText, { marginRight: 8 }]}>Next</Text>
                        <Icon name="arrow-forward" size={18} color="#FFF" />
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => setCreateGroupStep(1)} style={{ marginRight: 15, padding: 4 }}>
                      <Icon name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Group Settings</Text>
                  </View>

                  <TextInput 
                    style={styles.groupNameInput}
                    placeholder="Group Name"
                    placeholderTextColor="#9CA3AF"
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                  />

                  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <Text style={styles.sectionLabel}>Group Permissions</Text>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Edit group settings</Text>
                        <Text style={styles.permissionDesc}>This includes the name, icon, description, and ability to pin.</Text>
                      </View>
                      <Switch value={groupPermissions.editSettings} onValueChange={v => setGroupPermissions(p => ({...p, editSettings: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.editSettings ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Send new messages</Text>
                      </View>
                      <Switch value={groupPermissions.sendMessages} onValueChange={v => setGroupPermissions(p => ({...p, sendMessages: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.sendMessages ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Add other members</Text>
                      </View>
                      <Switch value={groupPermissions.addMembers} onValueChange={v => setGroupPermissions(p => ({...p, addMembers: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.addMembers ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Approve new members</Text>
                        <Text style={styles.permissionDesc}>When turned on, admin must approve anyone who wants to join.</Text>
                      </View>
                      <Switch value={groupPermissions.approveMembers} onValueChange={v => setGroupPermissions(p => ({...p, approveMembers: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.approveMembers ? '#E51025' : '#F9FAFB'} />
                    </View>
                  </ScrollView>

                  <TouchableOpacity style={[styles.createBtn, { marginTop: 15 }]} onPress={handleCreateGroup}>
                    <Text style={styles.createBtnText}>Create Group</Text>
                  </TouchableOpacity>
                </>
              )
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* Customize List Modal */}
      <Modal visible={isCustomizeVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 }}>Create Custom List</Text>
            <TextInput 
              style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} 
              placeholder="List name (e.g., Work, Family)" placeholderTextColor="#9CA3AF"
              value={newListName} 
              onChangeText={setNewListName} 
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
              <TouchableOpacity onPress={() => { setCustomizeVisible(false); setNewListName(''); }}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { 
                if(newListName.trim()) { 
                  setCustomLists([...customLists, newListName.trim()]); 
                  setActiveTab(newListName.trim()); 
                }
                setCustomizeVisible(false); 
                setNewListName(''); 
              }}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Customize List Modal */}
      <Modal visible={isCustomizeVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 }}>Create Custom List</Text>
            <TextInput 
              style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} 
              placeholder="List name (e.g., Work, Family)" placeholderTextColor="#9CA3AF"
              value={newListName} 
              onChangeText={setNewListName} 
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
              <TouchableOpacity onPress={() => { setCustomizeVisible(false); setNewListName(''); }}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { 
                if(newListName.trim()) { 
                  setCustomLists([...customLists, newListName.trim()]); 
                  setActiveTab(newListName.trim()); 
                }
                setCustomizeVisible(false); 
                setNewListName(''); 
              }}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  headerRightBtn: { padding: 4 },
  searchContainer: { paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#FFFFFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, height: 44 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1F2937' },
  listContainer: { paddingHorizontal: 15, paddingTop: 5, paddingBottom: 20 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6' },
  onlineIndicator: { position: 'absolute', right: 2, bottom: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFFFFF' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#1F2937', flex: 1, marginRight: 10 },
  chatNameUnread: { fontWeight: 'bold', color: '#111827' },
  chatTime: { fontSize: 12, color: '#6B7280' },
  chatTimeUnread: { color: '#E51025', fontWeight: '600' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#6B7280', flex: 1, marginRight: 15 },
  lastMessageUnread: { color: '#111827', fontWeight: '500' },
  unreadBadge: { backgroundColor: '#E51025', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  groupNameInput: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#1F2937', marginBottom: 20 },
  createBtn: { backgroundColor: '#E51025', borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlayFull: { flex: 1, backgroundColor: '#FFFFFF' },
  modalContentFull: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, paddingTop: 40 },
  searchBoxModal: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10, marginBottom: 10 },
  searchInputModal: { flex: 1, fontSize: 16, color: '#1F2937' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#6B7280', marginBottom: 15 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  userSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#E51025', borderColor: '#E51025' },
  permissionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  permissionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  permissionDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, paddingRight: 10 }
});

export default InboxScreen;




