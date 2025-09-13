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
  { id: 'P1', date: new Date(Date.now() - 7*86400000).toISOString(), home: 'TJG', away: 'FJT', venue: 'Kit Carson', time: '7:00 PM', homeScore: 3, awayScore: 2, isPreseason: true, status: 'preseason' }
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
      // Ensure we always have the preseason game
      const hasPreseason = parsed.some((game: Game) => game.id === 'P1');
      if (!hasPreseason) {
        parsed.unshift(defaultSchedule[0]);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading schedule from localStorage:', error);
  }
  
  return defaultSchedule;
}

// Function to save schedule to localStorage
function saveScheduleToStorage(schedule: Game[]): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  try {
    localStorage.setItem('tennis-schedule', JSON.stringify(schedule));
  } catch (error) {
    console.error('Error saving schedule to localStorage:', error);
  }
}

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
export function addGameToSchedule(game: Game): void {
  schedule.push(game);
  saveScheduleToStorage(schedule);
}

// Function to remove a game from the schedule
export function removeGameFromSchedule(gameId: string): boolean {
  const index = schedule.findIndex(game => game.id === gameId);
  if (index !== -1) {
    schedule.splice(index, 1);
    saveScheduleToStorage(schedule);
    return true;
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
      // Ensure we always have the preseason game result
      const hasPreseason = parsed.some((result: MatchResult) => result.gameId === 'P1');
      if (!hasPreseason) {
        parsed.unshift(defaultMatchResults[0]);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading match results from localStorage:', error);
  }
  
  return defaultMatchResults;
}

// Function to save match results to localStorage
function saveMatchResultsToStorage(matchResults: MatchResult[]): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  try {
    localStorage.setItem('tennis-match-results', JSON.stringify(matchResults));
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
export function addMatchResult(result: MatchResult): void {
  matchResults.push(result);
  saveMatchResultsToStorage(matchResults);
}

// Function to update an existing match result
export function updateMatchResult(resultId: string, updates: Partial<MatchResult>): boolean {
  const index = matchResults.findIndex(result => result.id === resultId);
  if (index !== -1) {
    matchResults[index] = { ...matchResults[index], ...updates };
    saveMatchResultsToStorage(matchResults);
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
