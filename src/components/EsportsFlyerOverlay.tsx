import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatSocialHandle } from '../utils/socialUtils';
import PointsTableOverlay from './PointsTableOverlay';
import { PointCalcTeam } from './PointCalcModal';

interface EsportsFlyerOverlayProps {
  category: string;
  organiserName?: string;
  eventName?: string;
  subName?: string;
  eventLogo?: string | null;
  socials?: {
    instagram?: string;
    youtube?: string;
    discord?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  pointCalcData?: {
    systemType?: string;
    killPoints?: number;
    matchNumber?: string;
    mapName?: string;
    teams?: PointCalcTeam[];
  };
  fieldsData?: any;
  isThumbnail?: boolean;
}

export const EsportsFlyerOverlay: React.FC<EsportsFlyerOverlayProps> = ({
  category,
  organiserName = 'STG ESPORTS',
  eventName = 'STG OP CHAMPIONSHIP',
  subName = 'GROUP 1',
  eventLogo = null,
  socials = {},
  pointCalcData,
  fieldsData = {},
  isThumbnail = false,
}) => {
  const cleanOrg = (organiserName || 'STG ESPORTS').toUpperCase();
  const cleanEvent = (eventName || 'STG OP CHAMPIONSHIP').toUpperCase();
  const cleanSub = (subName || 'GROUP 1').toUpperCase();

  const instaHandle = formatSocialHandle('instagram', socials.instagram || 'stgesports.in');
  const ytHandle = formatSocialHandle('youtube', socials.youtube || 'stgesports');
  const dcHandle = formatSocialHandle('discord', socials.discord || 'Stg_ Esports');

  // If Event Calculation: render the overall standings table (Screenshots 4 & 5 style)
  if (category === 'Event Calculation') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Top Header */}
        <View style={[styles.topBar, isThumbnail && styles.topBarThumb]}>
          <View style={styles.topBarLeft}>
            {eventLogo ? (
              <View style={[styles.logoBox, isThumbnail && styles.logoBoxThumb]}>
                <Image source={{ uri: eventLogo }} style={styles.logoImg} resizeMode="contain" />
              </View>
            ) : (
              <View style={[styles.logoBox, isThumbnail && styles.logoBoxThumb]}>
                <Icon name="shield-checkmark" size={isThumbnail ? 12 : 20} color="#E51025" />
              </View>
            )}
            <View style={{ marginLeft: isThumbnail ? 4 : 8 }}>
              <Text style={[styles.orgNameText, isThumbnail && styles.orgNameTextThumb]} numberOfLines={1}>
                {cleanOrg}
              </Text>
              <Text style={[styles.presentsText, isThumbnail && styles.presentsTextThumb]}>
                PRESENTS
              </Text>
            </View>
          </View>

          <View style={styles.topBarCenter}>
            <Text style={[styles.eventTitleText, isThumbnail && styles.eventTitleTextThumb]} numberOfLines={1}>
              {cleanEvent}
            </Text>
            <Text style={[styles.subTitleText, isThumbnail && styles.subTitleTextThumb]} numberOfLines={1}>
              {cleanSub}
            </Text>
          </View>
        </View>

        {/* Points Table in Middle */}
        <View style={styles.tableContainer}>
          <PointsTableOverlay
            teams={pointCalcData?.teams || []}
            eventName={cleanEvent}
            subName={cleanSub}
            matchInfo={pointCalcData?.matchNumber || 'Match 1'}
            mapName={pointCalcData?.mapName || 'Erangel'}
          />
        </View>

        {/* Footer with BGMI & Socials */}
        <View style={[styles.bottomBar, isThumbnail && styles.bottomBarThumb]}>
          <View style={[styles.bgmiBadge, isThumbnail && styles.bgmiBadgeThumb]}>
            <Text style={[styles.bgmiText, isThumbnail && styles.bgmiTextThumb]}>BGMI</Text>
            <Text style={[styles.bgmiSubText, isThumbnail && styles.bgmiSubTextThumb]}>ESPORTS</Text>
          </View>

          <View style={styles.socialsGroup}>
            {!!instaHandle && (
              <View style={styles.socialItem}>
                <Icon name="logo-instagram" size={isThumbnail ? 8 : 12} color="#E1306C" style={{ marginRight: 3 }} />
                <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                  {instaHandle}
                </Text>
              </View>
            )}
            {!!ytHandle && (
              <View style={styles.socialItem}>
                <Icon name="logo-youtube" size={isThumbnail ? 8 : 12} color="#FF0000" style={{ marginRight: 3 }} />
                <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                  {ytHandle}
                </Text>
              </View>
            )}
            {!!dcHandle && (
              <View style={styles.socialItem}>
                <Icon name="logo-discord" size={isThumbnail ? 8 : 12} color="#5865F2" style={{ marginRight: 3 }} />
                <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                  {dcHandle}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Render Category Specific Body
  const renderCategoryBody = () => {
    // Parse dynamic prize pool
    const rawPrizeStr = String(fieldsData?.prizePool || fieldsData?.headline || '50000');
    const prizeNum = parseInt(rawPrizeStr.replace(/[^0-9]/g, '')) || 50000;
    const formattedPrize = '₹' + prizeNum.toLocaleString('en-IN');

    // Parse dynamic slots
    const totalSlotsVal = fieldsData?.totalSlots || '250';
    const teamsPerGroupVal = fieldsData?.teamsPerGroup || '18';
    const datesVal = fieldsData?.dates || 'STARTS SOON';

    // Parse dynamic roadmap stages
    const roadmapStages: string[] = (fieldsData?.stages && Array.isArray(fieldsData.stages) && fieldsData.stages.length > 0)
      ? fieldsData.stages.map((s: any) => (s.title || s.name || 'Stage').toUpperCase())
      : ['REGISTRATION', 'QUALIFIERS', 'SEMI FINALS', 'GRAND FINALS'];

    switch (category) {
      case 'Coming Soon':
        return (
          <View style={[styles.centerContent, { justifyContent: 'center', alignItems: 'center' }]}>
            {/* Center Event Logo Badge */}
            <View style={[styles.centerLogoCircle, isThumbnail && styles.centerLogoCircleThumb]}>
              {eventLogo ? (
                <Image source={{ uri: eventLogo }} style={styles.centerLogoImg} resizeMode="contain" />
              ) : (
                <Icon name="trophy" size={isThumbnail ? 20 : 38} color="#F59E0B" />
              )}
            </View>

            {/* Event Name */}
            <Text style={[styles.hugeEsportsTitle, isThumbnail && styles.hugeEsportsTitleThumb]} numberOfLines={2}>
              {cleanEvent}
            </Text>

            {/* Organiser Presenter Line */}
            <Text style={[styles.esportsSubTitle, isThumbnail && styles.esportsSubTitleThumb]}>
              ORGANIZED BY {cleanOrg}
            </Text>

            {/* Prize Pool Gold Badge */}
            <View style={[styles.goldPrizeBadge, isThumbnail && styles.goldPrizeBadgeThumb]}>
              <Icon name="cash" size={isThumbnail ? 9 : 15} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={[styles.goldPrizeText, isThumbnail && styles.goldPrizeTextThumb]}>
                PRIZE POOL {formattedPrize}
              </Text>
            </View>

            {/* Slots and Date Chips */}
            <View style={styles.metaRow}>
              <View style={[styles.metaChip, isThumbnail && styles.metaChipThumb]}>
                <Icon name="people" size={isThumbnail ? 7 : 11} color="#60A5FA" style={{ marginRight: 3 }} />
                <Text style={[styles.metaChipText, isThumbnail && styles.metaChipTextThumb]}>
                  {totalSlotsVal} SLOTS • {teamsPerGroupVal}/GRP
                </Text>
              </View>
              <View style={[styles.metaChip, isThumbnail && styles.metaChipThumb]}>
                <Icon name="calendar" size={isThumbnail ? 7 : 11} color="#34D399" style={{ marginRight: 3 }} />
                <Text style={[styles.metaChipText, isThumbnail && styles.metaChipTextThumb]}>
                  {datesVal}
                </Text>
              </View>
            </View>

            {/* Pulsing Status Pill */}
            <View style={[styles.neonPill, isThumbnail && { paddingHorizontal: 6, paddingVertical: 2, marginBottom: 2 }]}>
              <Text style={[styles.neonPillText, isThumbnail && { fontSize: 7, letterSpacing: 0.5 }]}>
                ⚡ REGISTRATION OPENS SOON • LIMITED SLOTS ⚡
              </Text>
            </View>
          </View>
        );

      case 'All You Need to Know':
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.categoryHeader, isThumbnail && styles.categoryHeaderThumb]}>
              ALL YOU NEED TO KNOW
            </Text>
            <View style={styles.infoGrid}>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>GAME</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]}>BGMI MOBILE</Text>
              </View>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>TOTAL SLOTS</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]}>{totalSlotsVal} TEAMS</Text>
              </View>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>PER GROUP</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]}>{teamsPerGroupVal} TEAMS</Text>
              </View>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>PRIZE POOL</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]}>{formattedPrize}</Text>
              </View>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>DATES</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]} numberOfLines={1}>{datesVal}</Text>
              </View>
              <View style={[styles.infoCard, isThumbnail && styles.infoCardThumb]}>
                <Text style={[styles.infoLabel, isThumbnail && { fontSize: 7 }]}>POINTS</Text>
                <Text style={[styles.infoVal, isThumbnail && { fontSize: 8 }]}>OFFICIAL 10-PTS</Text>
              </View>
            </View>
          </View>
        );

      case 'Prize Pool':
        return (
          <View style={styles.centerContent}>
            <View style={[styles.esportsBadge, { borderColor: '#F59E0B' }]}>
              <Icon name="trophy" size={isThumbnail ? 10 : 16} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={[styles.badgeText, { color: '#F59E0B' }, isThumbnail && { fontSize: 8 }]}>
                OFFICIAL CASH PRIZE
              </Text>
            </View>
            <Text style={[styles.headlineHighlight, { color: '#FFD700' }, isThumbnail && styles.headlineThumb]}>
              {formattedPrize}
            </Text>
            <View style={styles.neonPill}>
              <Text style={[styles.neonPillText, isThumbnail && { fontSize: 8 }]}>
                TOTAL PRIZE POOL
              </Text>
            </View>
            <Text style={[styles.subBannerText, isThumbnail && { fontSize: 8 }]}>
              TOP TEAMS TAKE THE GLORY & CASH REWARDS
            </Text>
          </View>
        );

      case 'Prize Distribution':
        const p1 = Math.round(prizeNum * 0.5);
        const p2 = Math.round(prizeNum * 0.3);
        const p3 = Math.round(prizeNum * 0.2);
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.categoryHeader, isThumbnail && styles.categoryHeaderThumb]}>
              PRIZE DISTRIBUTION
            </Text>
            <View style={styles.distributionCards}>
              <View style={[styles.distCard, { borderColor: '#FFD700' }, isThumbnail && styles.distCardThumb]}>
                <Text style={[styles.distRank, isThumbnail && { fontSize: 8 }]}>🥇 1ST PLACE</Text>
                <Text style={[styles.distAmount, isThumbnail && { fontSize: 9 }]}>{'₹' + p1.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.distCard, { borderColor: '#C0C0C0' }, isThumbnail && styles.distCardThumb]}>
                <Text style={[styles.distRank, isThumbnail && { fontSize: 8 }]}>🥈 2ND PLACE</Text>
                <Text style={[styles.distAmount, isThumbnail && { fontSize: 9 }]}>{'₹' + p2.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.distCard, { borderColor: '#CD7F32' }, isThumbnail && styles.distCardThumb]}>
                <Text style={[styles.distRank, isThumbnail && { fontSize: 8 }]}>🥉 3RD PLACE</Text>
                <Text style={[styles.distAmount, isThumbnail && { fontSize: 9 }]}>{'₹' + p3.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        );

      case 'Event Road Map':
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.categoryHeader, isThumbnail && styles.categoryHeaderThumb]}>
              TOURNAMENT ROADMAP
            </Text>
            <View style={styles.roadmapRow}>
              {roadmapStages.map((stage, idx) => (
                <View key={stage + '_' + idx} style={[styles.roadmapStep, isThumbnail && styles.roadmapStepThumb]}>
                  <View style={[styles.stepDot, isThumbnail && { width: 14, height: 14 }]}>
                    <Text style={{ color: '#000', fontSize: isThumbnail ? 7 : 9, fontWeight: '900' }}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, isThumbnail && { fontSize: 6 }]} numberOfLines={1}>{stage}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'Map Schedule':
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.categoryHeader, isThumbnail && styles.categoryHeaderThumb]}>
              OFFICIAL MATCH SCHEDULE
            </Text>
            <View style={styles.scheduleGrid}>
              {[
                { match: 'MATCH 1', map: 'ERANGEL', time: fieldsData?.matchTime || '02:00 PM' },
                { match: 'MATCH 2', map: 'MIRAMAR', time: '03:15 PM' },
                { match: 'MATCH 3', map: 'SANHOK', time: '04:30 PM' },
                { match: 'MATCH 4', map: 'ERANGEL', time: '05:45 PM' },
              ].map(item => (
                <View key={item.match} style={[styles.scheduleItem, isThumbnail && styles.scheduleItemThumb]}>
                  <Text style={[styles.schedMatch, isThumbnail && { fontSize: 7 }]}>{item.match}</Text>
                  <Text style={[styles.schedMap, isThumbnail && { fontSize: 8 }]}>{item.map}</Text>
                  <Text style={[styles.schedTime, isThumbnail && { fontSize: 6 }]}>{item.time}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'Live Casting':
        return (
          <View style={styles.centerContent}>
            <View style={[styles.livePulsingBadge, isThumbnail && styles.livePulsingBadgeThumb]}>
              <View style={styles.liveRedDot} />
              <Text style={[styles.liveBadgeText, isThumbnail && { fontSize: 8 }]}>LIVE STREAMING</Text>
            </View>
            <Text style={[styles.headlineHighlight, { color: '#FF3366' }, isThumbnail && styles.headlineThumb]}>
              WATCH LIVE CASTING
            </Text>
            <Text style={[styles.subBannerText, isThumbnail && { fontSize: 8 }]}>
              EXCLUSIVE CASTING & HIGHLIGHTS ON YOUTUBE
            </Text>
          </View>
        );

      case 'Caster Reveal':
        return (
          <View style={styles.centerContent}>
            <View style={[styles.esportsBadge, { borderColor: '#E51025' }]}>
              <Icon name="mic" size={isThumbnail ? 10 : 16} color="#E51025" style={{ marginRight: 4 }} />
              <Text style={[styles.badgeText, { color: '#E51025' }, isThumbnail && { fontSize: 8 }]}>
                OFFICIAL BROADCAST TALENT
              </Text>
            </View>
            <Text style={[styles.headlineHighlight, isThumbnail && styles.headlineThumb]}>
              CASTER REVEAL
            </Text>
            <Text style={[styles.subBannerText, isThumbnail && { fontSize: 8 }]}>
              VOICE OF THE BATTLEGROUNDS
            </Text>
          </View>
        );

      case 'Team Preview':
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.categoryHeader, isThumbnail && styles.categoryHeaderThumb]}>
              QUALIFIED TEAMS PREVIEW
            </Text>
            <View style={[styles.neonPill, { borderColor: '#10B981' }]}>
              <Text style={[styles.neonPillText, { color: '#10B981' }, isThumbnail && { fontSize: 8 }]}>
                TOP TEAMS LOCKED IN
              </Text>
            </View>
            <Text style={[styles.subBannerText, isThumbnail && { fontSize: 8 }]}>
              WHO WILL CLAIM THE ULTIMATE CHICKEN DINNER?
            </Text>
          </View>
        );

      default:
        return (
          <View style={styles.centerContent}>
            <Text style={[styles.headlineHighlight, isThumbnail && styles.headlineThumb]}>
              {category.toUpperCase()}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Header Row (Logo, Organiser, Event Name) */}
      <View style={[styles.topBar, isThumbnail && styles.topBarThumb]}>
        <View style={styles.topBarLeft}>
          {eventLogo ? (
            <View style={[styles.logoBox, isThumbnail && styles.logoBoxThumb]}>
              <Image source={{ uri: eventLogo }} style={styles.logoImg} resizeMode="contain" />
            </View>
          ) : (
            <View style={[styles.logoBox, isThumbnail && styles.logoBoxThumb]}>
              <Icon name="shield-checkmark" size={isThumbnail ? 12 : 20} color="#E51025" />
            </View>
          )}
          <View style={{ marginLeft: isThumbnail ? 4 : 8 }}>
            <Text style={[styles.orgNameText, isThumbnail && styles.orgNameTextThumb]} numberOfLines={1}>
              {cleanOrg}
            </Text>
            <Text style={[styles.presentsText, isThumbnail && styles.presentsTextThumb]}>
              PRESENTS
            </Text>
          </View>
        </View>

        <View style={styles.topBarCenter}>
          <Text style={[styles.eventTitleText, isThumbnail && styles.eventTitleTextThumb]} numberOfLines={1}>
            {cleanEvent}
          </Text>
          <Text style={[styles.subTitleText, isThumbnail && styles.subTitleTextThumb]} numberOfLines={1}>
            {cleanSub}
          </Text>
        </View>
      </View>

      {/* Middle Category Specific Body */}
      <View style={styles.bodyContainer}>
        {renderCategoryBody()}
      </View>

      {/* Footer with BGMI & Clean Social Handles */}
      <View style={[styles.bottomBar, isThumbnail && styles.bottomBarThumb]}>
        <View style={[styles.bgmiBadge, isThumbnail && styles.bgmiBadgeThumb]}>
          <Text style={[styles.bgmiText, isThumbnail && styles.bgmiTextThumb]}>BGMI</Text>
          <Text style={[styles.bgmiSubText, isThumbnail && styles.bgmiSubTextThumb]}>OFFICIAL</Text>
        </View>

        <View style={styles.socialsGroup}>
          {!!instaHandle && (
            <View style={styles.socialItem}>
              <Icon name="logo-instagram" size={isThumbnail ? 8 : 12} color="#E1306C" style={{ marginRight: 3 }} />
              <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                {instaHandle}
              </Text>
            </View>
          )}
          {!!ytHandle && (
            <View style={styles.socialItem}>
              <Icon name="logo-youtube" size={isThumbnail ? 8 : 12} color="#FF0000" style={{ marginRight: 3 }} />
              <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                {ytHandle}
              </Text>
            </View>
          )}
          {!!dcHandle && (
            <View style={styles.socialItem}>
              <Icon name="logo-discord" size={isThumbnail ? 8 : 12} color="#5865F2" style={{ marginRight: 3 }} />
              <Text style={[styles.socialText, isThumbnail && styles.socialTextThumb]} numberOfLines={1}>
                {dcHandle}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  /* Center Coming Soon Branding */
  centerLogoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  centerLogoCircleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 2,
  },
  centerLogoImg: {
    width: '90%',
    height: '90%',
  },
  hugeEsportsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00F0FF',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  hugeEsportsTitleThumb: {
    fontSize: 9,
    marginBottom: 1,
  },
  esportsSubTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5E7EB',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  esportsSubTitleThumb: {
    fontSize: 5,
    marginBottom: 2,
  },
  goldPrizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },
  goldPrizeBadgeThumb: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    marginBottom: 2,
  },
  goldPrizeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  goldPrizeTextThumb: {
    fontSize: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  metaChipThumb: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  metaChipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  metaChipTextThumb: {
    fontSize: 5,
  },

  /* TOP BAR */
  topBar: {
    position: 'absolute',
    top: '3.5%',
    left: '4%',
    right: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topBarThumb: {
    top: '2%',
    left: '3%',
    right: '3%',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  logoBoxThumb: {
    width: 20,
    height: 20,
    borderRadius: 4,
    padding: 1,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  orgNameText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  orgNameTextThumb: {
    fontSize: 7,
  },
  presentsText: {
    color: '#E51025',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  presentsTextThumb: {
    fontSize: 5,
  },
  topBarCenter: {
    alignItems: 'flex-end',
  },
  eventTitleText: {
    color: '#00F0FF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  eventTitleTextThumb: {
    fontSize: 8,
  },
  subTitleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  subTitleTextThumb: {
    fontSize: 6,
  },

  /* BODY */
  bodyContainer: {
    position: 'absolute',
    top: '22%',
    bottom: '15%',
    left: '5%',
    right: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    position: 'absolute',
    top: '18%',
    bottom: '13%',
    left: '2%',
    right: '2%',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  esportsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headlineHighlight: {
    fontSize: 26,
    fontWeight: '900',
    color: '#00F0FF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  headlineThumb: {
    fontSize: 12,
    marginBottom: 2,
  },
  neonPill: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#00F0FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  neonPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  featureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  featureChip: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureChipThumb: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  featureChipText: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: '700',
  },
  subBannerText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  categoryHeaderThumb: {
    fontSize: 9,
    marginBottom: 4,
  },

  /* INFO GRID */
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  infoCard: {
    width: '46%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  infoCardThumb: {
    width: '46%',
    padding: 3,
  },
  infoLabel: {
    color: '#00F0FF',
    fontSize: 9,
    fontWeight: '900',
  },
  infoVal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },

  /* PRIZE DISTRIBUTION CARDS */
  distributionCards: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  distCard: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  distCardThumb: {
    padding: 3,
  },
  distRank: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  distAmount: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },

  /* ROADMAP */
  roadmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roadmapStep: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  roadmapStepThumb: {
    paddingHorizontal: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },

  /* SCHEDULE */
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    width: '100%',
  },
  scheduleItem: {
    width: '46%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderLeftWidth: 3,
    borderLeftColor: '#E51025',
    borderRadius: 6,
    padding: 6,
  },
  scheduleItemThumb: {
    padding: 2,
  },
  schedMatch: {
    color: '#E51025',
    fontSize: 9,
    fontWeight: '900',
  },
  schedMap: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  schedTime: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '600',
  },

  /* LIVE PULSING */
  livePulsingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 16, 37, 0.2)',
    borderWidth: 1,
    borderColor: '#E51025',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  livePulsingBadgeThumb: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  liveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E51025',
    marginRight: 6,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: '4%',
    left: '4%',
    right: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bottomBarThumb: {
    bottom: '2%',
    left: '2%',
    right: '2%',
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 5,
  },
  bgmiBadge: {
    backgroundColor: '#E51025',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  bgmiBadgeThumb: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
  },
  bgmiText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bgmiTextThumb: {
    fontSize: 6,
  },
  bgmiSubText: {
    color: '#FDE68A',
    fontSize: 6,
    fontWeight: '800',
  },
  bgmiSubTextThumb: {
    fontSize: 4,
  },
  socialsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  socialTextThumb: {
    fontSize: 6,
  },
});
