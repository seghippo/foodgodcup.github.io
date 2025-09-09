export type Player = {
  id: string;
  name: string;
  nameEn: string;
  position: string;
  positionEn: string;
  age: number;
  experience: string;
  experienceEn: string;
};

export type Team = {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  coach: string;
  coachEn: string;
  founded: number;
  arena: string;
  arenaEn: string;
  roster: Player[];
};

export type Game = {
  id: string;
  date: string; // ISO string
  home: string; // team id
  away: string; // team id
  venue: string;
  time: string; // local display
  homeScore?: number;
  awayScore?: number;
  isPreseason?: boolean;
  status: 'scheduled' | 'completed' | 'preseason';
};

export type Standing = { teamId: string; wins: number; losses: number; draws: number; points: number };
export type CulinaryStanding = { teamId: string; points: number; round1: number; round2: number; round3: number };

export type Post = {
  slug: string;
  title: string;
  titleEn: string;
  date: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
};

export const teams: Team[] = [
  { 
    id: 'DND', 
    name: '东北炖粉条', 
    nameEn: 'Northeast Stewed Noodles',
    city: 'Northeast',
    cityEn: 'Northeast',
    coach: '胡哥',
    coachEn: 'Brother Hu',
    founded: 2025,
    arena: 'Northeast Tennis Center',
    arenaEn: 'Northeast Tennis Center',
    roster: [
      { id: 'DB01', name: 'Player 1', nameEn: 'Player 1', position: '单打', positionEn: 'Singles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB02', name: 'Player 2', nameEn: 'Player 2', position: '双打', positionEn: 'Doubles', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB03', name: 'Player 3', nameEn: 'Player 3', position: '混双', positionEn: 'Mixed Doubles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB04', name: 'Player 4', nameEn: 'Player 4', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB05', name: 'Player 5', nameEn: 'Player 5', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB06', name: 'Player 6', nameEn: 'Player 6', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB07', name: 'Player 7', nameEn: 'Player 7', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB08', name: 'Player 8', nameEn: 'Player 8', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB09', name: 'Player 9', nameEn: 'Player 9', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB10', name: 'Player 10', nameEn: 'Player 10', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'DB11', name: 'Player 11', nameEn: 'Player 11', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'FJT', 
    name: '福建佛跳墙', 
    nameEn: 'Fujian Buddha Jumps Over Wall',
    city: 'Fujian',
    cityEn: 'Fujian',
    coach: '卫东',
    coachEn: 'Wei Dong',
    founded: 2025,
    arena: 'Fujian Tennis Club',
    arenaEn: 'Fujian Tennis Club',
    roster: [
      { id: 'FJ01', name: 'Weidong', nameEn: 'Weidong', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ02', name: 'lao ye', nameEn: 'lao ye', position: '双打', positionEn: 'Doubles', age: 32, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ03', name: 'Jim Yang', nameEn: 'Jim Yang', position: '混双', positionEn: 'Mixed Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ04', name: 'Carl Xiao', nameEn: 'Carl Xiao', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ05', name: 'Patrick Huang', nameEn: 'Patrick Huang', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ06', name: 'Zhu Liang', nameEn: 'Zhu Liang', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ07', name: 'Jim Chen', nameEn: 'Jim Chen', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ08', name: 'Ian Huang', nameEn: 'Ian Huang', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ09', name: 'Isabella Luo', nameEn: 'Isabella Luo', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ10', name: 'Huli', nameEn: 'Huli', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ11', name: 'Joi', nameEn: 'Joi', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ12', name: '海盺', nameEn: 'Hai Xin', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'FJ13', name: 'June', nameEn: 'June', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'BJD', 
    name: '北京烤鸭', 
    nameEn: 'Beijing Roast Duck',
    city: 'Beijing',
    cityEn: 'Beijing',
    coach: '王涤',
    coachEn: 'Wang Di',
    founded: 2025,
    arena: 'Beijing Tennis Academy',
    arenaEn: 'Beijing Tennis Academy',
    roster: [
      { id: 'BJ01', name: 'Player 1', nameEn: 'Player 1', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ02', name: 'Player 2', nameEn: 'Player 2', position: '双打', positionEn: 'Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ03', name: 'Player 3', nameEn: 'Player 3', position: '混双', positionEn: 'Mixed Doubles', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ04', name: 'Player 4', nameEn: 'Player 4', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ05', name: 'Player 5', nameEn: 'Player 5', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ06', name: 'Player 6', nameEn: 'Player 6', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ07', name: 'Player 7', nameEn: 'Player 7', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ08', name: 'Player 8', nameEn: 'Player 8', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ09', name: 'Player 9', nameEn: 'Player 9', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ10', name: 'Player 10', nameEn: 'Player 10', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ11', name: 'Player 11', nameEn: 'Player 11', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ12', name: 'Player 12', nameEn: 'Player 12', position: '替补', positionEn: 'Substitute', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ13', name: 'Player 13', nameEn: 'Player 13', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ14', name: 'Player 14', nameEn: 'Player 14', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'BJ15', name: 'Player 15', nameEn: 'Player 15', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'LGN', 
    name: '两广牛河', 
    nameEn: 'Cantonese Beef Noodles',
    city: 'Guangdong',
    cityEn: 'Guangdong',
    coach: '麦克',
    coachEn: 'Mike',
    founded: 2025,
    arena: 'Guangdong Tennis Center',
    arenaEn: 'Guangdong Tennis Center',
    roster: [
      { id: 'LG01', name: 'Michael', nameEn: 'Michael', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG02', name: 'Frankie', nameEn: 'Frankie', position: '双打', positionEn: 'Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG03', name: 'Ken', nameEn: 'Ken', position: '混双', positionEn: 'Mixed Doubles', age: 32, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG04', name: 'Phung', nameEn: 'Phung', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG05', name: 'Bin', nameEn: 'Bin', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG06', name: 'Chan', nameEn: 'Chan', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG07', name: 'Sheng', nameEn: 'Sheng', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG08', name: 'Roy', nameEn: 'Roy', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG09', name: 'Byung', nameEn: 'Byung', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG10', name: 'Katrina', nameEn: 'Katrina', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG11', name: 'Player 11', nameEn: 'Player 11', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG12', name: 'Player 12', nameEn: 'Player 12', position: '替补', positionEn: 'Substitute', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG13', name: 'Player 13', nameEn: 'Player 13', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'LG14', name: 'Player 14', nameEn: 'Player 14', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'TJG', 
    name: '天津狗不理', 
    nameEn: 'Tianjin Goubuli',
    city: 'Tianjin',
    cityEn: 'Tianjin',
    coach: '雪峰',
    coachEn: 'Xue Feng',
    founded: 2025,
    arena: 'Tianjin Tennis Club',
    arenaEn: 'Tianjin Tennis Club',
    roster: [
      { id: 'TJ01', name: 'Xue Feng', nameEn: 'Xue Feng', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ02', name: 'Liu Yuan', nameEn: 'Liu Yuan', position: '双打', positionEn: 'Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ03', name: 'Han Peng', nameEn: 'Han Peng', position: '混双', positionEn: 'Mixed Doubles', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ04', name: 'Wang XZ', nameEn: 'Wang XZ', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ05', name: 'Jeff Yang', nameEn: 'Jeff Yang', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ06', name: 'Mike Yang', nameEn: 'Mike Yang', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ07', name: 'Dennis Du', nameEn: 'Dennis Du', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ08', name: 'Sharp Xiao', nameEn: 'Sharp Xiao', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ09', name: 'Serena', nameEn: 'Serena', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ10', name: 'Lucy Liu', nameEn: 'Lucy Liu', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ11', name: 'Jing Li', nameEn: 'Jing Li', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'TJ12', name: 'Jing Dong', nameEn: 'Jing Dong', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'JZH', 
    name: '江浙沪狮子头', 
    nameEn: 'Jiangsu Lion Head',
    city: 'Jiangsu',
    cityEn: 'Jiangsu',
    coach: 'Sophia',
    coachEn: 'Sophia',
    founded: 2025,
    arena: 'Jiangsu Tennis Academy',
    arenaEn: 'Jiangsu Tennis Academy',
    roster: [
      { id: 'JZ01', name: 'Player 1', nameEn: 'Player 1', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ02', name: 'Player 2', nameEn: 'Player 2', position: '双打', positionEn: 'Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ03', name: 'Player 3', nameEn: 'Player 3', position: '混双', positionEn: 'Mixed Doubles', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ04', name: 'Player 4', nameEn: 'Player 4', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ05', name: 'Player 5', nameEn: 'Player 5', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ06', name: 'Player 6', nameEn: 'Player 6', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ07', name: 'Player 7', nameEn: 'Player 7', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ08', name: 'Player 8', nameEn: 'Player 8', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ09', name: 'Player 9', nameEn: 'Player 9', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ10', name: 'Player 10', nameEn: 'Player 10', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'JZ11', name: 'Player 11', nameEn: 'Player 11', position: '替补', positionEn: 'Substitute', age: 26, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  },
  { 
    id: 'HBR', 
    name: '湖北热干面', 
    nameEn: 'Hubei Hot Dry Noodles',
    city: 'Hubei',
    cityEn: 'Hubei',
    coach: 'Roger',
    coachEn: 'Roger',
    founded: 2025,
    arena: 'Hubei Tennis Center',
    arenaEn: 'Hubei Tennis Center',
    roster: [
      { id: 'HB01', name: 'Player 1', nameEn: 'Player 1', position: '单打', positionEn: 'Singles', age: 30, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB02', name: 'Player 2', nameEn: 'Player 2', position: '双打', positionEn: 'Doubles', age: 28, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB03', name: 'Player 3', nameEn: 'Player 3', position: '混双', positionEn: 'Mixed Doubles', age: 26, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB04', name: 'Player 4', nameEn: 'Player 4', position: '替补', positionEn: 'Substitute', age: 25, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB05', name: 'Player 5', nameEn: 'Player 5', position: '替补', positionEn: 'Substitute', age: 27, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB06', name: 'Player 6', nameEn: 'Player 6', position: '替补', positionEn: 'Substitute', age: 24, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB07', name: 'Player 7', nameEn: 'Player 7', position: '替补', positionEn: 'Substitute', age: 29, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB08', name: 'Player 8', nameEn: 'Player 8', position: '替补', positionEn: 'Substitute', age: 23, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB09', name: 'Player 9', nameEn: 'Player 9', position: '替补', positionEn: 'Substitute', age: 31, experience: '1.0级', experienceEn: '1.0 Level' },
      { id: 'HB10', name: 'Player 10', nameEn: 'Player 10', position: '替补', positionEn: 'Substitute', age: 22, experience: '1.0级', experienceEn: '1.0 Level' }
    ]
  }
];

export const teamsById = Object.fromEntries(teams.map(t => [t.id, t] as const));

export const schedule: Game[] = [
  // Preseason Game
  { id: 'P1', date: new Date(Date.now() - 7*86400000).toISOString(), home: 'TJG', away: 'FJT', venue: 'Kit Carson', time: '7:00 PM', homeScore: 3, awayScore: 2, isPreseason: true, status: 'preseason' },
  
  // Regular Season Games
  { id: 'G1', date: new Date().toISOString(), home: 'DND', away: 'FJT', venue: '', time: '7:00 PM', status: 'scheduled' },
  { id: 'G2', date: new Date(Date.now() + 86400000).toISOString(), home: 'BJD', away: 'LGN', venue: '', time: '6:30 PM', status: 'scheduled' },
  { id: 'G3', date: new Date(Date.now() + 2*86400000).toISOString(), home: 'TJG', away: 'JZH', venue: '', time: '8:00 PM', status: 'scheduled' },
  { id: 'G4', date: new Date(Date.now() + 3*86400000).toISOString(), home: 'HBR', away: 'DND', venue: '', time: '7:30 PM', status: 'scheduled' },
  { id: 'G5', date: new Date(Date.now() + 4*86400000).toISOString(), home: 'FJT', away: 'BJD', venue: '', time: '6:00 PM', status: 'scheduled' },
  { id: 'G6', date: new Date(Date.now() + 5*86400000).toISOString(), home: 'LGN', away: 'TJG', venue: '', time: '8:30 PM', status: 'scheduled' },
  { id: 'G7', date: new Date(Date.now() + 6*86400000).toISOString(), home: 'JZH', away: 'HBR', venue: '', time: '7:00 PM', status: 'scheduled' }
];

export const standings: Standing[] = [
  { teamId: 'BJD', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'DND', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'JZH', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'FJT', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'TJG', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'LGN', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'HBR', wins: 0, losses: 0, draws: 0, points: 0 }  // Season hasn't started yet
];

export const culinaryStandings: CulinaryStanding[] = [
  { teamId: 'BJD', points: 9, round1: 3, round2: 3, round3: 3 }, // Top 2 in all rounds
  { teamId: 'JZH', points: 7, round1: 3, round2: 1, round3: 3 }, // Top 2, middle, top 2
  { teamId: 'DND', points: 5, round1: 1, round2: 3, round3: 1 }, // Middle, top 2, middle
  { teamId: 'FJT', points: 4, round1: 1, round2: 1, round3: 1 }, // Middle in all rounds
  { teamId: 'TJG', points: 3, round1: 0, round2: 1, round3: 1 }, // No points, middle, middle
  { teamId: 'LGN', points: 2, round1: 1, round2: 0, round3: 1 }, // Middle, no points, middle
  { teamId: 'HBR', points: 0, round1: 0, round2: 0, round3: 0 }  // No points in all rounds
];

export const posts: Post[] = [
  {
    slug: 'shen-die-go-food-god-cup-introduction',
    title: '🎾🥟 圣地亚哥食神杯：网球、美食和友情的三重奏',
    titleEn: '🎾🥟 San Diego Food God Cup: The Perfect Blend of Tennis, Food, and Friendship',
    date: '2025-01-15',
    excerpt: '吃好、打好、玩好，顺便交朋友。圣地亚哥华人网球俱乐部食神杯正式启动！',
    excerptEn: 'Eat well, play well, have fun, and make friends along the way. The San Diego Chinese Tennis Club Food God Cup is officially launched!',
    content: "🎾🥟 圣地亚哥食神杯：网球、美食和友情的三重奏\n\n🍲 为什么要搞这个？\n\n一句话总结：吃好、打好、玩好，顺便交朋友。\n\n我们要做的，就是把圣地亚哥的华人吃货 + 网球爱好者们召集起来。打完球大家别急着跑，留下来吃一顿、秀一场，把友情、乡情都拉满！\n\n🏷️ 看名字就饿的球队榜\n\n目前已有 7 支战队，名字一个比一个下饭：\n• 🥟 天津狗不理包子队 – 队长雪峰\n• 🍲 福建佛跳墙队 – 队长卫东\n• 🍜 湖北热干面队 – 队长 Roger 007\n• 🥬 东北酸菜炖粉条队 – 队长胡哥\n• 🦆 北京全聚德烤鸭队 – 队长 Henry Shao\n• 🦁 江沪浙狮子头队 – 队长 Sophi\n• 🐂 两广牛河队 – 队长麦克\n\n光看队名就能感受到比赛当天的香味儿了……\n\n🎾 网球规则也能整花活\n• 规则随时可调，但原则只有一个：大家开心最重要！\n\n🔔 总结\n\n这不是单纯的网球赛，这是一个 吃货打球趴 + 美食才艺秀。\n能打球、能做饭、能唱歌的人都能在这里找到舞台。\n\n圣地亚哥食神杯，等你来拼：拼球技、拼厨艺、拼人缘！ 🍷🎤🍜",
    contentEn: "🎾🥟 San Diego Food God Cup: The Perfect Blend of Tennis, Food, and Friendship\n\n🍲 Why Are We Doing This?\n\nIn one sentence: Eat well, play well, have fun, and make friends along the way.\n\nWhat we want to do is bring together San Diego's Chinese food lovers and tennis enthusiasts. After playing tennis, don't rush off - stay for a meal, show off your talents, and build friendships and hometown connections!\n\n🏷️ Team Names That Make You Hungry\n\nWe currently have 7 teams with names that make your mouth water:\n• 🥟 Tianjin Goubuli Dumplings Team – Captain Xue Feng\n• 🍲 Fujian Buddha Jumps Over Wall Team – Captain Wei Dong\n• 🍜 Hubei Hot Dry Noodles Team – Captain Roger 007\n• 🥬 Northeast Pickled Cabbage Stewed Noodles Team – Captain Brother Hu\n• 🦆 Beijing Quanjude Roast Duck Team – Captain Henry Shao\n• 🦁 Jiangsu Lion Head Team – Captain Sophia\n• 🐂 Cantonese Beef Noodles Team – Captain Mike\n\nJust reading the team names makes you smell the delicious aromas of competition day...\n\n🎾 Tennis Rules Can Be Fun Too\n• Flexible match combinations: Men's doubles, women's doubles, mixed doubles, and maybe even a short men's singles match.\n• Flexible rules: We have ITF standard format and Pro 8 - whatever makes it exciting!\n• Scoring system: Match results only count for one-third of the total score, so don't worry!\n\n👨‍🍳 Food is the Ultimate Weapon\n• Culinary showdown: Each team brings their hometown signature dishes, everyone eats together and scores together.\n• Talent support: Singing, dancing, stand-up comedy, skits - all welcome to create the atmosphere!\n• High weight: Food, drinks, and entertainment combined can match the tennis scores.\n\nSo: Bad at tennis? No problem, good cooking can still win!\n\n🧭 Team Member Assignment: No Poaching!\n\nThe rules are simple:\n1. Birthplace (before high school) takes priority\n2. University location comes second\n3. Other conditions follow\n\nThis way, everyone knows where they stand and avoids transfer drama.\n\n🏆 Rewards & Penalties: Both Face and Trophies Matter\n• Floating trophy - Food God Cup: Champions take it home for a year.\n• Individual awards: Best player, best chef, best performer... all covered.\n• Penalty system: Not showing up, not participating, not contributing - all result in point deductions!\n\n🤝 Our Agreement\n• Respect opponents, respect the game, but mainly come to have fun.\n• Every team member must play at least once - no invisible players.\n• Rules can be adjusted anytime, but the principle remains: everyone's happiness is most important!\n\n🔔 Summary\n\nThis isn't just a tennis tournament - it's a foodie tennis party + culinary talent show.\nPeople who can play tennis, cook, or sing can all find their stage here.\n\nSan Diego Food God Cup, waiting for you to compete: compete in tennis skills, culinary arts, and social connections! 🍷🎤🍜"
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function latestPost() {
  return posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
}
