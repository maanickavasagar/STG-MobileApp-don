export const FLYER_IMAGES = {
  bgmi1: require('../assets/images/flyers/custom_bgmi_1.jpg'),
  bgmi2: require('../assets/images/flyers/custom_bgmi_2.jpg'),
  bgmiPoster: require('../assets/images/bgmi_poster.jpg'),
  bgmiBanner1: require('../assets/images/bgmi_banner1.jpg'),
  bgmiBanner2: require('../assets/images/bgmi_banner2.jpg'),
  bgmiLogin: require('../assets/images/bgmi_login_bg.jpg'),
  banner1: require('../assets/images/banner1.jpg'),
  banner2: require('../assets/images/banner2.jpg'),
  banner3: require('../assets/images/banner3.jpg'),
  storeBg: require('../assets/images/store_bg.jpg'),
  comingSoon1: require('../assets/images/flyers/coming_soon_1.jpg'),
  comingSoon2: require('../assets/images/flyers/coming_soon_2.jpg'),
  comingSoon3: require('../assets/images/flyers/coming_soon_3.jpg'),
  comingSoon4: require('../assets/images/flyers/coming_soon_4.jpg'),
  comingSoon5: require('../assets/images/flyers/coming_soon_5.jpg'),
};

// 5 Standardized (1080x1350) BGMI Coming Soon Flyers (Exclusively for Coming Soon)
export const COMING_SOON_FLYERS = [
  FLYER_IMAGES.comingSoon1,
  FLYER_IMAGES.comingSoon2,
  FLYER_IMAGES.comingSoon3,
  FLYER_IMAGES.comingSoon4,
  FLYER_IMAGES.comingSoon5,
];

// Curated BGMI images for all other flyer categories (Never mixed with Coming Soon)
const BGMI_IMAGES_LIST = [
  FLYER_IMAGES.bgmi2,
  FLYER_IMAGES.bgmi1,
  FLYER_IMAGES.bgmiPoster,
  FLYER_IMAGES.bgmiBanner1,
  FLYER_IMAGES.bgmiBanner2,
  FLYER_IMAGES.bgmiLogin,
  FLYER_IMAGES.banner1,
  FLYER_IMAGES.banner2,
];

export const FLYER_CATEGORIES = [
  'Coming Soon',
  'All You Need to Know',
  'Prize Pool',
  'Prize Distribution',
  'Event Calculation',
  'Event Road Map',
  'Map Schedule',
  'Live Casting',
  'Caster Reveal',
  'Team Preview'
];

export interface FlyerField {
  name: string;
  label: string;
  default: string;
  y: string;
  x?: string;
  fontSize: number;
  color: string;
  fontWeight?: string;
}

export interface FlyerTemplate {
  id: string;
  name: string;
  category: string;
  image: any;
  layoutVariant: number;
  logoPos: { x: string; y: string; size: number };
  socialPos: { x: string; y: string; color: string; size: number };
  fields: FlyerField[];
}

const getCategoryHeadline = (category: string, index: number): string => {
  switch (category) {
    case 'Coming Soon':
      return index % 2 === 0 ? 'COMING SOON' : 'GET READY TO BATTLE';
    case 'All You Need to Know':
      return 'ALL YOU NEED TO KNOW';
    case 'Prize Pool':
      return index % 2 === 0 ? 'PRIZE POOL ₹50,000' : 'TOTAL PRIZE ₹1,00,000';
    case 'Prize Distribution':
      return 'PRIZE DISTRIBUTION';
    case 'Event Calculation':
      return 'OVERALL STANDINGS';
    case 'Event Road Map':
      return 'TOURNAMENT ROADMAP';
    case 'Map Schedule':
      return 'OFFICIAL MATCH SCHEDULE';
    case 'Live Casting':
      return 'WATCH LIVE BROADCAST';
    case 'Caster Reveal':
      return 'OFFICIAL CASTER REVEAL';
    case 'Team Preview':
      return 'QUALIFIED TEAMS PREVIEW';
    default:
      return category.toUpperCase();
  }
};

const getCategorySubHeadline = (category: string, index: number): string => {
  switch (category) {
    case 'Coming Soon':
      return 'REGISTRATION OPENS SOON';
    case 'All You Need to Know':
      return 'RULES • FORMAT • TIMINGS';
    case 'Prize Pool':
      return 'TOP 3 TEAMS CASH REWARD';
    case 'Prize Distribution':
      return '#1: 50% • #2: 30% • #3: 20%';
    case 'Event Calculation':
      return 'MATCH OVERALL STANDINGS';
    case 'Event Road Map':
      return 'QUALIFIERS • SEMIS • GRAND FINALS';
    case 'Map Schedule':
      return 'ERANGEL • MIRAMAR • SANHOK';
    case 'Live Casting':
      return 'STREAMING LIVE ON YOUTUBE';
    case 'Caster Reveal':
      return 'VOICE OF THE BATTLEGROUND';
    case 'Team Preview':
      return 'TOP INVITED ROSTERS';
    default:
      return 'OFFICIAL TOURNAMENT';
  }
};

export const generateTemplates = (): FlyerTemplate[] => {
  const templates: FlyerTemplate[] = [];

  FLYER_CATEGORIES.forEach((cat) => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    if (cat === 'Coming Soon') {
      // EXACTLY the 5 high-definition, normalized (1080x1350) Coming Soon flyers
      for (let i = 1; i <= 5; i++) {
        const img = COMING_SOON_FLYERS[i - 1];
        const variant = (i % 3);

        const fields: FlyerField[] = [
          {
            name: 'organiserName',
            label: 'Organiser Name',
            default: 'STG ESPORTS',
            y: '6%',
            x: '20%',
            fontSize: 22,
            color: '#00F0FF',
            fontWeight: '900'
          },
          {
            name: 'eventName',
            label: 'Event Name',
            default: 'STG OP CHAMPIONSHIP',
            y: '13%',
            x: '20%',
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '800'
          },
          {
            name: 'subName',
            label: 'Sub Name',
            default: 'GROUP 1',
            y: '20%',
            x: '20%',
            fontSize: 14,
            color: '#E2E8F0',
            fontWeight: '700'
          },
          {
            name: 'headline',
            label: 'Headline',
            default: getCategoryHeadline(cat, i),
            y: '42%',
            x: '15%',
            fontSize: 24,
            color: '#00F0FF',
            fontWeight: '900'
          },
          {
            name: 'subHeadline',
            label: 'Subtitle',
            default: getCategorySubHeadline(cat, i),
            y: '50%',
            x: '15%',
            fontSize: 13,
            color: '#FFFFFF',
            fontWeight: '600'
          }
        ];

        templates.push({
          id: `coming_soon_${i}`,
          name: `Coming Soon #${i}`,
          category: 'Coming Soon',
          image: img,
          layoutVariant: variant,
          logoPos: { x: '6%', y: '4%', size: 44 },
          socialPos: { x: '10%', y: '90%', color: '#FFFFFF', size: 12 },
          fields
        });
      }
    } else {
      // 6 curated BGMI templates per other categories
      for (let i = 1; i <= 6; i++) {
        const img = BGMI_IMAGES_LIST[(i - 1) % BGMI_IMAGES_LIST.length];
        const variant = (i % 3);

        let orgY = '6%';
        let eventY = '13%';
        let subY = '20%';
        let headlineY = '42%';
        let subHeadlineY = '50%';
        let logoX = '6%';
        let logoY = '4%';
        let socialY = '90%';
        let primaryColor = '#00F0FF';

        if (variant === 1) {
          orgY = '7%';
          eventY = '15%';
          subY = '22%';
          headlineY = '45%';
          subHeadlineY = '53%';
          logoX = '6%';
          logoY = '5%';
          socialY = '90%';
          primaryColor = '#FFD700';
        } else if (variant === 2) {
          orgY = '5%';
          eventY = '12%';
          subY = '18%';
          headlineY = '40%';
          subHeadlineY = '48%';
          logoX = '6%';
          logoY = '4%';
          socialY = '90%';
          primaryColor = '#FF3366';
        }

        const fields: FlyerField[] = [
          {
            name: 'organiserName',
            label: 'Organiser Name',
            default: 'STG ESPORTS',
            y: orgY,
            x: '20%',
            fontSize: 22,
            color: primaryColor,
            fontWeight: '900'
          },
          {
            name: 'eventName',
            label: 'Event Name',
            default: 'STG OP CHAMPIONSHIP',
            y: eventY,
            x: '20%',
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '800'
          },
          {
            name: 'subName',
            label: 'Sub Name',
            default: 'GROUP 1',
            y: subY,
            x: '20%',
            fontSize: 14,
            color: '#E2E8F0',
            fontWeight: '700'
          },
          {
            name: 'headline',
            label: 'Headline',
            default: getCategoryHeadline(cat, i),
            y: headlineY,
            x: '15%',
            fontSize: 24,
            color: primaryColor,
            fontWeight: '900'
          },
          {
            name: 'subHeadline',
            label: 'Subtitle',
            default: getCategorySubHeadline(cat, i),
            y: subHeadlineY,
            x: '15%',
            fontSize: 13,
            color: '#FFFFFF',
            fontWeight: '600'
          }
        ];

        templates.push({
          id: `${slug}_${i}`,
          name: `${cat} #${i}`,
          category: cat,
          image: img,
          layoutVariant: variant,
          logoPos: { x: logoX, y: logoY, size: 44 },
          socialPos: { x: '10%', y: socialY, color: '#FFFFFF', size: 12 },
          fields
        });
      }
    }
  });

  return templates;
};

export const ALL_FLYER_TEMPLATES = generateTemplates();
