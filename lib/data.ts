// Firebase-based data storage
import { 
  getScheduleFromFirebase, 
  addGameToFirebase, 
  updateGameInFirebase, 
  deleteGameFromFirebase,
  getMatchResultsFromFirebase,
  addMatchResultToFirebase,
  updateMatchResultInFirebase,
  subscribeToSchedule,
  subscribeToMatchResults,
  initializeFirebaseData,
  removeDuplicateGames,
  removeDuplicateMatchResults
} from './firebase-data';

export type Player = {
  id: string;
  name: string;
  nameEn: string;
  nickname?: string; // 网名，可选字段
  nicknameEn?: string; // 英文网名，可选字段
  experience: string;
  experienceEn: string;
  wins: number;
  losses: number;
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
export type PlayerStanding = { 
  playerId: string; 
  playerName: string; 
  playerNameEn: string;
  teamId: string; 
  teamName: string;
  teamNameEn: string;
  wins: number; 
  losses: number; 
  draws: number; 
  points: number;
  gamesPlayed: number;
};

export type MatchLine = {
  id: string;
  lineNumber: number; // 1, 2, 3, etc.
  matchType: 'doubles' | 'singles';
  homePlayers: string[]; // Player IDs (1 for singles, 2 for doubles)
  awayPlayers: string[]; // Player IDs (1 for singles, 2 for doubles)
  sets: {
    setNumber: number;
    homeScore: number;
    awayScore: number;
  }[];
  winner: 'home' | 'away';
  totalHomeSets: number;
  totalAwaySets: number;
};

export type MatchResult = {
  id: string;
  gameId: string; // References the original game
  homeTeamId: string;
  awayTeamId: string;
  homeTotalScore: number; // Total lines won by home team
  awayTotalScore: number; // Total lines won by away team
  submittedBy: string; // Captain ID who submitted
  submittedAt: string; // ISO timestamp
  status: 'pending' | 'approved' | 'rejected';
  matchLines: MatchLine[];
};

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

// Data validation functions
export function validatePlayer(player: any): player is Player {
  return (
    typeof player === 'object' &&
    player !== null &&
    typeof player.id === 'string' &&
    player.id.length > 0 &&
    typeof player.name === 'string' &&
    player.name.length > 0 &&
    typeof player.nameEn === 'string' &&
    player.nameEn.length > 0 &&
    typeof player.experience === 'string' &&
    typeof player.experienceEn === 'string' &&
    typeof player.wins === 'number' &&
    typeof player.losses === 'number' &&
    player.wins >= 0 &&
    player.losses >= 0
  );
}

export function validateTeam(team: any): team is Team {
  return (
    typeof team === 'object' &&
    team !== null &&
    typeof team.id === 'string' &&
    team.id.length > 0 &&
    typeof team.name === 'string' &&
    team.name.length > 0 &&
    typeof team.nameEn === 'string' &&
    team.nameEn.length > 0 &&
    typeof team.city === 'string' &&
    typeof team.cityEn === 'string' &&
    typeof team.coach === 'string' &&
    typeof team.coachEn === 'string' &&
    typeof team.founded === 'number' &&
    typeof team.arena === 'string' &&
    typeof team.arenaEn === 'string' &&
    Array.isArray(team.roster) &&
    team.roster.length > 0 &&
    team.roster.every(validatePlayer)
  );
}

export function validateGame(game: any): game is Game {
  return (
    typeof game === 'object' &&
    game !== null &&
    typeof game.id === 'string' &&
    game.id.length > 0 &&
    typeof game.date === 'string' &&
    typeof game.home === 'string' &&
    game.home.length > 0 &&
    typeof game.away === 'string' &&
    game.away.length > 0 &&
    typeof game.venue === 'string' &&
    typeof game.time === 'string' &&
    (game.status === undefined || (typeof game.status === 'string' && ['scheduled', 'completed', 'preseason'].includes(game.status))) &&
    (game.homeScore === undefined || typeof game.homeScore === 'number') &&
    (game.awayScore === undefined || typeof game.awayScore === 'number')
  );
}

export function validateMatchResult(result: any): result is MatchResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.id === 'string' &&
    result.id.length > 0 &&
    typeof result.gameId === 'string' &&
    result.gameId.length > 0 &&
    typeof result.homeTeamId === 'string' &&
    result.homeTeamId.length > 0 &&
    typeof result.awayTeamId === 'string' &&
    result.awayTeamId.length > 0 &&
    typeof result.homeTotalScore === 'number' &&
    typeof result.awayTotalScore === 'number' &&
    typeof result.submittedBy === 'string' &&
    typeof result.submittedAt === 'string' &&
    typeof result.status === 'string' &&
    ['pending', 'approved', 'rejected'].includes(result.status) &&
    Array.isArray(result.matchLines)
  );
}

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
      { id: 'DB01', name: '胡哥', nameEn: '胡哥', nickname: '胡烩肉', nicknameEn: '胡烩肉', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'DB02', name: 'Cathy', nameEn: 'Cathy', nickname: '粘豆包', nicknameEn: '粘豆包', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'DB03', name: 'Fred Li', nameEn: 'Fred Li', nickname: '青岛大虾', nicknameEn: '青岛大虾', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB04', name: '老韩', nameEn: '老韩', nickname: '得莫利炖鱼', nicknameEn: '得莫利炖鱼', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB05', name: '京昂', nameEn: '京昂', nickname: '炸茄盒', nicknameEn: '炸茄盒', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'DB06', name: 'David Yang', nameEn: 'David Yang', nickname: '锅包肉', nicknameEn: '锅包肉', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'DB07', name: '老范', nameEn: '老范', nickname: '熏鸡架', nicknameEn: '熏鸡架', experience: '3.0级', experienceEn: '3.0 Level', wins: 0, losses: 0 },
      { id: 'DB08', name: '小王', nameEn: '小王', nickname: '正宗兰州拉面', nicknameEn: '正宗兰州拉面', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB09', name: 'Bill', nameEn: 'Bill', nickname: '涮涮羊', nicknameEn: '涮涮羊', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB10', name: '金辉', nameEn: '金辉', nickname: '铁锅炖', nicknameEn: '铁锅炖', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB11', name: '墨旺', nameEn: '墨旺', nickname: '凉拌仙鱼', nicknameEn: '凉拌仙鱼', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
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
      { id: 'FJ01', name: 'Weidong', nameEn: 'Weidong', nickname: '海蛎煎', nicknameEn: '海蛎煎', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ02', name: 'lao ye', nameEn: 'lao ye', nickname: '五香卷', nicknameEn: '五香卷', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'FJ03', name: 'Jim Yang', nameEn: 'Jim Yang', nickname: '杨梅', nicknameEn: '杨梅', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ04', name: 'Carl Xiao', nameEn: 'Carl Xiao', nickname: '芋泥香酥鸭', nicknameEn: '芋泥香酥鸭', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ05', name: 'Patrick', nameEn: 'Patrick', nickname: '荔枝肉', nicknameEn: '荔枝肉', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ06', name: 'Zhu Liang', nameEn: 'Zhu Liang', nickname: '米粿', nicknameEn: '米粿', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ07', name: 'Jim Chen', nameEn: 'Jim Chen', nickname: '福州捞化', nicknameEn: '福州捞化', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ08', name: 'Ian Huang', nameEn: 'Ian Huang', nickname: '鱼丸扁肉燕', nicknameEn: '鱼丸扁肉燕', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ09', name: 'Isabella', nameEn: 'Isabella', nickname: '冰糖建莲羹', nicknameEn: '冰糖建莲羹', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ10', name: 'Huli', nameEn: 'Huli', nickname: '土笋冻', nicknameEn: '土笋冻', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ11', name: 'Joi', nameEn: 'Joi', nickname: '肉丸仔', nicknameEn: '肉丸仔', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'FJ12', name: '海盺', nameEn: '海盺', nickname: '烧仙草', nicknameEn: '烧仙草', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ13', name: 'June', nameEn: 'June', nickname: '鳗鱼豆腐', nicknameEn: '鳗鱼豆腐', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
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
      { id: 'BJ01', name: 'Jack', nameEn: 'Jack', nickname: '爆肚', nicknameEn: '爆肚', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ02', name: 'Wang Di', nameEn: 'Wang Di', nickname: '丰年炸灌肠儿', nicknameEn: '丰年炸灌肠儿', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ03', name: '庞博', nameEn: '庞博', nickname: '驴打滚', nicknameEn: '驴打滚', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ04', name: 'Ke Tao', nameEn: 'Ke Tao', nickname: '待定59', nicknameEn: '待定59', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ05', name: 'Brian', nameEn: 'Brian', nickname: '待定60', nicknameEn: '待定60', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ06', name: 'Frank Hao', nameEn: 'Frank Hao', nickname: '京八件', nicknameEn: '京八件', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ07', name: '中全', nameEn: '中全', nickname: '待定62', nicknameEn: '待定62', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ08', name: 'Linda', nameEn: 'Linda', nickname: '待定63', nicknameEn: '待定63', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ09', name: '韩丹伟', nameEn: '韩丹伟', nickname: '待定64', nicknameEn: '待定64', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ10', name: '马世红', nameEn: '马世红', nickname: '待定65', nicknameEn: '待定65', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ11', name: 'Sherry', nameEn: 'Sherry', nickname: '糖醋里脊', nicknameEn: '糖醋里脊', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'BJ12', name: 'Henry Shao', nameEn: 'Henry Shao', nickname: '素什锦', nicknameEn: '素什锦', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'BJ13', name: 'Bo Pang', nameEn: 'Bo Pang', nickname: '待定68', nicknameEn: '待定68', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ14', name: 'Yi Liu', nameEn: 'Yi Liu', nickname: '待定69', nicknameEn: '待定69', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ15', name: '黄石', nameEn: '黄石', nickname: '炸酱面', nicknameEn: '炸酱面', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
    ]
  },
  { 
    id: 'LGN', 
    name: '两广牛河', 
    nameEn: 'Liangguang',
    city: 'Guangdong',
    cityEn: 'Guangdong',
    coach: '麦克',
    coachEn: 'Mike',
    founded: 2025,
    arena: 'Guangdong Tennis Center',
    arenaEn: 'Guangdong Tennis Center',
    roster: [
      { id: 'LG01', name: 'Michael', nameEn: 'Michael', nickname: '老婆饼', nicknameEn: '老婆饼', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG02', name: 'Frankie', nameEn: 'Frankie', nickname: '云吞面', nicknameEn: '云吞面', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG03', name: 'Ken', nameEn: 'Ken', nickname: '龙虎凤', nicknameEn: '龙虎凤', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'LG04', name: 'Phung', nameEn: 'Phung', nickname: '煲仔饭', nicknameEn: '煲仔饭', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG05', name: 'Bin', nameEn: 'Bin', nickname: '艇仔粥', nicknameEn: '艇仔粥', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'LG06', name: 'Chan', nameEn: 'Chan', nickname: '椒盐猪排', nicknameEn: '椒盐猪排', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'LG07', name: 'Sheng', nameEn: 'Sheng', nickname: '酥皮蛋挞', nicknameEn: '酥皮蛋挞', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG08', name: 'Roy', nameEn: 'Roy', nickname: '菠萝包', nicknameEn: '菠萝包', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG09', name: 'Byung', nameEn: 'Byung', nickname: '菠萝油', nicknameEn: '菠萝油', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG10', name: 'Katrina', nameEn: 'Katrina', nickname: '瑞士鸡翼', nicknameEn: '瑞士鸡翼', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG11', name: 'Carrie', nameEn: 'Carrie', nickname: '老友粉', nicknameEn: '老友粉', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG12', name: 'Luke', nameEn: 'Luke', nickname: '滑蛋湿炒牛河', nicknameEn: '滑蛋湿炒牛河', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG13', name: 'Yunqiang', nameEn: 'Yunqiang', nickname: '桂林米粉', nicknameEn: '桂林米粉', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'LG14', name: 'Yuan', nameEn: 'Yuan', nickname: '柠檬鸭', nicknameEn: '柠檬鸭', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'LG15', name: '谷哥', nameEn: '谷哥', nickname: '糯米鸡', nicknameEn: '糯米鸡', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 }
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
      { id: 'TJ01', name: 'Xuefeng', nameEn: 'Xuefeng', nickname: '18街麻花', nicknameEn: '18街麻花', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'TJ02', name: 'Liu Yuan', nameEn: 'Liu Yuan', nickname: '炸糕', nicknameEn: '炸糕', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'TJ03', name: 'Han Peng', nameEn: 'Han Peng', nickname: '嘎巴菜', nicknameEn: '嘎巴菜', experience: '3.0级', experienceEn: '3.0 Level', wins: 0, losses: 0 },
      { id: 'TJ04', name: 'Wang XZ', nameEn: 'Wang XZ', nickname: '果篦儿', nicknameEn: '果篦儿', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ05', name: 'Jeff Yang', nameEn: 'Jeff Yang', nickname: '豆腐脑', nicknameEn: '豆腐脑', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'TJ06', name: 'Mike Yang', nameEn: 'Mike Yang', nickname: '煎饼', nicknameEn: '煎饼', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'TJ07', name: 'Dennis Du', nameEn: 'Dennis Du', nickname: '打卤面', nicknameEn: '打卤面', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'TJ08', name: 'Sharp Xiao', nameEn: 'Sharp Xiao', nickname: '八珍豆腐', nicknameEn: '八珍豆腐', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ09', name: 'Serena', nameEn: 'Serena', nickname: '三鲜包子', nicknameEn: '三鲜包子', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'TJ10', name: 'Lucy Liu', nameEn: 'Lucy Liu', nickname: '皮皮虾', nicknameEn: '皮皮虾', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ11', name: 'Jing Li', nameEn: 'Jing Li', nickname: '豆根糖', nicknameEn: '豆根糖', experience: '3.0级', experienceEn: '3.0 Level', wins: 0, losses: 0 },
      { id: 'TJ12', name: 'Jing Dong', nameEn: 'Jing Dong', nickname: '河螃蟹', nicknameEn: '河螃蟹', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
    ]
  },
  { 
    id: 'JZH', 
    name: '江浙沪狮子头', 
    nameEn: 'JZH Lion Head',
    city: 'Jiangsu',
    cityEn: 'Jiangsu',
    coach: 'Sophia',
    coachEn: 'Sophia',
    founded: 2025,
    arena: 'Jiangsu Tennis Academy',
    arenaEn: 'Jiangsu Tennis Academy',
    roster: [
      { id: 'JZ01', name: 'Sophia Li', nameEn: 'Sophia Li', nickname: '龙游小辣椒', nicknameEn: '龙游小辣椒', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'JZ02', name: 'Mark', nameEn: 'Mark', nickname: '炒年糕', nicknameEn: '炒年糕', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'JZ03', name: '孔晓华', nameEn: '孔晓华', nickname: '香干马兰头', nicknameEn: '香干马兰头', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'JZ04', name: '马晓强', nameEn: '马晓强', nickname: '太湖三白', nicknameEn: '太湖三白', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'JZ05', name: 'Ed', nameEn: 'Ed', nickname: '糟卤小凤爪', nicknameEn: '糟卤小凤爪', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'JZ06', name: 'Xiaoxia', nameEn: 'Xiaoxia', nickname: '金华梅干菜酥饼', nicknameEn: '金华梅干菜酥饼', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'JZ07', name: 'Fred', nameEn: 'Fred', nickname: '清蒸大闸蟹', nicknameEn: '清蒸大闸蟹', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'JZ08', name: 'Kathy W', nameEn: 'Kathy W', nickname: '粉蒸肉', nicknameEn: '粉蒸肉', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'JZ09', name: '阳光', nameEn: '阳光', nickname: '阳春面', nicknameEn: '阳春面', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'JZ10', name: 'Gary', nameEn: 'Gary', nickname: '待定54', nicknameEn: '待定54', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'JZ11', name: '叶远', nameEn: '叶远', nickname: '鸭血粉丝汤', nicknameEn: '鸭血粉丝汤', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 }
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
      { id: 'HB01', name: 'Roger', nameEn: 'Roger', nickname: '武昌鱼', nicknameEn: '武昌鱼', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'HB02', name: 'Xiaobai', nameEn: 'Xiaobai', nickname: '关山一盒酥', nicknameEn: '关山一盒酥', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'HB03', name: 'Lijun', nameEn: 'Lijun', nickname: '新豌豆', nicknameEn: '新豌豆', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'HB04', name: '中微子', nameEn: '中微子', nickname: '豆皮', nicknameEn: '豆皮', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'HB05', name: 'Henry CJ', nameEn: 'Henry CJ', nickname: '卷蹄', nicknameEn: '卷蹄', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'HB06', name: 'Zhou Tao', nameEn: 'Zhou Tao', nickname: '鱼糕', nicknameEn: '鱼糕', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'HB07', name: 'Jinghua', nameEn: 'Jinghua', nickname: '小龙虾', nicknameEn: '小龙虾', experience: '4.0级', experienceEn: '4.0 Level', wins: 0, losses: 0 },
      { id: 'HB08', name: 'Ke Shi', nameEn: 'Ke Shi', nickname: '珍珠丸子', nicknameEn: '珍珠丸子', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'HB09', name: '陈萍', nameEn: '陈萍', nickname: '孝感米酒', nicknameEn: '孝感米酒', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'HB10', name: 'Yonghui', nameEn: 'Yonghui', nickname: '绿豆糍粑', nicknameEn: '绿豆糍粑', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
    ]
  }
];

export const teamsById = Object.fromEntries(teams.map(t => [t.id, t] as const));

// Default schedule with preseason game
const defaultSchedule: Game[] = [
  // Preseason Game
];

// Function to get schedule from localStorage or return default
function getScheduleFromStorage(): Game[] {
  if (typeof window === 'undefined') {
    return defaultSchedule; // Server-side rendering
  }
  
  try {
    const stored = localStorage.getItem('tennis-schedule');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Validate data structure
      if (!Array.isArray(parsed)) {
        console.warn('Invalid schedule data structure, using default');
        return defaultSchedule;
      }
      
      // Validate each game
      const validGames = parsed.filter(validateGame);
      if (validGames.length !== parsed.length) {
        console.warn(`Filtered out ${parsed.length - validGames.length} invalid games`);
      }
      
      // Ensure we always have the preseason game
      const hasPreseason = validGames.some((game: Game) => game.id === 'P1');
      if (!hasPreseason) {
        validGames.unshift(defaultSchedule[0]);
      }
      
      return validGames;
    }
  } catch (error) {
    console.error('Error loading schedule from localStorage:', error);
    // Try to load from backup
    const backup = getBackupData('schedule');
    if (backup) {
      console.log('Loaded schedule from backup');
      return backup;
    }
  }
  
  return defaultSchedule;
}

// Function to save schedule to localStorage
function saveScheduleToStorage(schedule: Game[]): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  try {
    // Validate data before saving
    const validSchedule = schedule.filter(validateGame);
    if (validSchedule.length !== schedule.length) {
      console.warn(`Filtered out ${schedule.length - validSchedule.length} invalid games before saving`);
    }
    
    localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
    
    // Create backup
    createBackup('schedule', validSchedule);
  } catch (error) {
    console.error('Error saving schedule to localStorage:', error);
  }
}

// Backup system functions
function createBackup(type: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const backup = {
      data: data,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(`backup-${type}`, JSON.stringify(backup));
  } catch (error) {
    console.error(`Error creating backup for ${type}:`, error);
  }
}

function getBackupData(type: string): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const backup = localStorage.getItem(`backup-${type}`);
    if (backup) {
      const parsed = JSON.parse(backup);
      return parsed.data;
    }
  } catch (error) {
    console.error(`Error loading backup for ${type}:`, error);
  }
  
  return null;
}

export function createFullBackup(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const fullBackup = {
      teams: teams,
      schedule: schedule,
      matchResults: matchResults,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `league-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Full backup created successfully');
  } catch (error) {
    console.error('Error creating full backup:', error);
  }
}

export function restoreFromBackup(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        // Validate backup structure
        if (!backup.teams || !backup.schedule || !backup.matchResults) {
          console.error('Invalid backup file structure');
          resolve(false);
          return;
        }
        
        // Validate data
        const validTeams = backup.teams.filter(validateTeam);
        const validSchedule = backup.schedule.filter(validateGame);
        const validResults = backup.matchResults.filter(validateMatchResult);
        
        if (validTeams.length === 0 || validSchedule.length === 0) {
          console.error('Backup contains no valid data');
          resolve(false);
          return;
        }
        
        // Restore data
        localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
        localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
        
        console.log('Backup restored successfully');
        resolve(true);
      } catch (error) {
        console.error('Error restoring backup:', error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}

export function exportMatchResults(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const results = getMatchResultsFromStorage();
    const exportData = {
      matchResults: results,
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Match results exported successfully');
  } catch (error) {
    console.error('Error exporting match results:', error);
  }
}

export function exportSchedule(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const scheduleData = getScheduleFromStorage();
    const exportData = {
      schedule: scheduleData,
      exportDate: new Date().toISOString(),
      totalGames: scheduleData.length,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Schedule exported successfully');
  } catch (error) {
    console.error('Error exporting schedule:', error);
  }
}

// Export all data for cross-device sync
export function exportAllData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const allData = {
      schedule: getScheduleFromStorage(),
      matchResults: getMatchResultsFromStorage(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foodgodcup-all-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('All data exported successfully');
  } catch (error) {
    console.error('Error exporting all data:', error);
  }
}

// Import all data from file
export function importAllData(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.schedule || !data.matchResults) {
          console.error('Invalid data structure');
          resolve(false);
          return;
        }
        
        // Validate individual items
        const validSchedule = data.schedule.filter(validateGame);
        const validResults = data.matchResults.filter(validateMatchResult);
        
        if (validSchedule.length === 0 && validResults.length === 0) {
          console.error('No valid data found');
          resolve(false);
          return;
        }
        
        // Apply the imported data
        if (validSchedule.length > 0) {
          localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
          console.log(`Imported ${validSchedule.length} games`);
        }
        
        if (validResults.length > 0) {
          localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
          console.log(`Imported ${validResults.length} match results`);
        }
        
        // Refresh the exported arrays
        refreshScheduleFromStorage();
        refreshMatchResultsFromStorage();
        
        console.log('All data imported successfully');
        resolve(true);
      } catch (error) {
        console.error('Error importing data:', error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(false);
    };
    
    reader.readAsText(file);
  });
}

// Data sync functions for cross-device compatibility
export function uploadDataToShared(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const syncData = {
      schedule: getScheduleFromStorage(),
      matchResults: getMatchResultsFromStorage(),
      uploadDate: new Date().toISOString(),
      uploadedBy: 'captain', // Could be enhanced with actual user ID
      version: '1.0'
    };
    
    // Store in localStorage as "shared" data for other devices to pick up
    localStorage.setItem('shared-league-data', JSON.stringify(syncData));
    
    // Also create a downloadable file for manual sharing
    const blob = new Blob([JSON.stringify(syncData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shared-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Data uploaded to shared storage successfully');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
}

export function downloadLatestData(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const sharedData = localStorage.getItem('shared-league-data');
    if (!sharedData) {
      console.log('No shared data found');
      return false;
    }
    
    const parsed = JSON.parse(sharedData);
    
    // Validate shared data
    if (!parsed.schedule || !parsed.matchResults) {
      console.error('Invalid shared data structure');
      return false;
    }
    
    // Validate data before applying
    const validSchedule = parsed.schedule.filter(validateGame);
    const validResults = parsed.matchResults.filter(validateMatchResult);
    
    if (validSchedule.length === 0 && validResults.length === 0) {
      console.error('No valid data in shared storage');
      return false;
    }
    
    // Apply the shared data
    if (validSchedule.length > 0) {
      localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
      console.log(`Synced ${validSchedule.length} games from shared data`);
    }
    
    if (validResults.length > 0) {
      localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
      console.log(`Synced ${validResults.length} match results from shared data`);
    }
    
    // Refresh the exported arrays
    refreshScheduleFromStorage();
    refreshMatchResultsFromStorage();
    
    console.log('Data synced successfully');
    return true;
  } catch (error) {
    console.error('Error downloading shared data:', error);
    return false;
  }
}

export function restoreFromSharedFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sharedData = JSON.parse(e.target?.result as string);
        
        // Validate shared data structure
        if (!sharedData.schedule || !sharedData.matchResults) {
          console.error('Invalid shared data file structure');
          resolve(false);
          return;
        }
        
        // Validate data
        const validSchedule = sharedData.schedule.filter(validateGame);
        const validResults = sharedData.matchResults.filter(validateMatchResult);
        
        if (validSchedule.length === 0 && validResults.length === 0) {
          console.error('Shared file contains no valid data');
          resolve(false);
          return;
        }
        
        // Apply the shared data
        if (validSchedule.length > 0) {
          localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
        }
        
        if (validResults.length > 0) {
          localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
        }
        
        // Refresh the exported arrays
        refreshScheduleFromStorage();
        refreshMatchResultsFromStorage();
        
        console.log('Shared data restored successfully');
        resolve(true);
      } catch (error) {
        console.error('Error restoring shared data:', error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}

export function getLastSyncInfo(): { hasSharedData: boolean; lastUpload?: string; dataCount?: { games: number; results: number } } {
  if (typeof window === 'undefined') return { hasSharedData: false };
  
  try {
    const sharedData = localStorage.getItem('shared-league-data');
    if (!sharedData) {
      return { hasSharedData: false };
    }
    
    const parsed = JSON.parse(sharedData);
    return {
      hasSharedData: true,
      lastUpload: parsed.uploadDate,
      dataCount: {
        games: parsed.schedule?.length || 0,
        results: parsed.matchResults?.length || 0
      }
    };
  } catch (error) {
    console.error('Error getting sync info:', error);
    return { hasSharedData: false };
  }
}

export async function syncToCloud(captainName?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Initialize Firebase data if needed
    await initializeFirebaseData();
    
    // Get current data from localStorage
    const currentSchedule = getScheduleFromStorage();
    const currentResults = getMatchResultsFromStorage();
    
    // Sync schedule to Firebase - check for duplicates first
    const existingGames = await getScheduleFromFirebase();
    const existingGameIds = new Set(existingGames.map(g => g.id));
    
    for (const game of currentSchedule) {
      // Only add games that don't already exist in Firebase
      if (!existingGameIds.has(game.id)) {
        await addGameToFirebase(game);
      }
    }
    
    // Sync match results to Firebase - check for duplicates first
    const existingResults = await getMatchResultsFromFirebase();
    const existingResultIds = new Set(existingResults.map(r => r.id));
    
    for (const result of currentResults) {
      // Only add results that don't already exist in Firebase
      if (!existingResultIds.has(result.id)) {
        await addMatchResultToFirebase(result);
      }
    }
    
    // Run automatic duplicate cleanup after syncing
    console.log('Running automatic duplicate cleanup after sync...');
    const gameCleanup = await removeDuplicateGames();
    const resultCleanup = await removeDuplicateMatchResults();
    
    if (gameCleanup.removed > 0 || resultCleanup.removed > 0) {
      console.log(`🧹 Post-sync cleanup: ${gameCleanup.removed} duplicate games and ${resultCleanup.removed} duplicate results removed`);
    }
    
    console.log(`Data synced to Firebase by: ${captainName || 'unknown'}`);
    return true;
  } catch (error) {
    console.error('Error syncing to Firebase:', error);
    return false;
  }
}

export async function syncFromCloud(captainName?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    console.log('Starting sync from Firebase...');
    
    // Initialize Firebase data if needed
    await initializeFirebaseData();
    console.log('Firebase initialized');
    
    // Run automatic duplicate cleanup first
    console.log('Running automatic duplicate cleanup...');
    const gameCleanup = await removeDuplicateGames();
    const resultCleanup = await removeDuplicateMatchResults();
    
    if (gameCleanup.removed > 0 || resultCleanup.removed > 0) {
      console.log(`🧹 Cleanup completed: ${gameCleanup.removed} duplicate games and ${resultCleanup.removed} duplicate results removed`);
    }
    
    // Get data from Firebase (after cleanup)
    console.log('Fetching schedule from Firebase...');
    const firebaseSchedule = await getScheduleFromFirebase();
    console.log(`Found ${firebaseSchedule.length} games in Firebase`);
    
    console.log('Fetching match results from Firebase...');
    const firebaseResults = await getMatchResultsFromFirebase();
    console.log(`Found ${firebaseResults.length} match results in Firebase`);
    
    // Validate data
    const validSchedule = firebaseSchedule.filter(validateGame);
    const validResults = firebaseResults.filter(validateMatchResult);
    
    console.log(`Valid schedule items: ${validSchedule.length}, Valid results: ${validResults.length}`);
    
    if (validSchedule.length === 0 && validResults.length === 0) {
      console.log('No valid data in Firebase storage - this is normal for a new setup');
      return true; // Return true even if no data, as this is not an error
    }
    
    // Apply the synced data to localStorage
    if (validSchedule.length > 0) {
      localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
      console.log(`Synced ${validSchedule.length} games from Firebase`);
    }
    
    if (validResults.length > 0) {
      localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
      console.log(`Synced ${validResults.length} match results from Firebase`);
    }
    
    // Refresh the exported arrays
    refreshScheduleFromStorage();
    refreshMatchResultsFromStorage();
    
    console.log('Data synced from Firebase successfully');
    return true;
  } catch (error) {
    console.error('Error syncing from Firebase:', error);
    console.error('Error details:', error);
    return false;
  }
}

export function getCloudSyncInfo(): { hasData: boolean; lastSync?: string; dataCount?: { games: number; results: number } } {
  if (typeof window === 'undefined') return { hasData: false };
  
  try {
    const githubData = localStorage.getItem('github-league-data');
    if (!githubData) {
      return { hasData: false };
    }
    
    const parsed = JSON.parse(githubData);
    return {
      hasData: true,
      lastSync: parsed.lastUpdated,
      dataCount: {
        games: parsed.schedule?.length || 0,
        results: parsed.matchResults?.length || 0
      }
    };
  } catch (error) {
    console.error('Error getting GitHub sync info:', error);
    return { hasData: false };
  }
}

// Legacy functions for backward compatibility
export const syncToGitHub = syncToCloud;
export const syncFromGitHub = syncFromCloud;
export const getGitHubSyncInfo = getCloudSyncInfo;

// Initialize schedule from storage
export const schedule: Game[] = getScheduleFromStorage();

// Function to refresh schedule from storage (for client-side updates)
export function refreshScheduleFromStorage(): Game[] {
  const refreshedSchedule = getScheduleFromStorage();
  // Update the exported schedule array
  schedule.length = 0;
  schedule.push(...refreshedSchedule);
  return refreshedSchedule;
}

// Function to create a new game
export function createNewGame(homeTeamId: string, awayTeamId: string, date: string, time: string, venue: string = ''): Game {
  const gameId = `G${Date.now()}`; // Generate unique ID
  return {
    id: gameId,
    date: date,
    home: homeTeamId,
    away: awayTeamId,
    venue: venue,
    time: time,
    status: 'scheduled'
  };
}

// Function to add a new game to the schedule
export async function addGameToSchedule(game: Game): Promise<void> {
  // Check if game already exists in Firebase before adding locally
  try {
    const existingGames = await getScheduleFromFirebase();
    const gameKey = `${game.home}-${game.away}-${game.date}-${game.venue}`;
    
    // Check if this exact game already exists
    const isDuplicate = existingGames.some(existingGame => {
      const existingKey = `${existingGame.home}-${existingGame.away}-${existingGame.date}-${existingGame.venue}`;
      return existingKey === gameKey;
    });
    
    if (isDuplicate) {
      console.log('Game already exists in Firebase, skipping duplicate');
      return;
    }
  } catch (error) {
    console.warn('Could not check for duplicates, proceeding with game creation:', error);
  }
  
  schedule.push(game);
  saveScheduleToStorage(schedule);
  
  // Auto-sync to Firebase when new games are added
  syncToCloud().then(success => {
    if (success) {
      console.log('New game automatically synced to Firebase');
    } else {
      console.warn('Failed to auto-sync new game to Firebase');
    }
  });
}

// Function to remove a game from the schedule
export async function removeGameFromSchedule(gameId: string): Promise<boolean> {
  console.log('removeGameFromSchedule called with gameId:', gameId);
  console.log('Current schedule length:', schedule.length);
  
  const index = schedule.findIndex(game => game.id === gameId);
  console.log('Found game at index:', index);
  
  if (index !== -1) {
    console.log('Removing game from local schedule...');
    schedule.splice(index, 1);
    saveScheduleToStorage(schedule);
    console.log('Game removed from local storage');
    
    // Also remove from Firebase
    try {
      console.log('Attempting to remove from Firebase...');
      await deleteGameFromFirebase(gameId);
      console.log(`Game ${gameId} removed from Firebase successfully`);
    } catch (error) {
      console.error('Error removing game from Firebase:', error);
      // Continue anyway - local removal was successful
    }
    
    console.log('Game removal completed successfully');
    return true;
  } else {
    console.error('Game not found in schedule:', gameId);
    console.log('Available games:', schedule.map(g => ({ id: g.id, home: g.home, away: g.away })));
  }
  return false;
}

// Function to update game information
export function updateGameInfo(gameId: string, updates: Partial<Game>): boolean {
  const index = schedule.findIndex(game => game.id === gameId);
  if (index !== -1) {
    schedule[index] = { ...schedule[index], ...updates };
    saveScheduleToStorage(schedule);
    return true;
  }
  return false;
}

export const standings: Standing[] = [
  { teamId: 'BJD', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'DND', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'JZH', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'FJT', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'TJG', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'LGN', wins: 0, losses: 0, draws: 0, points: 0 }, // Season hasn't started yet
  { teamId: 'HBR', wins: 0, losses: 0, draws: 0, points: 0 }  // Season hasn't started yet
];


// Function to generate individual player standings from team standings and player data
export function generatePlayerStandings(): PlayerStanding[] {
  const playerStandings: PlayerStanding[] = [];
  
  teams.forEach(team => {
    team.roster.forEach(player => {
      // 使用网名优先，如果没有网名则使用ID
      const displayName = player.nickname || player.nicknameEn || player.id;
      const displayNameEn = player.nicknameEn || player.nickname || player.id;
      
      playerStandings.push({
        playerId: player.id,
        playerName: displayName,
        playerNameEn: displayNameEn,
        teamId: team.id,
        teamName: team.name,
        teamNameEn: team.nameEn,
        wins: player.wins,
        losses: player.losses,
        draws: 0, // Players don't have draws in tennis
        points: player.wins * 3, // 3 points per win
        gamesPlayed: player.wins + player.losses
      });
    });
  });
  
  // Sort by points (wins * 3), then by wins, then by games played
  return playerStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.gamesPlayed - a.gamesPlayed;
  });
}


// Default match results (preseason game)
const defaultMatchResults: MatchResult[] = [
  // Example: Preseason game result
  {
    id: 'MR001',
    gameId: 'P1',
    homeTeamId: 'TJG',
    awayTeamId: 'FJT',
    homeTotalScore: 3,
    awayTotalScore: 2,
    submittedBy: 'TJ01', // Xue Feng (Tianjin captain)
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'approved',
    matchLines: [
      {
        id: 'ML001',
        lineNumber: 1,
        matchType: 'doubles',
        homePlayers: ['TJ01', 'TJ02'],
        awayPlayers: ['FJ01', 'FJ02'],
        sets: [
          { setNumber: 1, homeScore: 6, awayScore: 3 },
          { setNumber: 2, homeScore: 6, awayScore: 2 }
        ],
        winner: 'home',
        totalHomeSets: 2,
        totalAwaySets: 0
      },
      {
        id: 'ML002',
        lineNumber: 2,
        matchType: 'doubles',
        homePlayers: ['TJ03', 'TJ04'],
        awayPlayers: ['FJ03', 'FJ04'],
        sets: [
          { setNumber: 1, homeScore: 4, awayScore: 6 },
          { setNumber: 2, homeScore: 6, awayScore: 4 },
          { setNumber: 3, homeScore: 6, awayScore: 2 }
        ],
        winner: 'home',
        totalHomeSets: 2,
        totalAwaySets: 1
      },
      {
        id: 'ML003',
        lineNumber: 3,
        matchType: 'singles',
        homePlayers: ['TJ05'],
        awayPlayers: ['FJ05'],
        sets: [
          { setNumber: 1, homeScore: 6, awayScore: 4 },
          { setNumber: 2, homeScore: 6, awayScore: 3 }
        ],
        winner: 'home',
        totalHomeSets: 2,
        totalAwaySets: 0
      }
    ]
  }
];

export const posts: Post[] = [
  {
    slug: 'meet-the-seven-teams',
    title: '🏆 七支战队大揭秘：美食与网球的完美融合',
    titleEn: '🏆 Meet the Seven Teams: Perfect Fusion of Food and Tennis',
    date: '2025-01-20',
    excerpt: '深入了解七支参赛队伍的特色风格，从江浙沪狮子头到东北酸菜炖粉条，每支队伍都有独特的"味道"！',
    excerptEn: 'Get to know the unique characteristics of all seven competing teams, from Jiangsu Lion Head to Northeast Pickled Cabbage - each team has its own distinctive "flavor"!',
    content: "🏆 七支战队大揭秘：美食与网球的完美融合\n\n🎾 江浙沪狮子头队\n\n我们是一群在球场上'包揽甜咸'的狠角色！发球像小笼包汤汁——精准内敛却暗藏爆发力，跑动如上海生煎——底脆皮软还带点儿倔强！我们的战术比西湖醋鱼更鲜滑，防守比东坡肉更扎实，偶尔还会用一记'糖醋调教球'甜倒对手！\n\n最后，我们是-松而不散，糯而不黏的狮子头队！准备好迎战江浙沪狮子头咆哮队了吗？\n\n🍲 福建佛跳墙队\n\n我们是福建佛跳墙网球队！\n\n就像那一盅慢火熬煮的佛跳墙，海参、鲍鱼、花胶、干贝，汇聚山珍海味，我们把力量、技巧、毅力与智慧，一起融进每一次击球。福建菜讲究\"清鲜和合\"，球场上我们同样注重配合与细腻手感；佛闻香气也要跳墙，福建佛跳墙，端起一碗鲜香，打出一场辉煌！\n\n🥬 东北酸菜炖粉条队\n\n我们是东北酸菜炖粉条队：\n\n东北菜讲究滋味浓郁，且善于利用当地的野生菌类、山野菜以及丰富的肉类和海鲜 - 俺们的球路和菜系贴近，基本都是野路子！\n\n东北菜分量十足，颇有东北人豪爽大气的特质 -这也是我们队有多位东北女婿之故！\n\n擅长炖、酱、溜、炸等烹调方式，以炖菜最为出名，我们的技术特点技术：炖 - 打球粘，酱 - 正反手凶猛，溜 - 切削油，炸 - 发球凶\n\n齐喊：翠花，上酸菜[呲牙]\n\n🍜 湖北热干面网球队：舌尖上的网球战术\n\n湖北热干面网球队，一支充满地方风情的队伍。他们的球风如同荆楚大地的美食，既有扎实的底蕴，又不乏灵动的变化。他们将热干面的筋道、鱼丸的细腻、藕丸的Q弹以及莲藕排骨汤的绵长，巧妙地融入网球技战术之中，形成了独树一帜的\"楚味\"打法。\n\n• 扎实底线：热干面的筋道，代表静华\n• 网前截击：鱼丸的细腻，以CJ为代表\n• 中场过渡：藕丸的Q弹，代表刘源\n• 持久耐力：莲藕排骨汤的绵长，代表小白\n\n🥟 天津狗不理包子队\n\n天津地方菜系起源于民间，得势于地利，位于华北平原。素有\"吃鱼吃虾，天津为家\"。常见的家常菜有：老爆三，独面筋，笃面筋，罾嘣鲤鱼，锅塌里脊，贴饽饽熬小鱼，清炒虾仁，八大碗等。小吃有狗不理包子，猫不闻饺子，炸糕，麻花，煎饼果子，嘎巴菜，糕干等。天津菜虽未列8大菜系，吃的是码头文化交融，但是小吃才是天津的灵魂。\n\n我们天津队打球有狗不理包子18个褶的漂亮，十八街麻花的武器，耳朵眼炸糕的细腻，煎饼果子的多样，最后不行让二儿他妈妈烙3糖饼陪大家去钓鱼[呲牙][呲牙]\n\n🦆 北京全聚德烤鸭队\n\n北京除了烤鸭，其它的像炸酱面，豆汁儿都不够高大上，但聚集了全国各地的的美食，没有皇城的背书，都不算是国家级美食。\n\n全聚德队员的高尚德行是必须的。\n\n🐂 两广牛河队\n\n我们的两广队，就像四大名菜中的粤菜经典名肴一样，各有风格，精彩纷呈。有人细腻如清蒸鱼，讲究火候与原汁原味；有人豪爽如白切鸡，简单却直击人心；也有人沉稳如老火靓汤，耐心沉淀，炉火纯青。\n\n但要说最让人喜爱的，还是那道最接地气的大众美味——干炒牛河。宽滑的河粉裹着嫩香的牛肉，在热锅中翻腾出阵阵\"锅气\"，一口下去，焦香扑鼻，回味无穷。\n\n正如我们的队伍——平凡而低调，却凭着默契与火候，在阵阵锅气中，激荡出最纯粹的友情、浓香的美食，以及真挚的网球精神。\n\n🏆 总结\n\n七支队伍，七种风格，七种味道！从江南的精致到东北的豪爽，从福建的鲜美到湖北的劲道，每支队伍都将地方美食的精髓融入到网球技艺中，形成了独特的\"食神杯\"文化。\n\n这不仅是一场网球比赛，更是一场美食文化的盛宴！让我们在球场上见真章，在餐桌上品真情！",
    contentEn: "🏆 Meet the Seven Teams: Perfect Fusion of Food and Tennis\n\n🎾 Jiangsu/Zhejiang/Shanghai Lion Head Team\n\nWe are a group of fierce players who 'dominate both sweet and savory' on the court! Our serves are like xiaolongbao soup - precise and restrained yet with hidden explosive power. Our movement is like Shanghai pan-fried buns - crispy bottom, soft skin, with a touch of stubbornness! Our tactics are smoother than West Lake vinegar fish, our defense more solid than Dongpo pork, and occasionally we'll use a 'sweet and sour coaching ball' to sweeten our opponents!\n\nFinally, we are the Lion Head team - loose but not scattered, sticky but not clumpy! Ready to face the Jiangsu Lion Head Roar team?\n\n🍲 Fujian Buddha Jumps Over Wall Team\n\nWe are the Fujian Buddha Jumps Over Wall tennis team!\n\nJust like that pot of slowly simmered Buddha Jumps Over Wall, with sea cucumber, abalone, fish maw, and dried scallops gathering mountain and sea delicacies, we blend power, skill, perseverance, and wisdom into every shot. Fujian cuisine emphasizes 'freshness and harmony' - on the court, we also focus on teamwork and delicate touch. Even Buddha would jump over the wall when smelling the aroma - Fujian Buddha Jumps Over Wall, holding a bowl of fresh fragrance, playing a glorious match!\n\n🥬 Northeast Pickled Cabbage Stewed Noodles Team\n\nWe are the Northeast Pickled Cabbage Stewed Noodles team:\n\nNortheast cuisine emphasizes rich flavors and makes good use of local wild mushrooms, mountain vegetables, and abundant meat and seafood - our playing style is close to our cuisine, basically all wild ways!\n\nNortheast dishes are generous in portion, reflecting the bold and generous character of Northeasterners - that's why our team has many Northeastern sons-in-law!\n\nWe excel at stewing, braising, stir-frying, and deep-frying cooking methods, with stewed dishes being most famous. Our technical characteristics: Stewing - sticky play, Braising - fierce forehand and backhand, Stir-frying - oily slice, Deep-frying - fierce serves\n\nAll together: Cuihua, bring the pickled cabbage! [grinning]\n\n🍜 Hubei Hot Dry Noodles Team: Tennis Tactics on the Tip of the Tongue\n\nHubei Hot Dry Noodles tennis team, a team full of local flavor. Their playing style is like the cuisine of the Chu region, with solid foundation yet dynamic changes. They cleverly integrate the chewiness of hot dry noodles, the delicacy of fish balls, the Q-bounce of lotus root balls, and the lingering taste of lotus root and pork rib soup into tennis tactics, forming a unique 'Chu flavor' playing style.\n\n• Solid baseline: The chewiness of hot dry noodles, represented by Jinghua\n• Net volleys: The delicacy of fish balls, represented by CJ\n• Mid-court transitions: The Q-bounce of lotus root balls, represented by Liuyuan\n• Endurance: The lingering taste of lotus root and pork rib soup, represented by Xiaobai\n\n🥟 Tianjin Goubuli Dumplings Team\n\nTianjin local cuisine originated from folk culture, gaining advantage from geographical location in the North China Plain. There's a saying: 'For fish and shrimp, Tianjin is home.' Common home-style dishes include: Lao Bao San, Du Mian Jin, Du Mian Jin, Zeng Beng Carp, Guo Ta Li Ji, Tie Bo Bo Ao Xiao Yu, Qing Chao Xia Ren, Ba Da Wan, etc. Snacks include Goubuli dumplings, Maobu Wen dumplings, fried cakes, mahua, jianbing guozi, gaba cai, gao gan, etc. Although Tianjin cuisine is not among the 8 major cuisines, it represents the fusion of port culture, with snacks being the soul of Tianjin.\n\nOur Tianjin team plays with the beauty of Goubuli dumplings' 18 pleats, the weapons of Shiba Street mahua, the delicacy of Erduoyan fried cakes, the variety of jianbing guozi, and finally, if all else fails, let Er Ta Mama make 3 sugar pancakes to go fishing with everyone [grinning][grinning]\n\n🦆 Beijing Quanjude Roast Duck Team\n\nBeijing, besides roast duck, other dishes like zhajiangmian and douzhi are not grand enough, but it gathers delicacies from all over the country. Without the imperial city's endorsement, they can't be considered national-level cuisine.\n\nQuanjude team members must have noble virtues.\n\n🐂 Cantonese Beef Noodles Team\n\nOur Cantonese team is like the classic dishes of Cantonese cuisine among the four major cuisines, each with its own style and brilliance. Some are delicate like steamed fish, emphasizing timing and original flavor; some are bold like white-cut chicken, simple yet striking; others are steady like old fire soup, patient and refined.\n\nBut the most beloved is still that most down-to-earth popular delicacy - dry-fried beef noodles. Wide and smooth rice noodles wrapped around tender and fragrant beef, sizzling in the hot wok with bursts of 'wok hei' (breath of the wok). One bite brings charred aroma and endless aftertaste.\n\nJust like our team - ordinary and low-key, yet with understanding and timing, in bursts of wok hei, we stir up the purest friendship, rich cuisine, and sincere tennis spirit.\n\n🏆 Summary\n\nSeven teams, seven styles, seven flavors! From the refinement of Jiangnan to the boldness of Northeast, from the freshness of Fujian to the chewiness of Hubei, each team integrates the essence of local cuisine into tennis skills, forming a unique 'Food God Cup' culture.\n\nThis is not just a tennis tournament, but a feast of culinary culture! Let's see the real skills on the court and taste the true feelings at the dining table!"
  },
  {
    slug: 'shen-die-go-food-god-cup-introduction',
    title: '🎾🥟 圣地亚哥食神杯：网球、美食和友情的三重奏',
    titleEn: '🎾🥟 San Diego Food God Cup: The Perfect Blend of Tennis, Food, and Friendship',
    date: '2025-01-15',
    excerpt: '吃好、打好、玩好，顺便交朋友。圣地亚哥华人网球俱乐部食神杯正式启动！',
    excerptEn: 'Eat well, play well, have fun, and make friends along the way. The San Diego Chinese Tennis Club Food God Cup is officially launched!',
    content: "🎾🥟 圣地亚哥食神杯：网球、美食和友情的三重奏\n\n🍲 为什么要搞这个？\n\n一句话总结：吃好、打好、玩好，顺便交朋友。\n\n我们要做的，就是把圣地亚哥的华人吃货 + 网球爱好者们召集起来。打完球大家别急着跑，留下来吃一顿、秀一场，把友情、乡情都拉满！\n\n🏷️ 看名字就饿的球队榜\n\n目前已有 7 支战队，名字一个比一个下饭：\n• 🥟 天津狗不理包子队 – 队长雪峰\n• 🍲 福建佛跳墙队 – 队长卫东\n• 🍜 湖北热干面队 – 队长 Roger 007\n• 🥬 东北酸菜炖粉条队 – 队长胡哥\n• 🦆 北京全聚德烤鸭队 – 队长 Henry Shao\n• 🦁 江沪浙狮子头队 – 队长 Sophi\n• 🐂 两广牛河队 – 队长麦克\n\n光看队名就能感受到比赛当天的香味儿了……\n\n🎾 网球规则也能整花活\n• FOR AOR 规则随时可调，但原则只有一个：大家开心最重要！\n\n🔔 总结\n\n这不是单纯的网球赛，这是一个 吃货打球趴 + 美食才艺秀。\n能打球、能做饭、能唱歌的人都能在这里找到舞台。\n\n圣地亚哥食神杯，等你来拼：拼球技、拼厨艺、拼人缘！ 🍷🎤🍜",
    contentEn: "🎾🥟 San Diego Food God Cup: The Perfect Blend of Tennis, Food, and Friendship\n\n🍲 Why Are We Doing This?\n\nIn one sentence: Eat well, play well, have fun, and make friends along the way.\n\nWhat we want to do is bring together San Diego's Chinese food lovers and tennis enthusiasts. After playing tennis, don't rush off - stay for a meal, show off your talents, and build friendships and hometown connections!\n\n🏷️ Team Names That Make You Hungry\n\nWe currently have 7 teams with names that make your mouth water:\n• 🥟 Tianjin Goubuli Dumplings Team – Captain Xue Feng\n• 🍲 Fujian Buddha Jumps Over Wall Team – Captain Wei Dong\n• 🍜 Hubei Hot Dry Noodles Team – Captain Roger 007\n• 🥬 Northeast Pickled Cabbage Stewed Noodles Team – Captain Brother Hu\n• 🦆 Beijing Quanjude Roast Duck Team – Captain Henry Shao\n• 🦁 Jiangsu Lion Head Team – Captain Sophia\n• 🐂 Cantonese Beef Noodles Team – Captain Mike\n\nJust reading the team names makes you smell the delicious aromas of competition day...\n\n🎾 Tennis Rules Can Be Fun Too\n• Flexible match combinations: Men's doubles, women's doubles, mixed doubles, and maybe even a short men's singles match.\n• Flexible rules: We have ITF standard format and Pro 8 - whatever makes it exciting!\n• Scoring system: Match results only count for one-third of the total score, so don't worry!\n\n👨‍🍳 Food is the Ultimate Weapon\n• Culinary showdown: Each team brings their hometown signature dishes, everyone eats together and scores together.\n• Talent support: Singing, dancing, stand-up comedy, skits - all welcome to create the atmosphere!\n• High weight: Food, drinks, and entertainment combined can match the tennis scores.\n\nSo: Bad at tennis? No problem, good cooking can still win!\n\n🧭 Team Member Assignment: No Poaching!\n\nThe rules are simple:\n1. Birthplace (before high school) takes priority\n2. University location comes second\n3. Other conditions follow\n\nThis way, everyone knows where they stand and avoids transfer drama.\n\n🏆 Rewards & Penalties: Both Face and Trophies Matter\n• Floating trophy - Food God Cup: Champions take it home for a year.\n• Individual awards: Best player, best chef, best performer... all covered.\n• Penalty system: Not showing up, not participating, not contributing - all result in point deductions!\n\n🤝 Our Agreement\n• Respect opponents, respect the game, but mainly come to have fun.\n• Every team member must play at least once - no invisible players.\n• Rules can be adjusted anytime, but the principle remains: everyone's happiness is most important!\n\n🔔 Summary\n\nThis isn't just a tennis tournament - it's a foodie tennis party + culinary talent show.\nPeople who can play tennis, cook, or sing can all find their stage here.\n\nSan Diego Food God Cup, waiting for you to compete: compete in tennis skills, culinary arts, and social connections! 🍷🎤🍜"
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function latestPost() {
  return posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
}

// Function to get match results from localStorage or return default
function getMatchResultsFromStorage(): MatchResult[] {
  if (typeof window === 'undefined') {
    return defaultMatchResults; // Server-side rendering
  }
  
  try {
    const stored = localStorage.getItem('tennis-match-results');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Validate data structure
      if (!Array.isArray(parsed)) {
        console.warn('Invalid match results data structure, using default');
        return defaultMatchResults;
      }
      
      // Validate each result
      const validResults = parsed.filter(validateMatchResult);
      if (validResults.length !== parsed.length) {
        console.warn(`Filtered out ${parsed.length - validResults.length} invalid match results`);
      }
      
      // Ensure we always have the preseason game result
      const hasPreseason = validResults.some((result: MatchResult) => result.gameId === 'P1');
      if (!hasPreseason) {
        validResults.unshift(defaultMatchResults[0]);
      }
      
      return validResults;
    }
  } catch (error) {
    console.error('Error loading match results from localStorage:', error);
    // Try to load from backup
    const backup = getBackupData('matchResults');
    if (backup) {
      console.log('Loaded match results from backup');
      return backup;
    }
  }
  
  return defaultMatchResults;
}

// Function to save match results to localStorage
function saveMatchResultsToStorage(matchResults: MatchResult[]): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  try {
    // Validate data before saving
    const validResults = matchResults.filter(validateMatchResult);
    if (validResults.length !== matchResults.length) {
      console.warn(`Filtered out ${matchResults.length - validResults.length} invalid match results before saving`);
    }
    
    localStorage.setItem('tennis-match-results', JSON.stringify(validResults));
    
    // Create backup
    createBackup('matchResults', validResults);
  } catch (error) {
    console.error('Error saving match results to localStorage:', error);
  }
}

// Export match results with localStorage persistence
let _matchResults: MatchResult[] | null = null;
export const matchResults: MatchResult[] = (() => {
  if (_matchResults === null) {
    _matchResults = getMatchResultsFromStorage();
  }
  return _matchResults;
})() as MatchResult[];

// Function to refresh match results from storage
export function refreshMatchResultsFromStorage(): MatchResult[] {
  const refreshedResults = getMatchResultsFromStorage();
  matchResults.length = 0;
  matchResults.push(...refreshedResults);
  return refreshedResults;
}

// Function to add a new match result
export async function addMatchResult(result: MatchResult): Promise<void> {
  // Check if result already exists in Firebase before adding locally
  try {
    const existingResults = await getMatchResultsFromFirebase();
    const resultKey = `${result.gameId}-${result.homeTeamId}-${result.awayTeamId}-${result.submittedBy}`;
    
    // Check if this exact result already exists
    const isDuplicate = existingResults.some(existingResult => {
      const existingKey = `${existingResult.gameId}-${existingResult.homeTeamId}-${existingResult.awayTeamId}-${existingResult.submittedBy}`;
      return existingKey === resultKey;
    });
    
    if (isDuplicate) {
      console.log('Match result already exists in Firebase, skipping duplicate');
      return;
    }
  } catch (error) {
    console.warn('Could not check for duplicates, proceeding with result creation:', error);
  }
  
  matchResults.push(result);
  saveMatchResultsToStorage(matchResults);
  
  // Auto-sync to Firebase when new results are added
  syncToCloud().then(success => {
    if (success) {
      console.log('Match result automatically synced to Firebase');
    } else {
      console.warn('Failed to auto-sync match result to Firebase');
    }
  });
}

// Function to update an existing match result
export function updateMatchResult(resultId: string, updates: Partial<MatchResult>): boolean {
  const index = matchResults.findIndex(result => result.id === resultId);
  if (index !== -1) {
    matchResults[index] = { ...matchResults[index], ...updates };
    saveMatchResultsToStorage(matchResults);
    
    // Auto-sync to GitHub when results are updated
    syncToCloud().then(success => {
      if (success) {
        console.log('Updated match result automatically synced to GitHub');
      } else {
        console.warn('Failed to auto-sync updated match result to GitHub');
      }
    });
    
    return true;
  }
  return false;
}

// Function to remove a match result
export function removeMatchResult(resultId: string): boolean {
  const index = matchResults.findIndex(result => result.id === resultId);
  if (index !== -1) {
    matchResults.splice(index, 1);
    saveMatchResultsToStorage(matchResults);
    return true;
  }
  return false;
}
