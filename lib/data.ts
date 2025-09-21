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
  removeDuplicateMatchResults,
  getFoodPostsFromFirebase,
  addFoodPostToFirebase,
  updateFoodPostInFirebase,
  deleteFoodPostFromFirebase,
  addFoodCommentToFirebase,
  likeFoodPostInFirebase,
  likeFoodCommentInFirebase,
  subscribeToFoodPosts,
  syncTeamsAndPlayersToFirebase
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
  updatedAt?: string; // ISO timestamp for merge logic
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
  updatedAt?: string; // ISO timestamp for merge logic
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

export type FoodComment = {
  id: string;
  postId: string;
  author: string;
  authorTeam?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this comment
};

export type FoodPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorTeam?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this post
  comments: FoodComment[];
  commentIds?: string[]; // Array of comment IDs for Firebase storage
  tags: string[]; // e.g., ['川菜', '火锅', '推荐']
  imageUrl?: string; // Optional image URL
  location?: string; // Optional location where the food was found
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
      { id: 'DB01', name: '胡哥', nameEn: '胡哥', nickname: '胡烩肉', nicknameEn: '胡烩肉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'DB02', name: 'Cathy', nameEn: 'Cathy', nickname: '粘豆包', nicknameEn: '粘豆包', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'DB03', name: 'Fred Li', nameEn: 'Fred Li', nickname: '溜肉段', nicknameEn: '溜肉段', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB04', name: '老韩', nameEn: '老韩', nickname: '得莫利炖鱼', nicknameEn: '得莫利炖鱼', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB05', name: '京昂', nameEn: '京昂', nickname: '炸茄盒', nicknameEn: '炸茄盒', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'DB06', name: 'David Yang', nameEn: 'David Yang', nickname: '锅包肉', nicknameEn: '锅包肉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'DB07', name: '老范', nameEn: '老范', nickname: '熏鸡架', nicknameEn: '熏鸡架', experience: '3级', experienceEn: '3 Level', wins: 0, losses: 0 },
      { id: 'DB08', name: '小王', nameEn: '小王', nickname: '正宗兰州拉面', nicknameEn: '正宗兰州拉面', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB09', name: 'Bill', nameEn: 'Bill', nickname: '涮涮羊', nicknameEn: '涮涮羊', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB10', name: '金辉', nameEn: '金辉', nickname: '铁锅炖', nicknameEn: '铁锅炖', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB11', name: '墨旺', nameEn: '墨旺', nickname: '尖椒干豆腐', nicknameEn: '尖椒干豆腐', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB12', name: '许三多', nameEn: '许三多', nickname: '红火大油条', nicknameEn: '红火大油条', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'DB13', name: 'Cindy Lin', nameEn: 'Cindy Lin', nickname: '地三鲜', nicknameEn: '地三鲜', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
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
      { id: 'FJ01', name: 'Weidong', nameEn: 'Weidong', nickname: '海蛎煎', nicknameEn: '海蛎煎', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'FJ02', name: 'lao ye', nameEn: 'lao ye', nickname: '五香卷', nicknameEn: '五香卷', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'FJ03', name: 'Jim Yang', nameEn: 'Jim Yang', nickname: '杨梅', nicknameEn: '杨梅', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'FJ04', name: 'Carl Xiao', nameEn: 'Carl Xiao', nickname: '芋泥香酥鸭', nicknameEn: '芋泥香酥鸭', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'FJ05', name: 'Patrick', nameEn: 'Patrick', nickname: '荔枝肉', nicknameEn: '荔枝肉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'FJ06', name: 'Zhu Liang', nameEn: 'Zhu Liang', nickname: '米粿', nicknameEn: '米粿', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'FJ07', name: 'Jim Chen', nameEn: 'Jim Chen', nickname: '福州捞化', nicknameEn: '福州捞化', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ08', name: 'Ian Huang', nameEn: 'Ian Huang', nickname: '鱼丸扁肉燕', nicknameEn: '鱼丸扁肉燕', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ09', name: 'Isabella', nameEn: 'Isabella', nickname: '冰糖建莲羹', nicknameEn: '冰糖建莲羹', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ10', name: 'Huli', nameEn: 'Huli', nickname: '土笋冻', nicknameEn: '土笋冻', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'FJ11', name: 'Joi', nameEn: 'Joi', nickname: '肉丸仔', nicknameEn: '肉丸仔', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
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
      { id: 'BJ01', name: 'Jack', nameEn: 'Jack', nickname: '爆肚', nicknameEn: '爆肚', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ02', name: 'Wang Di', nameEn: 'Wang Di', nickname: '丰年炸灌肠儿', nicknameEn: '丰年炸灌肠儿', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ03', name: '庞博', nameEn: '庞博', nickname: '驴打滚', nicknameEn: '驴打滚', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ04', name: 'Ke Tao', nameEn: 'Ke Tao', nickname: '待定59', nicknameEn: '待定59', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ05', name: '霞', nameEn: '霞', nickname: '麻辣火锅', nicknameEn: '麻辣火锅', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ06', name: 'Frank Hao', nameEn: 'Frank Hao', nickname: '京八件', nicknameEn: '京八件', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ07', name: '中全', nameEn: '中全', nickname: '凉菜', nicknameEn: '凉菜', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ08', name: 'Linda', nameEn: 'Linda', nickname: '油旋', nicknameEn: '油旋', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ09', name: '韩丹伟', nameEn: '韩丹伟', nickname: '红焖羊蝎子', nicknameEn: '红焖羊蝎子', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ10', name: '马世红', nameEn: '马世红', nickname: '艾窝窝', nicknameEn: '艾窝窝', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ11', name: 'Sherry', nameEn: 'Sherry', nickname: '糖醋里脊', nicknameEn: '糖醋里脊', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'BJ12', name: 'Henry Shao', nameEn: 'Henry Shao', nickname: '素什锦', nicknameEn: '素什锦', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'BJ13', name: 'Yi Liu', nameEn: 'Yi Liu', nickname: '京酱肉丝', nicknameEn: '京酱肉丝', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'BJ14', name: '黄石', nameEn: '黄石', nickname: '炸酱面', nicknameEn: '炸酱面', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
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
      { id: 'LG01', name: 'Michael', nameEn: 'Michael', nickname: '老婆饼', nicknameEn: '老婆饼', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG02', name: 'Frankie', nameEn: 'Frankie', nickname: '云吞面', nicknameEn: '云吞面', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG03', name: 'Ken', nameEn: 'Ken', nickname: '龙虎凤', nicknameEn: '龙虎凤', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'LG04', name: 'Phung', nameEn: 'Phung', nickname: '煲仔饭', nicknameEn: '煲仔饭', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG05', name: 'Bin', nameEn: 'Bin', nickname: '艇仔粥', nicknameEn: '艇仔粥', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'LG06', name: 'Chan', nameEn: 'Chan', nickname: '椒盐猪排', nicknameEn: '椒盐猪排', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'LG07', name: 'Sheng', nameEn: 'Sheng', nickname: '酥皮蛋挞', nicknameEn: '酥皮蛋挞', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG08', name: 'Roy', nameEn: 'Roy', nickname: '菠萝包', nicknameEn: '菠萝包', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG09', name: 'Byung', nameEn: 'Byung', nickname: '牛肉肠粉', nicknameEn: '牛肉肠粉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG10', name: 'Katrina', nameEn: 'Katrina', nickname: '瑞士鸡翼', nicknameEn: '瑞士鸡翼', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG11', name: 'Carrie', nameEn: 'Carrie', nickname: '老友粉', nicknameEn: '老友粉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG12', name: 'Luke', nameEn: 'Luke', nickname: '滑蛋湿炒牛河', nicknameEn: '滑蛋湿炒牛河', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG13', name: 'Yunqiang', nameEn: 'Yunqiang', nickname: '桂林米粉', nicknameEn: '桂林米粉', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'LG14', name: 'Yuan', nameEn: 'Yuan', nickname: '柠檬鸭', nicknameEn: '柠檬鸭', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'LG15', name: '谷哥', nameEn: '谷哥', nickname: '糯米鸡', nicknameEn: '糯米鸡', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 }
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
      { id: 'TJ01', name: 'Xuefeng', nameEn: 'Xuefeng', nickname: '18街麻花', nicknameEn: '18街麻花', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'TJ02', name: 'Liu Yuan', nameEn: 'Liu Yuan', nickname: '炸糕', nicknameEn: '炸糕', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'TJ03', name: 'Han Peng', nameEn: 'Han Peng', nickname: '嘎巴菜', nicknameEn: '嘎巴菜', experience: '3级', experienceEn: '3 Level', wins: 0, losses: 0 },
      { id: 'TJ04', name: 'Wang XZ', nameEn: 'Wang XZ', nickname: '果篦儿', nicknameEn: '果篦儿', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ05', name: 'Jeff Yang', nameEn: 'Jeff Yang', nickname: '豆腐脑', nicknameEn: '豆腐脑', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'TJ06', name: 'Mike Yang', nameEn: 'Mike Yang', nickname: '煎饼', nicknameEn: '煎饼', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'TJ07', name: 'Dennis Du', nameEn: 'Dennis Du', nickname: '打卤面', nicknameEn: '打卤面', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'TJ08', name: 'Sharp Xiao', nameEn: 'Sharp Xiao', nickname: '八珍豆腐', nicknameEn: '八珍豆腐', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ09', name: 'Serena', nameEn: 'Serena', nickname: '三鲜包子', nicknameEn: '三鲜包子', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'TJ10', name: 'Lucy Liu', nameEn: 'Lucy Liu', nickname: '皮皮虾', nicknameEn: '皮皮虾', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ11', name: 'Jing Li', nameEn: 'Jing Li', nickname: '豆根糖', nicknameEn: '豆根糖', experience: '3级', experienceEn: '3 Level', wins: 0, losses: 0 },
      { id: 'TJ12', name: 'Jing Dong', nameEn: 'Jing Dong', nickname: '河螃蟹', nicknameEn: '河螃蟹', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'TJ13', name: 'Brian', nameEn: 'Brian', nickname: '酱爆八爪鱼', nicknameEn: '酱爆八爪鱼', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 }
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
      { id: 'JZ04', name: '马晓强', nameEn: '马晓强', nickname: '太湖三白', nicknameEn: '太湖三白', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'JZ05', name: 'Ed', nameEn: 'Ed', nickname: '糟卤小凤爪', nicknameEn: '糟卤小凤爪', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'JZ06', name: 'Xiaoxia', nameEn: 'Xiaoxia', nickname: '金华梅干菜酥饼', nicknameEn: '金华梅干菜酥饼', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'JZ07', name: 'Fred', nameEn: 'Fred', nickname: '清蒸大闸蟹', nicknameEn: '清蒸大闸蟹', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'JZ08', name: 'Kathy W', nameEn: 'Kathy W', nickname: '粉蒸肉', nicknameEn: '粉蒸肉', experience: '4.5级', experienceEn: '4.5 Level', wins: 0, losses: 0 },
      { id: 'JZ09', name: '阳光', nameEn: '阳光', nickname: '阳春面', nicknameEn: '阳春面', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'JZ10', name: 'Gary gao', nameEn: 'Gary gao', nickname: '待定54', nicknameEn: '待定54', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'JZ11', name: '叶远', nameEn: '叶远', nickname: '鸭血粉丝汤', nicknameEn: '鸭血粉丝汤', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 }
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
      { id: 'HB02', name: 'Xiaobai', nameEn: 'Xiaobai', nickname: '关山一盒酥', nicknameEn: '关山一盒酥', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'HB03', name: 'Lijun', nameEn: 'Lijun', nickname: '新豌豆', nicknameEn: '新豌豆', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'HB04', name: '中微子', nameEn: '中微子', nickname: '豆皮', nicknameEn: '豆皮', experience: '3.5级', experienceEn: '3.5 Level', wins: 0, losses: 0 },
      { id: 'HB05', name: 'Henry CJ', nameEn: 'Henry CJ', nickname: '卷蹄', nicknameEn: '卷蹄', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'HB06', name: 'Zhou Tao', nameEn: 'Zhou Tao', nickname: '鱼糕', nicknameEn: '鱼糕', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
      { id: 'HB07', name: 'Jinghua', nameEn: 'Jinghua', nickname: '小龙虾', nicknameEn: '小龙虾', experience: '4级', experienceEn: '4 Level', wins: 0, losses: 0 },
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
    // Test localStorage availability first
    const testKey = 'tennis-storage-test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
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
    
    // Try sessionStorage as fallback for mobile private mode
    try {
      const sessionStored = sessionStorage.getItem('tennis-schedule');
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        if (Array.isArray(parsed)) {
          console.log('Loaded schedule from sessionStorage fallback');
          return parsed.filter(validateGame);
        }
      }
    } catch (sessionError) {
      console.error('SessionStorage also failed:', sessionError);
    }
    
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
    
    // Test localStorage availability (mobile private mode can block it)
    const testKey = 'tennis-storage-test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    localStorage.setItem('tennis-schedule', JSON.stringify(validSchedule));
    
    // Create backup
    createBackup('schedule', validSchedule);
  } catch (error) {
    console.error('Error saving schedule to localStorage:', error);
    // If localStorage fails, try to use sessionStorage as fallback
    try {
      sessionStorage.setItem('tennis-schedule', JSON.stringify(schedule));
      console.warn('localStorage failed, using sessionStorage as fallback');
    } catch (sessionError) {
      console.error('Both localStorage and sessionStorage failed:', sessionError);
      throw new Error('Storage not available. Please check your browser settings.');
    }
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
    
    // CRITICAL: Sync teams and players first (foundation data)
    console.log('🔄 Syncing teams and players to Firebase...');
    await syncTeamsAndPlayersToFirebase(teams);
    
    // Get current data from localStorage
    const currentSchedule = getScheduleFromStorage();
    const currentResults = getMatchResultsFromStorage();
    
    // Sync schedule to Firebase - check for duplicates first
    const existingGames = await getScheduleFromFirebase();
    const existingGameIds = new Set(existingGames.filter(g => g && g.id).map(g => g.id));
    
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
    
    console.log(`🎉 All data synced to Firebase by: ${captainName || 'unknown'}`);
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
    
    // Get current local data to check for newer changes
    const currentLocalSchedule = getScheduleFromStorage();
    const currentLocalResults = getMatchResultsFromStorage();
    
    console.log(`Current local schedule: ${currentLocalSchedule.length} games`);
    console.log(`Current local results: ${currentLocalResults.length} results`);
    
    // Merge Firebase data with local changes (preserve local changes if they're newer)
    const mergedSchedule = mergeScheduleData(validSchedule, currentLocalSchedule);
    const mergedResults = mergeMatchResultsData(validResults, currentLocalResults);
    
    console.log(`Merged schedule: ${mergedSchedule.length} games`);
    console.log(`Merged results: ${mergedResults.length} results`);
    
    // CRITICAL: Push any local changes back to Firebase to maintain single source of truth
    await syncLocalChangesToFirebase(mergedSchedule, mergedResults, validSchedule, validResults);
    
    // Apply the merged data to localStorage
    localStorage.setItem('tennis-schedule', JSON.stringify(mergedSchedule));
    localStorage.setItem('tennis-match-results', JSON.stringify(mergedResults));
    
    if (validSchedule.length > 0) {
      console.log(`Synced ${validSchedule.length} games from Firebase`);
    } else {
      console.log('No games in Firebase - localStorage cleared');
    }
    
    if (validResults.length > 0) {
      console.log(`Synced ${validResults.length} match results from Firebase`);
    } else {
      console.log('No match results in Firebase - localStorage cleared');
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

// Initialize schedule from storage (will be overridden by Firestore sync)
export const schedule: Game[] = getScheduleFromStorage();

// CRITICAL: Function to ensure Firestore is the single source of truth
// Function to merge schedule data, preserving local changes if they're newer
function mergeScheduleData(firebaseData: Game[], localData: Game[]): Game[] {
  const merged: Game[] = [...firebaseData];
  
  // Add local games that don't exist in Firebase
  for (const localGame of localData) {
    const existsInFirebase = firebaseData.some(fbGame => fbGame.id === localGame.id);
    if (!existsInFirebase) {
      console.log(`📝 Adding local game to merged data: ${localGame.id}`);
      merged.push(localGame);
    } else {
      // Check if local game is newer (has more recent updates)
      const firebaseGame = firebaseData.find(fbGame => fbGame.id === localGame.id);
      if (firebaseGame && localGame.updatedAt && firebaseGame.updatedAt) {
        const localTime = new Date(localGame.updatedAt).getTime();
        const firebaseTime = new Date(firebaseGame.updatedAt).getTime();
        if (localTime > firebaseTime) {
          console.log(`📝 Local game is newer, using local version: ${localGame.id}`);
          const index = merged.findIndex(g => g.id === localGame.id);
          if (index !== -1) {
            merged[index] = localGame;
          }
        }
      }
    }
  }
  
  return merged;
}

// Function to merge match results data, preserving local changes if they're newer
function mergeMatchResultsData(firebaseData: MatchResult[], localData: MatchResult[]): MatchResult[] {
  const merged: MatchResult[] = [...firebaseData];
  
  // Add local results that don't exist in Firebase
  for (const localResult of localData) {
    const existsInFirebase = firebaseData.some(fbResult => fbResult.id === localResult.id);
    if (!existsInFirebase) {
      console.log(`📝 Adding local result to merged data: ${localResult.id}`);
      merged.push(localResult);
    } else {
      // Check if local result is newer
      const firebaseResult = firebaseData.find(fbResult => fbResult.id === localResult.id);
      if (firebaseResult && localResult.updatedAt && firebaseResult.updatedAt) {
        const localTime = new Date(localResult.updatedAt).getTime();
        const firebaseTime = new Date(firebaseResult.updatedAt).getTime();
        if (localTime > firebaseTime) {
          console.log(`📝 Local result is newer, using local version: ${localResult.id}`);
          const index = merged.findIndex(r => r.id === localResult.id);
          if (index !== -1) {
            merged[index] = localResult;
          }
        }
      }
    }
  }
  
  return merged;
}

// Function to sync local changes back to Firebase to maintain single source of truth
async function syncLocalChangesToFirebase(
  mergedSchedule: Game[], 
  mergedResults: MatchResult[], 
  firebaseSchedule: Game[], 
  firebaseResults: MatchResult[]
): Promise<void> {
  try {
    console.log('🔄 Syncing local changes to Firebase...');
    
    // Find games that exist in merged data but not in Firebase (new local games)
    const newGames = mergedSchedule.filter(mergedGame => 
      !firebaseSchedule.some(fbGame => fbGame.id === mergedGame.id)
    );
    
    // Find games that have been updated locally (different from Firebase version)
    const updatedGames = mergedSchedule.filter(mergedGame => {
      const firebaseGame = firebaseSchedule.find(fbGame => fbGame.id === mergedGame.id);
      if (!firebaseGame) return false;
      
      // Check if local version is newer
      if (mergedGame.updatedAt && firebaseGame.updatedAt) {
        const localTime = new Date(mergedGame.updatedAt).getTime();
        const firebaseTime = new Date(firebaseGame.updatedAt).getTime();
        return localTime > firebaseTime;
      }
      
      // If no timestamps, compare the objects
      return JSON.stringify(mergedGame) !== JSON.stringify(firebaseGame);
    });
    
    // Find results that exist in merged data but not in Firebase
    const newResults = mergedResults.filter(mergedResult => 
      !firebaseResults.some(fbResult => fbResult.id === mergedResult.id)
    );
    
    // Find results that have been updated locally
    const updatedResults = mergedResults.filter(mergedResult => {
      const firebaseResult = firebaseResults.find(fbResult => fbResult.id === mergedResult.id);
      if (!firebaseResult) return false;
      
      // Check if local version is newer
      if (mergedResult.updatedAt && firebaseResult.updatedAt) {
        const localTime = new Date(mergedResult.updatedAt).getTime();
        const firebaseTime = new Date(firebaseResult.updatedAt).getTime();
        return localTime > firebaseTime;
      }
      
      // If no timestamps, compare the objects
      return JSON.stringify(mergedResult) !== JSON.stringify(firebaseResult);
    });
    
    console.log(`📝 Found ${newGames.length} new games to sync to Firebase`);
    console.log(`📝 Found ${updatedGames.length} updated games to sync to Firebase`);
    console.log(`📝 Found ${newResults.length} new results to sync to Firebase`);
    console.log(`📝 Found ${updatedResults.length} updated results to sync to Firebase`);
    
    // Sync new games to Firebase
    for (const game of newGames) {
      try {
        console.log(`🔄 Syncing new game to Firebase: ${game.id}`);
        await addGameToFirebase(game);
        console.log(`✅ New game synced to Firebase: ${game.id}`);
      } catch (error) {
        console.error(`❌ Failed to sync new game to Firebase: ${game.id}`, error);
      }
    }
    
    // Sync updated games to Firebase
    for (const game of updatedGames) {
      try {
        console.log(`🔄 Syncing updated game to Firebase: ${game.id}`);
        await updateGameInFirebase(game.id, game);
        console.log(`✅ Updated game synced to Firebase: ${game.id}`);
      } catch (error) {
        console.error(`❌ Failed to sync updated game to Firebase: ${game.id}`, error);
      }
    }
    
    // Sync new results to Firebase
    for (const result of newResults) {
      try {
        console.log(`🔄 Syncing new result to Firebase: ${result.id}`);
        await addMatchResultToFirebase(result);
        console.log(`✅ New result synced to Firebase: ${result.id}`);
      } catch (error) {
        console.error(`❌ Failed to sync new result to Firebase: ${result.id}`, error);
      }
    }
    
    // Sync updated results to Firebase
    for (const result of updatedResults) {
      try {
        console.log(`🔄 Syncing updated result to Firebase: ${result.id}`);
        await updateMatchResultInFirebase(result.id, result);
        console.log(`✅ Updated result synced to Firebase: ${result.id}`);
      } catch (error) {
        console.error(`❌ Failed to sync updated result to Firebase: ${result.id}`, error);
      }
    }
    
    console.log('✅ Local changes synced to Firebase successfully');
  } catch (error) {
    console.error('❌ Error syncing local changes to Firebase:', error);
  }
}

export async function ensureFirestoreIsSourceOfTruth(): Promise<void> {
  if (typeof window === 'undefined') return; // Server-side rendering
  
  try {
    console.log('🔄 Ensuring Firestore is the single source of truth...');
    
    // First, ensure teams and players are synced to Firestore
    console.log('🔄 Syncing teams and players to Firestore...');
    await syncTeamsAndPlayersToFirebase(teams);
    
    // Then sync from Firestore to get the latest data
    const syncSuccess = await syncFromCloud();
    if (syncSuccess) {
      console.log('✅ Firestore sync completed - Firestore is now the source of truth');
    } else {
      console.warn('⚠️ Firestore sync failed, using local data as fallback');
    }
  } catch (error) {
    console.error('❌ Error ensuring Firestore is source of truth:', error);
  }
}

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
export async function addGameToSchedule(game: Game): Promise<Game> {
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
      return game; // Return the original game if it's a duplicate
    }
  } catch (error) {
    console.warn('Could not check for duplicates, proceeding with game creation:', error);
  }
  
  // CRITICAL: Add to Firestore FIRST (single source of truth)
  try {
    const firebaseId = await addGameToFirebase(game);
    if (!firebaseId) {
      throw new Error('Failed to add game to Firestore');
    }
    console.log('✅ Game successfully added to Firestore with ID:', firebaseId);
    
    // Update the game with the Firestore ID
    const gameWithFirebaseId = { ...game, id: firebaseId };
    
    // Then add to local storage
    schedule.push(gameWithFirebaseId);
    saveScheduleToStorage(schedule);
    
    console.log('✅ Game successfully synced to local storage');
    
    // Return the game with the Firestore ID
    return gameWithFirebaseId;
  } catch (error) {
    console.error('❌ Failed to add game to Firestore:', error);
    throw new Error(`Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to remove a game from the schedule
export async function removeGameFromSchedule(gameId: string): Promise<boolean> {
  console.log('removeGameFromSchedule called with gameId:', gameId);
  console.log('Current schedule length:', schedule.length);
  
  const index = schedule.findIndex(game => game && game.id === gameId);
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
    console.log('Available games:', schedule.map(g => g ? { id: g.id, home: g.home, away: g.away } : null).filter(Boolean));
  }
  return false;
}

// Function to update game information
export async function updateGameInfo(gameId: string, updates: Partial<Game>): Promise<boolean> {
  console.log('🔄 Updating game:', gameId, 'with updates:', updates);
  
  const index = schedule.findIndex(game => game && game.id === gameId);
  if (index === -1) {
    console.error('❌ Game not found in schedule:', gameId);
    return false;
  }
  
  const updatedGame = { 
    ...schedule[index], 
    ...updates,
    updatedAt: new Date().toISOString() // Add timestamp for merge logic
  };
  console.log('📝 Updated game object:', updatedGame);
  
  // CRITICAL: Update Firestore FIRST (single source of truth)
  try {
    console.log('🔥 Attempting to update game in Firestore...');
    const success = await updateGameInFirebase(gameId, updatedGame);
    if (!success) {
      console.error('❌ Firestore update returned false');
      throw new Error('Failed to update game in Firestore');
    }
    console.log('✅ Game successfully updated in Firestore');
    
    // Then update local storage
    schedule[index] = updatedGame;
    saveScheduleToStorage(schedule);
    
    console.log('✅ Game successfully synced to local storage');
    return true;
  } catch (error) {
    console.error('❌ Failed to update game in Firestore:', error);
    // For now, let's still update local storage even if Firestore fails
    // This ensures the UI works even if there are Firebase connectivity issues
    console.log('⚠️ Firestore update failed, updating local storage only');
    schedule[index] = updatedGame;
    saveScheduleToStorage(schedule);
    console.log('✅ Game updated in local storage (Firestore sync failed)');
    return true; // Return true to allow the UI to work
  }
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
    slug: 'opening-ceremony-announcement',
    title: '🎾🏆 食神杯开幕式通知',
    titleEn: '🎾🏆 Food God Cup Opening Ceremony Announcement',
    date: '2025-01-21',
    excerpt: '食神杯开幕式即将开始！请大家准时参加集体合影和比赛。',
    excerptEn: 'The Food God Cup Opening Ceremony is about to begin! Please join us for the group photo and matches.',
    content: "🎾🏆 食神杯开幕式通知\n\n📍 地点：Kit Carson park tennis court\n⏰ 时间：09/27 2:30-6:30\n🏠 地址：3333 Bear Valley Parkway, Escondido CA\n\n📸 重要提醒：\n请大家参加27号开幕式的球友们2:50准时到场，我们集体合影。3:00开始比赛。\n\n🍽️ 聚餐安排：\n7:00聚餐，请参加聚餐参与接龙多谢大家合作支持。\n\n🏆 特别活动：\n聚餐现场将选出第一轮的最佳表现奖一位并颁发小奖品\n\n期待与大家在开幕式上相见！🎾🥟",
    contentEn: "🎾🏆 Food God Cup Opening Ceremony Announcement\n\n📍 Location: Kit Carson park tennis court\n⏰ Time: 09/27 2:30-6:30\n🏠 Address: 3333 Bear Valley Parkway, Escondido CA\n\n📸 Important Reminder:\nAll players participating in the opening ceremony on the 27th, please arrive on time at 2:50 for our group photo. Matches will begin at 3:00.\n\n🍽️ Dinner Arrangement:\nDinner at 7:00, please participate in the dinner sign-up. Thank you for your cooperation and support.\n\n🏆 Special Activity:\nAt the dinner, we will select one best performer from the first round and award a small prize.\n\nLooking forward to seeing everyone at the opening ceremony! 🎾🥟"
  },
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
export async function addMatchResult(result: MatchResult): Promise<MatchResult> {
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
      return result; // Return the original result if it's a duplicate
    }
  } catch (error) {
    console.warn('Could not check for duplicates, proceeding with result creation:', error);
  }
  
  // CRITICAL: Add to Firestore FIRST (single source of truth)
  try {
    const firebaseId = await addMatchResultToFirebase(result);
    if (!firebaseId) {
      throw new Error('Failed to add match result to Firestore');
    }
    console.log('✅ Match result successfully added to Firestore with ID:', firebaseId);
    
    // Update the result with the Firestore ID
    const resultWithFirebaseId = { ...result, id: firebaseId };
    
    // Then add to local storage
    matchResults.push(resultWithFirebaseId);
    saveMatchResultsToStorage(matchResults);
    
    console.log('✅ Match result successfully synced to local storage');
    
    // Return the result with the Firestore ID
    return resultWithFirebaseId;
  } catch (error) {
    console.error('❌ Failed to add match result to Firestore:', error);
    throw new Error(`Failed to create match result: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to update an existing match result
export async function updateMatchResult(resultId: string, updates: Partial<MatchResult>): Promise<boolean> {
  const index = matchResults.findIndex(result => result.id === resultId);
  if (index !== -1) {
    const updatedResult = { ...matchResults[index], ...updates };
    
    // CRITICAL: Update Firestore FIRST (single source of truth)
    try {
      const success = await updateMatchResultInFirebase(resultId, updates);
      if (!success) {
        throw new Error('Failed to update match result in Firestore');
      }
      console.log('✅ Match result successfully updated in Firestore');
      
      // Then update local storage
      matchResults[index] = updatedResult;
      saveMatchResultsToStorage(matchResults);
      
      console.log('✅ Match result successfully synced to local storage');
      return true;
    } catch (error) {
      console.error('❌ Failed to update match result in Firestore:', error);
      throw new Error(`Failed to update match result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

// Food Posts Data and Functions
export const foodPosts: FoodPost[] = [
  {
    id: 'FP001',
    title: '圣地亚哥最好吃的川菜馆推荐',
    content: '今天去了Convoy Street上的川菜馆，水煮鱼和麻婆豆腐都超级正宗！老板是四川人，味道很地道。推荐大家去试试！',
    author: '天津队长',
    authorTeam: '天津狗不理包子队',
    authorId: 'TJ01',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    likes: 12,
    likedBy: ['FJ01', 'HB01', 'DB01', 'BJ01', 'JZ01', 'LG01'],
    comments: [
      {
        id: 'FC001',
        postId: 'FP001',
        author: '福建队长',
        authorTeam: '福建佛跳墙队',
        content: '我也去过！他们家的夫妻肺片也很棒！',
        createdAt: '2024-01-15T11:00:00Z',
        likes: 3,
        likedBy: ['TJ01', 'HB01', 'DB01']
      }
    ],
    tags: ['川菜', '推荐', 'Convoy Street'],
    location: 'Convoy Street, San Diego'
  },
  {
    id: 'FP002',
    title: '周末聚餐好去处 - 火锅推荐',
    content: '和队友们去了Little Sheep Mongolian Hot Pot，环境很好，食材新鲜，汤底选择多。特别推荐他们的羊肉和虾滑！',
    author: '湖北队长',
    authorTeam: '湖北热干面队',
    authorId: 'HB01',
    createdAt: '2024-01-14T19:00:00Z',
    updatedAt: '2024-01-14T19:00:00Z',
    likes: 8,
    likedBy: ['TJ01', 'FJ01', 'DB01', 'BJ01'],
    comments: [],
    tags: ['火锅', '聚餐', '推荐'],
    location: 'Little Sheep Mongolian Hot Pot'
  },
  {
    id: 'FP003',
    title: '自己做的东北酸菜炖粉条',
    content: '今天在家复刻了东北酸菜炖粉条，用的是从中国超市买的酸菜，味道还不错！有队友想学的话可以交流一下做法。',
    author: '东北队长',
    authorTeam: '东北酸菜炖粉条队',
    authorId: 'DB01',
    createdAt: '2024-01-13T16:30:00Z',
    updatedAt: '2024-01-13T16:30:00Z',
    likes: 15,
    likedBy: ['TJ01', 'FJ01', 'HB01', 'BJ01', 'JZ01', 'LG01'],
    comments: [
      {
        id: 'FC002',
        postId: 'FP003',
        author: '北京队长',
        authorTeam: '北京全聚德烤鸭队',
        content: '求做法！看起来很好吃！',
        createdAt: '2024-01-13T17:00:00Z',
        likes: 2,
        likedBy: ['TJ01', 'FJ01']
      }
    ],
    tags: ['东北菜', '家常菜', '分享'],
    imageUrl: '/images/food/酸菜炖粉条.jpg'
  },
  {
    id: 'FP004',
    title: '推荐一家超棒的粤菜餐厅',
    content: '在Mira Mesa发现了一家很正宗的粤菜馆，他们的白切鸡和烧鸭都很棒！环境也很不错，适合聚餐。',
    author: '两广队长',
    authorTeam: '两广牛河队',
    authorId: 'LG01',
    createdAt: '2024-01-16T12:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    likes: 6,
    likedBy: ['TJ01', 'FJ01', 'HB01', 'DB01', 'BJ01', 'JZ01'],
    comments: [],
    tags: ['粤菜', '推荐', '聚餐'],
    location: 'Mira Mesa, San Diego'
  }
];

// Food Posts Functions - Now using Firebase
export async function getFoodPosts(): Promise<FoodPost[]> {
  try {
    return await getFoodPostsFromFirebase();
  } catch (error) {
    console.error('Error getting food posts:', error);
    return foodPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function addFoodPost(post: Omit<FoodPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>): Promise<FoodPost | null> {
  try {
    const postId = await addFoodPostToFirebase(post);
    if (postId) {
      const newPost: FoodPost = {
        ...post,
        id: postId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: []
      };
      
      // Also add to local array for fallback
      foodPosts.unshift(newPost);
      return newPost;
    }
    return null;
  } catch (error) {
    console.error('Error adding food post:', error);
    // Fallback to local storage
    const newPost: FoodPost = {
      ...post,
      id: `FP${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    foodPosts.unshift(newPost);
    return newPost;
  }
}

export async function addFoodComment(postId: string, comment: Omit<FoodComment, 'id' | 'createdAt' | 'likes' | 'likedBy'>): Promise<FoodComment | null> {
  try {
    const commentId = await addFoodCommentToFirebase(postId, comment);
    if (commentId) {
      const newComment: FoodComment = {
        ...comment,
        id: commentId,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: []
      };
      
      // Also add to local array for fallback
      const post = foodPosts.find(p => p.id === postId);
      if (post) {
        post.comments.push(newComment);
        post.updatedAt = new Date().toISOString();
      }
      
      return newComment;
    }
    return null;
  } catch (error) {
    console.error('Error adding food comment:', error);
    // Fallback to local storage
    const newComment: FoodComment = {
      ...comment,
      id: `FC${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };
    
    const post = foodPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push(newComment);
      post.updatedAt = new Date().toISOString();
    }
    
    return newComment;
  }
}

export async function likeFoodPost(postId: string, userId: string): Promise<boolean> {
  try {
    const success = await likeFoodPostInFirebase(postId, userId);
    if (success) {
      // Also update local array for fallback
      const post = foodPosts.find(p => p.id === postId);
      if (post) {
        const index = post.likedBy.indexOf(userId);
        if (index === -1) {
          post.likedBy.push(userId);
          post.likes++;
        } else {
          post.likedBy.splice(index, 1);
          post.likes--;
        }
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error liking food post:', error);
    // Fallback to local storage
    const post = foodPosts.find(p => p.id === postId);
    if (post) {
      const index = post.likedBy.indexOf(userId);
      if (index === -1) {
        post.likedBy.push(userId);
        post.likes++;
      } else {
        post.likedBy.splice(index, 1);
        post.likes--;
      }
      return true;
    }
    return false;
  }
}

export async function likeFoodComment(postId: string, commentId: string, userId: string): Promise<boolean> {
  try {
    const success = await likeFoodCommentInFirebase(commentId, userId);
    if (success) {
      // Also update local array for fallback
      const post = foodPosts.find(p => p.id === postId);
      if (post) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
          const index = comment.likedBy.indexOf(userId);
          if (index === -1) {
            comment.likedBy.push(userId);
            comment.likes++;
          } else {
            comment.likedBy.splice(index, 1);
            comment.likes--;
          }
        }
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error liking food comment:', error);
    // Fallback to local storage
    const post = foodPosts.find(p => p.id === postId);
    if (post) {
      const comment = post.comments.find(c => c.id === commentId);
      if (comment) {
        const index = comment.likedBy.indexOf(userId);
        if (index === -1) {
          comment.likedBy.push(userId);
          comment.likes++;
        } else {
          comment.likedBy.splice(index, 1);
          comment.likes--;
        }
        return true;
      }
    }
    return false;
  }
}

// Real-time subscription for food posts
export function subscribeToFoodPostsRealtime(callback: (posts: FoodPost[]) => void): () => void {
  return subscribeToFoodPosts(callback);
}
