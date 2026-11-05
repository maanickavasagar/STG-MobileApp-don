import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Alert, Image, FlatList, StatusBar, Linking, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { formatSocialHandle } from '../utils/socialUtils';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';

const MatchesScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { 
    userProfile, 
    currentUserId, 
    globalTournaments, 
    fetchTournaments, 
    registeredMatches, 
    fetchMyMatches, 
    teamRegistrations,
    addTournament, 
    addMatch,
    deleteTournament
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState<'Matches' | 'Tournaments'>(route?.params?.initialTab || 'Matches');
  const [matchFilter, setMatchFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTournamentModalVisible, setIsTournamentModalVisible] = useState(false);
  const [myTournaments, setMyTournaments] = useState<any[]>([]);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  // Match form
  const [teamAName, setTeamAName] = useState('Team Strikers');
  const [teamBName, setTeamBName] = useState('');
  const [matchType, setMatchType] = useState('T1 Scrims');
  const [mapVenue, setMapVenue] = useState('Erangel');
  const [dateTime, setDateTime] = useState('Today, 6:00 PM');

  // Tournament form
  const [organisationName, setOrganisationName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [regEnds, setRegEnds] = useState('');

  const updateMyTournaments = useCallback(() => {
    const cleanUid = String(userProfile?.id || currentUserId || '').replace('user_', '');
    const userTournaments = globalTournaments.filter(t => {
      const tUid = String(t.user_id || '').replace('user_', '');
      return !!cleanUid && tUid === cleanUid;
    });
    setMyTournaments(userTournaments.length > 0 ? userTournaments : globalTournaments);
  }, [globalTournaments, userProfile?.id, currentUserId]);

  useFocusEffect(
    useCallback(() => {
      if (fetchTournaments) fetchTournaments();
      if (fetchMyMatches) fetchMyMatches();
      updateMyTournaments();
    }, [fetchTournaments, fetchMyMatches, updateMyTournaments])
  );

  React.useEffect(() => {
    updateMyTournaments();
  }, [globalTournaments, updateMyTournaments]);

  // Combine registeredMatches from API with local teamRegistrations fallback
  const combinedRegistrations = useMemo(() => {
    const list = [...(registeredMatches || [])];
    const registeredIds = new Set(list.map(m => String(m.tournamentId || m.id).replace('tourney_', '')));

    // If local teamRegistrations exist, merge them
    (teamRegistrations || []).forEach(tr => {
      const cleanTid = String(tr.tournamentId || '').replace('tourney_', '');
      if (!registeredIds.has(cleanTid)) {
        registeredIds.add(cleanTid);
        const tourney = globalTournaments.find(gt => String(gt.id).replace('tourney_', '') === cleanTid);
        list.push({
          id: tr.id || `local_${cleanTid}`,
          tournamentId: tr.tournamentId,
          name: tourney?.name || tr.teamName || 'Tournament',
          organiserName: tourney?.organiserName || 'UPMI Esports',
          game: tourney?.game || 'BGMI',
          prize: tourney?.prize || 'TBD',
          status: tourney?.status || 'Active',
          time: tourney?.time || '',
          regStartDate: tourney?.regStartDate || '',
          regEndDate: tourney?.regEndDate || '',
          totalSlots: tourney?.totalSlots || tourney?.teamsLimit || '100',
          bannerImage: tourney?.bannerImage || '',
          socialMedia1: tourney?.socialMedia1 || '',
          socialMedia2: tourney?.socialMedia2 || '',
          socialMedia3: tourney?.socialMedia3 || '',
          teamName: tr.teamName || 'My Team',
          teamBanner: tr.teamBanner || '',
          slot: tr.slot || '1',
          map: 'Erangel',
          players: tr.players || []
        } as any);
      }
    });

    return list;
  }, [registeredMatches, teamRegistrations, globalTournaments]);

  // Filter combined registrations based on status
  const filteredRegistrations = useMemo(() => {
    if (matchFilter === 'all') return combinedRegistrations;
    return combinedRegistrations.filter(m => {
      const st = String(m.status || m.tournamentDetails?.status || 'Active').toLowerCase();
      if (matchFilter === 'live') return st === 'live' || st === 'active' || st === 'running';
      if (matchFilter === 'completed') return st === 'completed' || st === 'closed' || st === 'finished' || st === 'ended';
      if (matchFilter === 'upcoming') return st === 'upcoming' || st === 'open';
      return true;
    });
  }, [combinedRegistrations, matchFilter]);

  const counts = useMemo(() => {
    let live = 0;
    let upcoming = 0;
    let completed = 0;
    combinedRegistrations.forEach(m => {
      const st = String(m.status || m.tournamentDetails?.status || 'Active').toLowerCase();
      if (st === 'live' || st === 'active' || st === 'running') live++;
      else if (st === 'completed' || st === 'closed' || st === 'finished' || st === 'ended') completed++;
      else upcoming++;
    });
    return { all: combinedRegistrations.length, live, upcoming, completed };
  }, [combinedRegistrations]);

  
  const parseCustomDate = (dateVal: any): number | null => {
    if (!dateVal) return null;
    if (typeof dateVal === 'number') return dateVal;
    const str = String(dateVal).trim();
    if (!str) return null;

    const std = Date.parse(str);
    if (!isNaN(std)) return std;

    const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const d = new Date(year, month, day, 23, 59, 59);
      if (!isNaN(d.getTime())) return d.getTime();
    }

    const dmyShortMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2})$/);
    if (dmyShortMatch) {
      const day = parseInt(dmyShortMatch[1], 10);
      const month = parseInt(dmyShortMatch[2], 10) - 1;
      const year = 2000 + parseInt(dmyShortMatch[3], 10);
      const d = new Date(year, month, day, 23, 59, 59);
      if (!isNaN(d.getTime())) return d.getTime();
    }

    const monthNames: Record<string, number> = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
      september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
    };
    const textDateMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)?\s*[-/,\s]\s*([A-Za-z]+)(?:\s*[-/,\s]\s*(\d{2,4}))?/i);
    if (textDateMatch) {
      const day = parseInt(textDateMatch[1], 10);
      const monStr = textDateMatch[2].toLowerCase();
      const mon = monthNames[monStr];
      if (mon !== undefined) {
        const year = textDateMatch[3] 
          ? parseInt(textDateMatch[3].length === 2 ? '20' + textDateMatch[3] : textDateMatch[3], 10)
          : new Date().getFullYear();
        const d = new Date(year, mon, day, 23, 59, 59);
        if (!isNaN(d.getTime())) return d.getTime();
      }
    }

    return null;
  };

  const getSocialDisplay = (val: string, prefix = '') => {
    if (!val) return '';
    const network = /youtube|youtu\.be/i.test(val) ? 'youtube' : /discord/i.test(val) ? 'discord' : 'instagram';
    let str = formatSocialHandle(network, val, prefix === '@');
    str = str.replace(/\/$/, '');
    if (prefix && !str.startsWith(prefix)) str = prefix + str;
    if (str.length > 20) str = str.substring(0, 18) + '...';
    return str;
  };

  const handleSocialLink = (platform: string, link: string) => {
    if (!link) return;
    let url = link.trim();
    if (platform === 'instagram' && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://instagram.com/${url.replace('@', '')}`;
    } else if (platform === 'youtube' && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://youtube.com/@${url.replace('@', '')}`;
    } else if (platform === 'discord' && !url.startsWith('http://') && !url.startsWith('https://')) {
      Alert.alert('Discord Tag', `Discord ID: ${link}`);
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Social Link', `${platform}: ${link}`));
  };

  const getStatusBadge = (statusStr?: string, regEnd?: string, regStart?: string) => {
    const s = String(statusStr || '').toLowerCase().trim();
    if (s === 'completed' || s === 'closed' || s === 'finished' || s === 'ended') {
      return { label: 'CLOSED', bg: '#4B5563', dot: false };
    }

    const now = Date.now();
    const parsedEnd = parseCustomDate(regEnd);
    if (parsedEnd && now > parsedEnd) {
      return { label: 'CLOSED', bg: '#4B5563', dot: false };
    }

    const parsedStart = parseCustomDate(regStart);
    if (parsedStart && now < parsedStart) {
      return { label: 'UPCOMING', bg: '#16A34A', dot: true };
    }

    if (s === 'live' || s === 'running' || s === 'active') {
      return { label: 'LIVE', bg: '#E51025', dot: true };
    }

    if (s === 'upcoming' || s === 'open') {
      return { label: 'UPCOMING', bg: '#16A34A', dot: true };
    }

    if (parsedStart && parsedEnd && now >= parsedStart && now <= parsedEnd) {
      return { label: 'LIVE', bg: '#E51025', dot: true };
    }

    return { label: 'UPCOMING', bg: '#16A34A', dot: true };
  };

  const [deletingTournamentId, setDeletingTournamentId] = useState<string | number | null>(null);

  const isTournamentCreator = useCallback((t: any): boolean => {
    if (!t) return false;
    const currentUid = String(userProfile?.id || currentUserId || '').replace(/^user_|^usr_|^u_/, '').trim();
    if (!currentUid || currentUid === 'guest') return false;
    const creatorUid = String(t.user_id || t.userId || t.created_by || '').replace(/^user_|^usr_|^u_/, '').trim();
    return !!creatorUid && currentUid === creatorUid;
  }, [userProfile?.id, currentUserId]);

  const handleDeleteTournament = (t: any) => {
    if (!isTournamentCreator(t)) {
      Alert.alert('Permission Denied', 'Only the tournament creator can delete this tournament.');
      return;
    }

    Alert.alert(
      'Delete Tournament',
      'Are you sure you want to delete this tournament?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentUid = String(userProfile?.id || currentUserId || '').replace(/^user_|^usr_|^u_/, '').trim();
            setDeletingTournamentId(t.id);
            try {
              const res = await apiService.deleteTournament(t.id, currentUid);
              if (res && res.status === false) {
                Alert.alert('Error', res.message || 'Failed to delete tournament');
                return;
              }
              if (deleteTournament) {
                deleteTournament(t.id);
              }
              setMyTournaments(prev => prev.filter(item => String(item.id) !== String(t.id)));
              if (fetchTournaments) {
                fetchTournaments();
              }
              Alert.alert('Success', 'Tournament deleted successfully');
            } catch (err: any) {
              console.log('Error deleting tournament:', err);
              Alert.alert('Error', err?.message || 'Failed to delete tournament');
            } finally {
              setDeletingTournamentId(null);
            }
          }
        }
      ]
    );
  };

  const handleEditTournament = (item: any) => {
    const mapped = {
      id: item.id.toString(), name: item.name || '',
      organiserName: item.organiser_name || item.organiserName || '',
      game: item.game || '', prize: item.prize || '',
      teamsLimit: item.teams_limit?.toString() || item.teamsLimit?.toString() || '0',
      totalSlots: item.total_slots?.toString() || item.totalSlots?.toString() || '0',
      teamsPerGroup: item.teams_per_group?.toString() || item.teamsPerGroup?.toString() || '0',
      numberOfGroups: item.number_of_groups?.toString() || item.numberOfGroups?.toString() || '0',
      regStartDate: item.registration_start_date || item.regStartDate || '',
      regEndDate: item.registration_end_date || item.regEndDate || '',
      roadmap: item.roadmap || '', time: item.time || '',
      matchDate: item.match_date || item.matchDate || '',
      bannerImage: item.banner_image || item.bannerImage || null,
      status: item.status || 'upcoming',
      selectedFlyers: item.selected_flyers || item.selectedFlyers || {},
      stages: item.stages || [], matchDatesObj: item.match_dates_obj || item.matchDatesObj || {},
      killsPoint: item.kills_point || item.killsPoint || 1, positions: item.positions || []
    };
    navigation.navigate('CreateTournament', { isEdit: true, tournament: mapped });
  };

  const requireLogin = (cb: () => void) => {
    // Seamless access for tournament organizer creation
    cb();
  };

  const renderRegisteredCard = (item: any, i: number) => {
    const tDetails = item.tournamentDetails || {};
    const tName = item.name || tDetails.name || 'Tournament Match';
    const orgName = item.organiserName || tDetails.organiserName || 'UPMI Esports';
    const game = item.game || tDetails.game || 'BGMI';
    const banner = item.bannerImage || tDetails.bannerImage || item.teamBanner;
    const prize = item.prize || tDetails.prize || 'Prize TBD';
    const totalSlotsVal = item.totalSlots || tDetails.totalSlots || '100';
    const statusVal = item.status || tDetails.status || 'Active';
    const regStart = item.regStartDate || tDetails.regStartDate;
    const regEnd = item.regEndDate || tDetails.regEndDate || item.time || tDetails.time;
    const statusBadge = getStatusBadge(statusVal, regEnd, regStart);
    const tId = item.tournamentId || item.id;
    const insta = item.socialMedia1 || tDetails.socialMedia1;
    const yt = item.socialMedia2 || tDetails.socialMedia2;
    const discord = item.socialMedia3 || tDetails.socialMedia3;

    return (
      <View key={item.id || i} style={s.card}>
        {/* POSTER BANNER (FITTED FOR MOBILE) */}
        {banner ? (
          <View style={s.bannerContainer}>
            <Image
              source={{ uri: banner }}
              style={s.cardBanner}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* TOP BADGES ROW */}
        <View style={s.cardTopRow}>
          
          <View style={s.entryBadge}>
            <Icon name="checkmark-circle" size={13} color="#16A34A" style={{ marginRight: 3 }} />
            <Text style={s.entryBadgeText}>REGISTERED</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusBadge.bg }]}>
            {statusBadge.dot && <View style={s.statusDot} />}
            <Text style={s.statusText}>{statusBadge.label}</Text>
          </View>
        </View>

        {/* ORGANISATION NAME (BIGGER & HIGHLIGHTED) */}
        <View style={s.orgRow}>
          <Icon name="shield-checkmark" size={15} color="#E51025" style={{ marginRight: 5 }} />
          <Text style={s.orgName} numberOfLines={1}>{orgName.toUpperCase()}</Text>
          <View style={s.presentsPill}>
            <Text style={s.presentsText}>PRESENTS</Text>
          </View>
        </View>

        {/* TOURNAMENT NAME */}
        <Text style={s.tournamentName} numberOfLines={2}>{tName}</Text>

        {/* REGISTERED TEAM DETAILS BOX */}
        <View style={s.teamDetailsBox}>
          <View style={s.teamHeaderRow}>
            <View style={s.teamIconBox}>
              <Icon name="people" size={18} color="#E51025" />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={s.teamLabel}>YOUR REGISTERED TEAM</Text>
              <Text style={s.teamNameText} numberOfLines={1}>{item.teamName || 'Team Registered'}</Text>
            </View>
            <View style={s.slotBadge}>
              <Text style={s.slotBadgeText}>Slot #{item.slot || '1'}</Text>
            </View>
          </View>

          <View style={s.teamMetaRow}>
            <View style={s.teamMetaItem}>
              <Icon name="map-outline" size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={s.teamMetaText}>{item.map || 'Erangel'}</Text>
            </View>
            <View style={s.teamMetaItem}>
              <Icon name="person-circle-outline" size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={s.teamMetaText}>
                {item.players?.length ? `${item.players.length} Players` : '4 Players Squad'}
              </Text>
            </View>
          </View>
        </View>

        {/* DATES (OPENING & END DATE) */}
        <View style={s.datesRow}>
          <View style={s.dateCol}>
            <Icon name="calendar-outline" size={13} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={s.dateLabel}>Reg: </Text>
            <Text style={s.dateValue}>{regStart || 'Opened'} - {regEnd || 'Closing Soon'}</Text>
          </View>
        </View>

        {/* PRIZE POOL & SLOTS */}
        <View style={s.prizePill}>
          <View style={s.trophyIconBox}>
            <Icon name="trophy" size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={s.prizeLabel}>TOTAL PRIZE POOL</Text>
            <Text style={s.prizeText}>{prize}</Text>
          </View>
          <View style={s.slotsChip}>
            <Icon name="people" size={12} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={s.slotsText}>{totalSlotsVal} Slots</Text>
            <Text style={s.slotsSubText}>(Limited)</Text>
          </View>
        </View>

        {/* SOCIAL MEDIA ON TOURNAMENT */}
        {(insta || yt || discord) && (
          <View style={s.socialMediaRow}>
            <Text style={s.socialMediaLabel}>Social Media:</Text>
            <View style={s.socialBadgesGroup}>
              {!!insta && (
                <TouchableOpacity 
                  style={[s.socialPill, { borderColor: '#E1306C' }]} 
                  onPress={() => handleSocialLink('instagram', insta)}
                  activeOpacity={0.7}
                >
                  <Icon name="logo-instagram" size={13} color="#E1306C" style={{ marginRight: 4 }} />
                  <Text style={[s.socialPillText, { color: '#E1306C' }]}>{getSocialDisplay(insta, '@') || '@stg_esports'}</Text>
                </TouchableOpacity>
              )}
              {!!yt && (
                <TouchableOpacity 
                  style={[s.socialPill, { borderColor: '#FF0000' }]} 
                  onPress={() => handleSocialLink('youtube', yt)}
                  activeOpacity={0.7}
                >
                  <Icon name="logo-youtube" size={13} color="#FF0000" style={{ marginRight: 4 }} />
                  <Text style={[s.socialPillText, { color: '#FF0000' }]}>{getSocialDisplay(yt) || 'STG Esports Live'}</Text>
                </TouchableOpacity>
              )}
              {!!discord && (
                <TouchableOpacity 
                  style={[s.socialPill, { borderColor: '#5865F2' }]} 
                  onPress={() => handleSocialLink('discord', discord)}
                  activeOpacity={0.7}
                >
                  <Icon name="logo-discord" size={13} color="#5865F2" style={{ marginRight: 4 }} />
                  <Text style={[s.socialPillText, { color: '#5865F2' }]}>{getSocialDisplay(discord) || 'Discord'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ACTION BUTTONS */}
        <View style={s.actionRow}>
          <TouchableOpacity 
            style={s.actionBtnPrimary} 
            onPress={() => navigation.navigate('RegisteredTeams', { tournamentId: tId, tournamentName: tName })}
            activeOpacity={0.85}
          >
            <Icon name="list" size={15} color="#fff" style={{ marginRight: 5 }} />
            <Text style={s.actionBtnPrimaryText}>View Bracket & Slots</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
      <StatusBar barStyle="light-content" backgroundColor="#E51025" />

      {/* ── HERO HEADER ── */}
      <View style={s.heroHeader}>
        <View>
          <Text style={s.heroTitle}>Matches</Text>
          <Text style={s.heroSub}>
            {activeTab === 'Matches' ? 'Your Registered Tournaments & Scrims' : 'Tournaments Organized By You'}
          </Text>
        </View>
        {activeTab === 'Tournaments' && (
          <TouchableOpacity onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))} style={s.createBtn}>
            <Icon name="add" size={16} color="#fff" />
            <Text style={s.createBtnText}>Create</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── SEGMENTED CONTROL ── */}
      <View style={s.tabWrap}>
        <View style={s.segControl}>
          <TouchableOpacity
            style={[s.segBtn, activeTab === 'Matches' && s.segBtnActive]}
            onPress={() => setActiveTab('Matches')}
          >
            <Icon
              name="game-controller-outline"
              size={16} 
              color={activeTab === 'Matches' ? '#fff' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.segText, activeTab === 'Matches' && s.segTextActive]}>Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.segBtn, activeTab === 'Tournaments' && s.segBtnActive]}
            onPress={() => setActiveTab('Tournaments')}
          >
            <Icon
              name="trophy-outline"
              size={16} 
              color={activeTab === 'Tournaments' ? '#fff' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.segText, activeTab === 'Tournaments' && s.segTextActive]}>
              My Tournaments
            </Text>
          </TouchableOpacity>
        </View>


      </View>

      {/* ── CONTENT ── */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40, paddingTop: 12 }} showsVerticalScrollIndicator={false}>

        {activeTab === 'Matches' ? (
          combinedRegistrations.length > 0 ? (
            <>
              <Text style={s.sectionLabel}>Registered Tournaments ({combinedRegistrations.length})</Text>
              {combinedRegistrations.map((item, i) => renderRegisteredCard(item, i))}
            </>
          ) : (
            /* Empty state ── Matches */
            <View style={s.emptyWrap}>
              <View style={s.emptyIconCircle}>
                <Icon name="game-controller-outline" size={42} color={colors.primary} />
                <View style={s.emptyVsBadge}><Text style={s.emptyVsText}>VS</Text></View>
              </View>
              <Text style={s.emptyTitle}>No registered tournaments found</Text>
              <Text style={s.emptyCaption}>
                You haven't registered for any tournaments yet. Check the Home page and register now!
              </Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Home')}>
                <Icon name="search-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={s.emptyBtnText}>Explore Tournaments</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          myTournaments.length > 0 ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>
                <Text style={[s.sectionLabel, { marginBottom: 0, marginTop: 0 }]}>Active Tournaments</Text>
                <TouchableOpacity onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))} style={{ backgroundColor: '#E51025', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="add" size={16} color="#fff" style={{ marginRight: 2 }} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Create</Text>
                </TouchableOpacity>
              </View>
              {myTournaments.map((t, i) => {
                const isCreator = isTournamentCreator(t);
                const isDeleting = deletingTournamentId === t.id;
                const slotVal = t.teams_per_group || t.teamsPerGroup || t.teams_limit || t.teamsLimit || '25';

                return (
                  <View key={t.id || i} style={s.card}>
                    {t.bannerImage ? (
                      <View style={s.bannerContainer}>
                        <Image
                          source={{ uri: t.bannerImage }}
                          style={s.cardBanner}
                          resizeMode="cover"
                        />
                      </View>
                    ) : null}

                    {/* TOP STATUS ROW */}
                    <View style={s.cardTopRow}>
                      <View style={[s.statusBadge, { backgroundColor: t.status === 'upcoming' ? '#16A34A' : '#E51025' }]}>
                        <Text style={s.statusText}>{(t.status || 'OPEN').toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={s.orgName}>{(t.organiser_name || t.organiserName || 'UPMI Esports').toUpperCase()}</Text>
                    <Text style={s.tournamentName}>{t.name}</Text>
                    {t.time ? <Text style={s.cardSub}><Icon name="time-outline" size={12} color="#6B7280" /> {t.time}</Text> : null}

                    {/* TOURNAMENT INFO BAR: PRIZE POOL (LEFT) & SLOTS (RIGHT) */}
                    <View style={s.prizePill}>
                      <View style={s.prizeLeft}>
                        <View style={s.trophyIconBox}>
                          <Icon name="trophy" size={16} color="#D97706" />
                        </View>
                        <View style={{ flexShrink: 1 }}>
                          <Text style={s.prizeLabel}>PRIZE POOL</Text>
                          <Text style={s.prizeText} numberOfLines={1}>{t.prize || 'TBD'}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={s.slotsGroupChip}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('RegisteredTeams', { tournamentId: t.id, tournamentName: t.name, tournament: t })}
                      >
                        <Icon name="people" size={14} color="#E51025" style={{ marginRight: 5 }} />
                        <Text style={s.slotsGroupText}>{slotVal} Slots / Group</Text>
                        <Icon name="chevron-forward" size={13} color="#E51025" style={{ marginLeft: 3 }} />
                      </TouchableOpacity>
                    </View>

                    <View style={s.actionRow}>
                      <TouchableOpacity 
                        style={[s.actionBtnPrimary, { flex: 1.2, backgroundColor: '#E51025' }]} 
                        onPress={() => navigation.navigate('RegisteredTeams', { tournamentId: t.id, tournamentName: t.name, tournament: t })}
                      >
                        <Icon name="grid-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={s.actionBtnPrimaryText}>Slot List</Text>
                      </TouchableOpacity>
                      {isCreator && (
                        <TouchableOpacity 
                          style={[s.actionBtnOutline, { flex: 1 }]} 
                          onPress={() => handleEditTournament(t)}
                        >
                          <Icon name="pencil-outline" size={14} color="#374151" style={{ marginRight: 4 }} />
                          <Text style={s.actionBtnOutlineText}>Edit</Text>
                        </TouchableOpacity>
                      )}
                      {isCreator && (
                        <TouchableOpacity 
                          style={[s.actionBtnOutline, { flex: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]} 
                          onPress={() => handleDeleteTournament(t)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color="#DC2626" />
                          ) : (
                            <>
                              <Icon name="trash-outline" size={14} color="#DC2626" style={{ marginRight: 4 }} />
                              <Text style={[s.actionBtnOutlineText, { color: '#DC2626', fontWeight: '700' }]}>Delete</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            /* Empty state ── Tournaments */
            <View style={s.emptyWrap}>
              <View style={[s.emptyIconCircle, { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
                <Icon name="trophy-outline" size={42} color="#D97706" />
                <View style={[s.emptyVsBadge, { backgroundColor: '#D97706' }]}>
                  <Icon name="star" size={10} color="#fff" />
                </View>
              </View>
              <Text style={s.emptyTitle}>UPMI Championship Cup</Text>
              <Text style={s.emptySub}>Join existing leagues or register a new series bracket</Text>
              <Text style={s.emptyCaption}>You haven't created any tournaments yet. Create a new bracket and invite teams!</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))}>
                <Icon name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={s.emptyBtnText}>Create Tournament</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.emptyBtnOutline} onPress={() => navigation.navigate('Home')}>
                <Text style={s.emptyBtnOutlineText}>Explore Tournaments</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  /* HERO */
  heroHeader: {
    backgroundColor: '#E51025', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 3 },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  createBtnText: { color: '#fff', fontWeight: '800', fontSize: 13, marginLeft: 4 },

  /* TABS */
  tabWrap: {
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  segControl: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 14, padding: 4 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
  segBtnActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  segText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  segTextActive: { color: '#fff' },

  /* FILTER CHIPS */
  filterChipsContainer: { flexDirection: 'row', gap: 8, marginTop: 10, paddingBottom: 4 },
  chip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  chipTextActive: { color: '#FFF' },

  /* SECTION LABEL */
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12, marginTop: 4 },

  /* CARD */
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  bannerContainer: { width: '100%', height: 160, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  cardBanner: { width: '100%', height: '100%' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  gameBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' },
  gameBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  entryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  entryBadgeText: { color: '#16A34A', fontSize: 10, fontWeight: '800' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 5 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  /* ORGANISATION & TOURNAMENT NAME */
  orgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  orgName: { fontSize: 15, color: '#E51025', fontWeight: '900', letterSpacing: 0.3, flexShrink: 1 },
  presentsPill: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
  presentsText: { color: '#DC2626', fontSize: 9, fontWeight: '800' },
  tournamentName: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8, lineHeight: 26 },
  cardSub: { fontSize: 12, color: '#6B7280', marginBottom: 10 },

  /* REGISTERED TEAM BOX */
  teamDetailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10
  },
  teamHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  teamIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  teamLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.5 },
  teamNameText: { fontSize: 15, fontWeight: '800', color: '#111827' },
  slotBadge: { backgroundColor: '#111827', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  slotBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  teamMetaRow: { flexDirection: 'row', gap: 14, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  teamMetaItem: { flexDirection: 'row', alignItems: 'center' },
  teamMetaText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },

  /* DATES */
  datesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10,
    marginBottom: 10
  },
  dateCol: { flexDirection: 'row', alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  dateValue: { fontSize: 11, color: '#111827', fontWeight: '800' },

  /* PRIZE */
  prizePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  prizeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trophyIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  prizeLabel: { fontSize: 10, color: '#92400E', fontWeight: '800', letterSpacing: 0.5 },
  prizeText: { fontSize: 16, fontWeight: '900', color: '#B45309' },
  slotsChip: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 8,
  },
  slotsText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  slotsSubText: { color: '#9CA3AF', fontSize: 9, fontWeight: '600' },

  /* SOCIAL MEDIA */
  socialMediaRow: { marginBottom: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  socialMediaLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6 },
  socialBadgesGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  socialPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1, backgroundColor: '#FAFAFA' },
  socialPillText: { fontSize: 11, fontWeight: '700' },

  /* SLOT LIST BANNER BTN */
  cardDeleteIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotsGroupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    flexShrink: 0,
    marginLeft: 8,
  },
  slotsGroupText: {
    color: '#E51025',
    fontSize: 12,
    fontWeight: '700',
  },
  slotListBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  slotListBannerBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E51025',
  },
  slotListTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  slotListTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E51025',
    marginRight: 4,
  },

  /* ACTION ROW */
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtnPrimary: { flex: 1, flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  actionBtnPrimaryText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  actionBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 30 },
  actionBtnOutlineText: { color: '#374151', fontWeight: '700', fontSize: 13 },

  /* EMPTY */
  emptyWrap: { alignItems: 'center', paddingTop: 40 },
  emptyIconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, position: 'relative',
  },
  emptyVsBadge: { position: 'absolute', bottom: -2, right: 6, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  emptyVsText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  emptyTitle: { fontSize: 19, fontWeight: '900', color: '#111827', marginBottom: 6, textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 10, paddingHorizontal: 20 },
  emptyCaption: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 24, paddingHorizontal: 30, lineHeight: 20 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30, marginBottom: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  emptyBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  emptyBtnOutline: { borderWidth: 1.5, borderColor: '#D1D5DB', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 30 },
  emptyBtnOutlineText: { color: '#6B7280', fontWeight: '700', fontSize: 14 },
});

export default MatchesScreen;
