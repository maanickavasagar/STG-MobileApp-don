import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../api/index';

export interface Player {
  id: string;
  name: string;
  role: string;
}

export interface TeamRegistrationData {
  id: string;
  tournamentId: string;
  teamName: string;
  teamBanner: string | null;
  slot: string;
  map?: string;
  players: Player[];
  user_id?: string;
  userId?: string;
  tournament?: any;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string; // no longer optional
  bio?: string;
  followers: number;
  following: number;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    discord?: string;
    facebook?: string;
  };
  liveLocation: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  profilePicture: string | null;
  password?: string;
  region?: string;
  languages?: string;
}

export interface FlyerData {
  id: string;
  image: string | null;
  text: string;
  timestamp: string;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  prize: string;
  teamsLimit: string;
  time: string;
  status: string;
  pointsSystem?: string;
  totalSlots?: string;
  teamsPerGroup?: string;
  numberOfGroups?: string;
  flyerDetails?: string;
  bannerImage?: string | null;
  flyerImage?: any;
  organiserName?: string;
  rules?: string;
  user_id?: string;
  creator_id?: string;
  matchDate?: string;
  templateId?: string;
  templateData?: any;
  roadmap?: string;
  matchDatesObj?: any;
  regStartDate?: string;
  regEndDate?: string;
  selectedFlyers?: Record<string, any>;
  globalFlyerData?: any;
  stages?: any[];
  killsPoint?: string;
  positions?: any;
  sponsorName?: string;
  manageBy?: string;
  socialMedia?: string[];
  socialMedia1?: string;
  socialMedia2?: string;
  socialMedia3?: string;
  socialMedia4?: string;
  eventLogo?: string | null;
  [key: string]: any;
}

export interface Match {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  time: string;
  venue: string;
  isLive: boolean;
  tournamentId?: string;
  name?: string;
  status?: string;
  tournamentDetails?: any;
  organiserName?: string;
  [key: string]: any;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'super_admin' | 'admin' | 'member';
}

export interface GroupPermissions {
  editSettings: boolean;
  sendMessages: boolean;
  addMembers: boolean;
  approveMembers: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'system' | 'tournament' | 'chat';
  isRead: boolean;
  link?: string;
}

export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup: boolean;
  isFavorite?: boolean;
  isUserCreated?: boolean;
  isTournamentGroup?: boolean;
  tournamentId?: string;
  tournamentName?: string;
  stageName?: string;
  groupIndex?: number;
  maxTeams?: number;
  joinedTeams?: number;
  regEndDate?: string;
  grandFinalsDate?: string;
  adminId?: string;
  adminName?: string;
  members?: GroupMember[];
  permissions?: GroupPermissions;
  [key: string]: any;
}

interface AppContextType {
  globalTournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updatedData: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  registeredMatches: Match[];
  registerForTournament: (tournament: Tournament) => void;
  addMatch: (match: Match) => void;
  fetchMyMatches: () => Promise<void>;
  draftTournament: Partial<Tournament> | null;
  setDraftTournament: (tournament: Partial<Tournament> | null) => void;
  teamRegistrations: TeamRegistrationData[];
  registerTeam: (data: TeamRegistrationData) => void;
  flyers: FlyerData[];
  addFlyer: (flyer: FlyerData) => void;
  chats: ChatItem[];
  addMultipleChats: (newChats: ChatItem[]) => void;
  toggleFavoriteChat: (id: string) => void;
  updateChatDetails: (chatId: string, updates: Partial<ChatItem>) => void;
  userProfile: UserProfile | null;
  currentUserId: string | null;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loginUser: (userId: string) => Promise<boolean | void>;
  logoutUser: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  isAppLoading: boolean;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
  inAppNotification: {
    id: string;
    senderName: string;
    message: string;
    chatId: string;
    avatar?: string;
  } | null;
  notifyNewMessage: (senderName: string, message: string, chatId: string, avatar?: string) => void;
  dismissNotification: () => void;
  markChatAsRead: (id: string) => void;
  appNotifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addAppNotification: (notif: Partial<AppNotification>) => void;
  supportedUserIds: string[];
  toggleSupportUser: (targetUserId: string, targetName?: string) => Promise<boolean>;
  aiTranslateEnabled: boolean;
  setAiTranslateEnabled: (val: boolean) => void;
  userTargetLanguage: string;
  setUserTargetLanguage: (lang: string) => void;
}

export const AppContext = createContext<AppContextType>({
  globalTournaments: [],
  addTournament: () => {},
  updateTournament: () => {},
  deleteTournament: () => {},
  registeredMatches: [],
  registerForTournament: () => {},
  addMatch: () => {},
  fetchMyMatches: async () => {},
  draftTournament: null,
  setDraftTournament: () => {},
  teamRegistrations: [],
  registerTeam: () => {},
  flyers: [],
  addFlyer: () => {},
  chats: [],
  addMultipleChats: () => {},
  toggleFavoriteChat: () => {},
  updateChatDetails: () => {},
  userProfile: null,
  currentUserId: null,
  setUserProfile: () => {},
  updateUserProfile: async () => {},
  loginUser: async () => false,
  logoutUser: async () => {},
  fetchTournaments: async () => {},
  isAppLoading: true,
    isDrawerOpen: false,
    setIsDrawerOpen: () => {},
  inAppNotification: null,
  notifyNewMessage: () => {},
  dismissNotification: () => {},
  markChatAsRead: () => {},
  appNotifications: [],
  unreadNotificationCount: 0,
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  addAppNotification: () => {},
  supportedUserIds: [],
  toggleSupportUser: async () => false,
  aiTranslateEnabled: false,
  setAiTranslateEnabled: () => {},
  userTargetLanguage: 'ta',
  setUserTargetLanguage: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [globalTournaments, setGlobalTournaments] = useState<Tournament[]>([]);
  const [registeredMatches, setRegisteredMatches] = useState<Match[]>([]);
  const [draftTournament, setDraftTournament] = useState<Partial<Tournament> | null>(null);
  const [teamRegistrations, setTeamRegistrations] = useState<TeamRegistrationData[]>([]);
  const [flyers, setFlyers] = useState<FlyerData[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const DEFAULT_CHATS: ChatItem[] = [
    {
      id: 'chat_scout',
      name: 'ScoutOP (Team X)',
      lastMessage: 'send room id and password',
      time: '11:45 AM',
      unread: 2,
      isGroup: false,
      avatar: 'https://i.pravatar.cc/150?u=scout',
    },
    {
      id: 'chat_mortal',
      name: 'Mortal (SouL)',
      lastMessage: 'what time is the match',
      time: '11:20 AM',
      unread: 1,
      isGroup: false,
      avatar: 'https://i.pravatar.cc/150?u=mortal',
    },
    {
      id: 'chat_official',
      name: 'UPMI Match Official Desk',
      lastMessage: 'Room ID & Password will be shared here 15 mins before match starts.',
      time: '10:30 AM',
      unread: 2,
      isGroup: true,
      isTournamentGroup: true,
      avatar: 'https://i.pravatar.cc/150?u=UPMI_Desk',
      members: [
        { id: 'admin1', name: 'Official Moderator', role: 'admin' },
        { id: 'p1', name: 'Team Soul', role: 'member' }
      ]
    },
    {
      id: 'chat_soul_godlike',
      name: 'Team Soul vs GodLike Scrims',
      lastMessage: 'Ready for Miramar Round 2?',
      time: '10:15 AM',
      unread: 1,
      isGroup: true,
      isTournamentGroup: true,
      avatar: 'https://i.pravatar.cc/150?u=Soul_GodLike',
      members: [
        { id: 'soul1', name: 'Mortal', role: 'member' },
        { id: 'god1', name: 'Jonathan', role: 'member' }
      ]
    },
    {
      id: 'chat_qualifier_grp1',
      name: 'Championship Qualifier Group 1',
      lastMessage: 'Slot 1 to 18 check-in complete. Match begins at 12:00 PM.',
      time: 'Yesterday',
      unread: 3,
      isGroup: true,
      isTournamentGroup: true,
      avatar: 'https://i.pravatar.cc/150?u=Qualifier_Grp1'
    }
  ];

  const [chats, setChats] = useState<ChatItem[]>(DEFAULT_CHATS);

  // Mark chat as read
  const markChatAsRead = (id: string) => {
    setChats(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, unread: 0 } : c);
      try {
        AsyncStorage.setItem('@persisted_chats', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // App Notifications
  const DEFAULT_NOTIFICATIONS: AppNotification[] = [
    {
      id: 'notif_1',
      title: 'UPMI CRM v3.2 Live Updates',
      message: 'New round group setup, AI live chat translation & supporter badges are now active!',
      time: 'Just now',
      type: 'system',
      isRead: false,
    },
    {
      id: 'notif_2',
      title: 'Tournament Round Announcement',
      message: 'Qualifier Stage groups have been generated. Check your slot list & room announcements.',
      time: '10m ago',
      type: 'tournament',
      isRead: false,
    },
    {
      id: 'notif_3',
      title: 'Welcome to UPMI Esports',
      message: 'Connect your Instagram, build your roster, and register for active BGMI tournaments.',
      time: '1h ago',
      type: 'system',
      isRead: true,
    },
  ];

  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS);
  const unreadNotificationCount = appNotifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setAppNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setAppNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addAppNotification = (notif: Partial<AppNotification>) => {
    const newNotif: AppNotification = {
      id: notif.id || 'notif_' + Date.now(),
      title: notif.title || 'UPMI Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      type: notif.type || 'system',
      isRead: false,
      link: notif.link,
    };
    setAppNotifications(prev => [newNotif, ...prev]);
  };

  // Supported Users list
  const [supportedUserIds, setSupportedUserIds] = useState<string[]>([]);
  useEffect(() => {
    AsyncStorage.getItem('@user_supporting').then(res => {
      if (res) {
        try { setSupportedUserIds(JSON.parse(res)); } catch (e) {}
      }
    }).catch(() => {});
  }, []);

  const toggleSupportUser = async (targetUserId: string, targetName?: string) => {
    let isNowSupported = false;
    setSupportedUserIds(prev => {
      let next: string[];
      if (prev.includes(targetUserId)) {
        next = prev.filter(id => id !== targetUserId);
        isNowSupported = false;
      } else {
        next = [...prev, targetUserId];
        isNowSupported = true;
      }
      try {
        AsyncStorage.setItem('@user_supporting', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (userProfile) {
      const delta = isNowSupported ? 1 : -1;
      const updatedFollowing = Math.max(0, (userProfile.following || 0) + delta);
      updateUserProfile({ following: updatedFollowing });
    }
    return isNowSupported;
  };

  // AI Multilingual Translation Settings
  const [aiTranslateEnabled, setAiTranslateEnabled] = useState(false);
  const [userTargetLanguage, setUserTargetLanguage] = useState('ta');

  const [inAppNotification, setInAppNotification] = useState<{
    id: string;
    senderName: string;
    message: string;
    chatId: string;
    avatar?: string;
  } | null>(null);

  const notifyNewMessage = (senderName: string, message: string, chatId: string, avatar?: string, senderId?: string) => {
    const myId = (currentUserId || userProfile?.id || '').toString().replace('user_', '').trim();
    const cleanSenderId = (senderId || '').toString().replace('user_', '').trim();
    // Do NOT notify yourself!
    if (cleanSenderId && myId && cleanSenderId === myId) {
      return;
    }
    const id = Date.now().toString();
    setInAppNotification({ id, senderName, message, chatId, avatar });
    setTimeout(() => {
      setInAppNotification(curr => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const dismissNotification = () => {
    setInAppNotification(null);
  };

  const updateChatDetails = (chatId: string, updates: Partial<ChatItem>) => {
    setChats(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, ...updates, updatedAt: Date.now() } : c);
      try {
        AsyncStorage.setItem('@persisted_chats', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addMultipleChats = (newChats: ChatItem[]) => {
    setChats(prev => {
      const map = new Map<string, ChatItem>();
      newChats.forEach(c => {
        if (c && c.id) {
          map.set(c.id, {
            ...c,
            createdAt: c.createdAt || Date.now(),
            updatedAt: c.updatedAt || Date.now(),
            timestamp: c.timestamp || Date.now()
          });
        }
      });
      prev.forEach(c => { if (c && c.id && !map.has(c.id)) map.set(c.id, c); });
      const result = Array.from(map.values());
      // Sort strictly by timing (newest created / updated groups at the top)
      result.sort((a: any, b: any) => {
        const timeA = a.updatedAt || a.createdAt || a.timestamp || 0;
        const timeB = b.updatedAt || b.createdAt || b.timestamp || 0;
        return timeB - timeA;
      });
      try {
        AsyncStorage.setItem('@persisted_chats', JSON.stringify(result));
      } catch (e) {}
      return result;
    });
  };

  const toggleFavoriteChat = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...profileData } as UserProfile;
      
      try {
        if (profileData.profilePicture && (profileData.profilePicture.startsWith('file://') || profileData.profilePicture.startsWith('content://'))) {
          const formData = new FormData();
          formData.append('id', String(updatedProfile.id));
          if (updatedProfile.fullName) formData.append('fullName', updatedProfile.fullName);
          if (updatedProfile.username) formData.append('username', updatedProfile.username);
          if (updatedProfile.email) formData.append('email', updatedProfile.email);
          if (updatedProfile.dateOfBirth) formData.append('dateOfBirth', updatedProfile.dateOfBirth);
          if (updatedProfile.gender) formData.append('gender', updatedProfile.gender);
          if (updatedProfile.liveLocation) formData.append('liveLocation', updatedProfile.liveLocation);
          if (updatedProfile.bio) formData.append('bio', updatedProfile.bio);
          if (updatedProfile.region) formData.append('region', updatedProfile.region);
          if (updatedProfile.languages) formData.append('languages', updatedProfile.languages);

          const uriParts = profileData.profilePicture.split('.');
          const fileType = uriParts[uriParts.length - 1] || 'jpg';
          const filename = 'avatar_' + Date.now() + '.' + fileType;

          formData.append('profilePicture', {
            uri: profileData.profilePicture,
            name: filename,
            type: 'image/' + fileType,
          } as any);

          const res = await apiService.updateProfile(formData);
          if (res?.data?.profilePicture) {
            updatedProfile.profilePicture = res.data.profilePicture;
          }
        } else {
          await apiService.updateProfile(updatedProfile);
        }
      } catch (e) {
        console.log('API update profile error:', e);
      }
      
      setUserProfileState(updatedProfile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  const fetchUserProfile = async (userId: string) => {
      try {
        // Try to fetch from API
        const apiData = await apiService.getProfile(userId).catch(() => null);
        
        // If API responds with an explicit error (like 404 profile not found)
        if (apiData && (apiData.error || apiData.detail || apiData.status === false)) {
           await AsyncStorage.removeItem('userProfile');
           setUserProfileState(null);
           return false;
        }

        // If API responds with success
        if (apiData && !apiData.error && !apiData.detail && apiData.status !== false) {
          const profileData = apiData.data || apiData; // handle if backend wraps in data object
          
          // Check if essential fields are empty
          if (!profileData.username || !profileData.fullName || profileData.fullName.trim() === '') {
             await AsyncStorage.removeItem('userProfile');
             setUserProfileState(null);
             return false;
          }

          setUserProfileState(profileData);
          await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
          return true;
        }

        // If API fails due to network (apiData is null), fallback to local storage
        const profileStr = await AsyncStorage.getItem('userProfile');
        if (profileStr) {
          const profileData = JSON.parse(profileStr);
          setUserProfileState(profileData);
          return true;
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
      return false;
  };

  const loginUser = async (userId: string) => {
    await AsyncStorage.setItem('userId', userId);
    setCurrentUserId(userId);
    return await fetchUserProfile(userId);
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem('userId');
    setCurrentUserId(null);
    setUserProfileState(null);
  };

  const fetchTournaments = async () => {
    try {
      const res = await apiService.getTournaments().catch(() => null);
      let apiData = res;
      if (res && (res.status === 'success' || res.status === true) && res.data) {
        if (Array.isArray(res.data)) {
          apiData = res.data;
        } else if (Array.isArray(res.data.tournaments_near_you)) {
          apiData = res.data.tournaments_near_you;
        }
      }
      
      if (apiData && Array.isArray(apiData)) {
          const mappedData = apiData.map(item => ({
            id: item.id ? item.id.toString() : '',
            user_id: item.user_id,
            name: item.name || '',
            organiserName: item.organiser_name || item.organiserName || '',
            sponsorName: item.sponsor_name || item.sponsorName || '',
            manageBy: item.manage_by || item.manageBy || '',
            socialMedia1: item.social_media_1 || item.socialMedia1 || (Array.isArray(item.socialMedia) ? item.socialMedia[0] : '') || '',
            socialMedia2: item.social_media_2 || item.socialMedia2 || (Array.isArray(item.socialMedia) ? item.socialMedia[1] : '') || '',
            socialMedia3: item.social_media_3 || item.socialMedia3 || (Array.isArray(item.socialMedia) ? item.socialMedia[2] : '') || '',
            socialMedia4: item.social_media_4 || item.socialMedia4 || (Array.isArray(item.socialMedia) ? item.socialMedia[3] : '') || '',
            socialMedia: [
              item.social_media_1 || item.socialMedia1 || '',
              item.social_media_2 || item.socialMedia2 || '',
              item.social_media_3 || item.socialMedia3 || '',
              item.social_media_4 || item.socialMedia4 || ''
            ],
            game: item.game || '',
            prize: item.prize || '',
            teamsLimit: item.teams_limit?.toString() || item.teamsLimit?.toString() || '0',
            totalSlots: item.total_slots?.toString() || item.totalSlots?.toString() || '0',
            teamsPerGroup: item.teams_per_group?.toString() || item.teamsPerGroup?.toString() || '0',
            numberOfGroups: item.number_of_groups?.toString() || item.numberOfGroups?.toString() || '0',
            regStartDate: item.registration_start_date || item.regStartDate || '',
            regEndDate: item.registration_end_date || item.regEndDate || '',
            roadmap: item.roadmap || '',
            time: item.time || '',
            matchDate: item.match_date || item.matchDate || '',
            bannerImage: item.banner_image || item.bannerImage || null,
            status: item.status || 'upcoming',
            selectedFlyers: item.selected_flyers || item.selectedFlyers || {},
            stages: item.stages || [],
            matchDatesObj: item.match_dates_obj || item.matchDatesObj || {},
            killsPoint: item.kills_point || item.killsPoint || 1,
            positions: item.positions || []
          }));
          setGlobalTournaments(mappedData);
          await AsyncStorage.setItem('tournaments', JSON.stringify(mappedData));
      } else {
          const stored = await AsyncStorage.getItem('tournaments');
          if (stored) setGlobalTournaments(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error fetching tournaments:', error);
    }
  };

  const fetchGlobalData = async (uid?: string | null) => {
    try {
      const homeData = await apiService.getHomeData().catch(() => null);
      const flyersData = await apiService.getFlyers().catch(() => null);
      if (flyersData && Array.isArray(flyersData)) setFlyers(flyersData);
      
      const targetUid = uid || currentUserId || '1';
      const inboxData = await apiService.getInbox(targetUid).catch(() => null);
      if (inboxData && Array.isArray(inboxData)) {
        addMultipleChats(inboxData);
      }
    } catch (e) {
      console.log('Error fetching global API data:', e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      let activeUid: string | null = null;
      try {
        const storedChats = await AsyncStorage.getItem('@persisted_chats');
        if (storedChats) {
          const parsed = JSON.parse(storedChats);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChats(parsed);
          } else {
            setChats(DEFAULT_CHATS);
          }
        } else {
          setChats(DEFAULT_CHATS);
        }
      } catch (e) {}

      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          activeUid = storedUserId;
          setCurrentUserId(storedUserId);
          await fetchUserProfile(storedUserId);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
      const withTimeout = (p: Promise<any>, ms = 2500) =>
        Promise.race([p, new Promise(res => setTimeout(() => res(null), ms))]);

      try {
        await withTimeout(fetchTournaments(), 2000);
        await withTimeout(fetchGlobalData(activeUid), 2000);
        await withTimeout(fetchMyMatches(), 2000);
      } catch (err) {
        console.log('Initial fetch network error:', err);
      } finally {
        setIsAppLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const addTournament = (tournament: Tournament) => {
    setGlobalTournaments(prev => [tournament, ...prev]);
  };

  const updateTournament = (id: string, updatedData: Partial<Tournament>) => {
    setGlobalTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTournament = (id: string) => {
    setGlobalTournaments(prev => prev.filter(t => t.id !== id));
  };

  const registerForTournament = (tournament: Tournament) => {
    const newRegistration: Match = {
      id: Date.now().toString(),
      league: tournament.game,
      teamA: 'My Team',
      teamB: 'TBD',
      time: tournament.time,
      venue: 'Online',
      isLive: false,
    };
    setRegisteredMatches(prev => [newRegistration, ...prev]);
  };

  const addMatch = (match: Match) => {
    setRegisteredMatches(prev => [match, ...prev]);
  };

  const fetchMyMatches = async () => {
    const uid = currentUserId || userProfile?.id || '1';
    try {
      const res = await apiService.getMyMatches(uid);
      const matches = Array.isArray(res) ? res : (res?.data || []);
      if (matches && Array.isArray(matches)) {
        setRegisteredMatches(matches);
      }
    } catch (e) {
      console.log('Error fetching my matches:', e);
    }
  };

  const registerTeam = async (data: any) => {
    const uid = (currentUserId || userProfile?.id || '1').toString().replace('user_', '');
    const cleanTid = String(data.tournamentId || '').replace('tourney_', '');
    const payload = {
      ...data,
      tournamentId: data.tournamentId,
      user_id: uid,
      userId: uid
    };
    // API Call
    let result = null;
    try {
      result = await apiService.registerTeam(cleanTid, payload, uid);
    } catch (e) {
      console.log('Failed to post register team API', e);
    }
    // Update local state anyway
    setTeamRegistrations(prev => [payload, ...prev]);
    await fetchMyMatches();
    return result;
  };

  const addFlyer = (flyer: FlyerData) => {
    setFlyers(prev => [flyer, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      globalTournaments,
      addTournament,
      updateTournament,
      deleteTournament,
      registeredMatches,
      registerForTournament,
      addMatch,
      fetchMyMatches,
      draftTournament,
      setDraftTournament,
      teamRegistrations,
      registerTeam,
      flyers,
      addFlyer,
      chats,
      addMultipleChats,
      toggleFavoriteChat,
      updateChatDetails,
      inAppNotification,
      notifyNewMessage,
      dismissNotification,
      userProfile,
      currentUserId,
      setUserProfile,
      updateUserProfile,
      loginUser,
      logoutUser,
      fetchTournaments,
      isAppLoading,
        isDrawerOpen,
        setIsDrawerOpen,
        markChatAsRead,
        appNotifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAppNotification,
        supportedUserIds,
        toggleSupportUser,
        aiTranslateEnabled,
        setAiTranslateEnabled,
        userTargetLanguage,
        setUserTargetLanguage,
      }}>
      {children}
    </AppContext.Provider>
  );
};








