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
    founded: 2018,
    arena: 'Northeast Tennis Center',
    arenaEn: 'Northeast Tennis Center',
    roster: [
      { id: 'DND1', name: '张强', nameEn: 'Zhang Qiang', position: '单打', positionEn: 'Singles', age: 28, experience: '专业级', experienceEn: 'Professional' },
      { id: 'DND2', name: '李娜', nameEn: 'Li Na', position: '双打', positionEn: 'Doubles', age: 25, experience: '高级', experienceEn: 'Advanced' },
      { id: 'DND3', name: '王明', nameEn: 'Wang Ming', position: '混双', positionEn: 'Mixed Doubles', age: 30, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'DND4', name: '陈雪', nameEn: 'Chen Xue', position: '替补', positionEn: 'Substitute', age: 22, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2019,
    arena: 'Fujian Tennis Club',
    arenaEn: 'Fujian Tennis Club',
    roster: [
      { id: 'FJT1', name: '林志华', nameEn: 'Lin Zhihua', position: '单打', positionEn: 'Singles', age: 26, experience: '专业级', experienceEn: 'Professional' },
      { id: 'FJT2', name: '黄美玲', nameEn: 'Huang Meiling', position: '双打', positionEn: 'Doubles', age: 24, experience: '高级', experienceEn: 'Advanced' },
      { id: 'FJT3', name: '郑伟', nameEn: 'Zheng Wei', position: '混双', positionEn: 'Mixed Doubles', age: 29, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'FJT4', name: '吴晓', nameEn: 'Wu Xiao', position: '替补', positionEn: 'Substitute', age: 23, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2017,
    arena: 'Beijing Tennis Academy',
    arenaEn: 'Beijing Tennis Academy',
    roster: [
      { id: 'BJD1', name: '刘建国', nameEn: 'Liu Jianguo', position: '单打', positionEn: 'Singles', age: 31, experience: '专业级', experienceEn: 'Professional' },
      { id: 'BJD2', name: '赵丽华', nameEn: 'Zhao Lihua', position: '双打', positionEn: 'Doubles', age: 27, experience: '高级', experienceEn: 'Advanced' },
      { id: 'BJD3', name: '孙大伟', nameEn: 'Sun Dawei', position: '混双', positionEn: 'Mixed Doubles', age: 25, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'BJD4', name: '周小敏', nameEn: 'Zhou Xiaomin', position: '替补', positionEn: 'Substitute', age: 21, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2020,
    arena: 'Guangdong Tennis Center',
    arenaEn: 'Guangdong Tennis Center',
    roster: [
      { id: 'LGN1', name: '陈志明', nameEn: 'Chen Zhiming', position: '单打', positionEn: 'Singles', age: 29, experience: '专业级', experienceEn: 'Professional' },
      { id: 'LGN2', name: '李小红', nameEn: 'Li Xiaohong', position: '双打', positionEn: 'Doubles', age: 26, experience: '高级', experienceEn: 'Advanced' },
      { id: 'LGN3', name: '黄志强', nameEn: 'Huang Zhiqiang', position: '混双', positionEn: 'Mixed Doubles', age: 28, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'LGN4', name: '张美玲', nameEn: 'Zhang Meiling', position: '替补', positionEn: 'Substitute', age: 24, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2016,
    arena: 'Tianjin Tennis Club',
    arenaEn: 'Tianjin Tennis Club',
    roster: [
      { id: 'TJG1', name: '王大力', nameEn: 'Wang Dali', position: '单打', positionEn: 'Singles', age: 27, experience: '专业级', experienceEn: 'Professional' },
      { id: 'TJG2', name: '刘美丽', nameEn: 'Liu Meili', position: '双打', positionEn: 'Doubles', age: 25, experience: '高级', experienceEn: 'Advanced' },
      { id: 'TJG3', name: '张伟', nameEn: 'Zhang Wei', position: '混双', positionEn: 'Mixed Doubles', age: 30, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'TJG4', name: '李娜娜', nameEn: 'Li Nana', position: '替补', positionEn: 'Substitute', age: 22, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2021,
    arena: 'Jiangsu Tennis Academy',
    arenaEn: 'Jiangsu Tennis Academy',
    roster: [
      { id: 'JZH1', name: '徐志强', nameEn: 'Xu Zhiqiang', position: '单打', positionEn: 'Singles', age: 26, experience: '专业级', experienceEn: 'Professional' },
      { id: 'JZH2', name: '杨丽华', nameEn: 'Yang Lihua', position: '双打', positionEn: 'Doubles', age: 24, experience: '高级', experienceEn: 'Advanced' },
      { id: 'JZH3', name: '朱小明', nameEn: 'Zhu Xiaoming', position: '混双', positionEn: 'Mixed Doubles', age: 28, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'JZH4', name: '钱小芳', nameEn: 'Qian Xiaofang', position: '替补', positionEn: 'Substitute', age: 23, experience: '初级', experienceEn: 'Beginner' }
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
    founded: 2015,
    arena: 'Hubei Tennis Center',
    arenaEn: 'Hubei Tennis Center',
    roster: [
      { id: 'HBR1', name: '何志华', nameEn: 'He Zhihua', position: '单打', positionEn: 'Singles', age: 30, experience: '专业级', experienceEn: 'Professional' },
      { id: 'HBR2', name: '邓小丽', nameEn: 'Deng Xiaoli', position: '双打', positionEn: 'Doubles', age: 27, experience: '高级', experienceEn: 'Advanced' },
      { id: 'HBR3', name: '胡大伟', nameEn: 'Hu Dawei', position: '混双', positionEn: 'Mixed Doubles', age: 29, experience: '中级', experienceEn: 'Intermediate' },
      { id: 'HBR4', name: '田小敏', nameEn: 'Tian Xiaomin', position: '替补', positionEn: 'Substitute', age: 25, experience: '初级', experienceEn: 'Beginner' }
    ]
  }
];

export const teamsById = Object.fromEntries(teams.map(t => [t.id, t] as const));

export const schedule: Game[] = [
  // Preseason Game
  { id: 'P1', date: new Date(Date.now() - 7*86400000).toISOString(), home: 'TJG', away: 'FJT', venue: 'Tianjin Tennis Club', time: '7:00 PM', homeScore: 3, awayScore: 2, isPreseason: true, status: 'preseason' },
  
  // Regular Season Games
  { id: 'G1', date: new Date().toISOString(), home: 'DND', away: 'FJT', venue: 'Northeast Tennis Center', time: '7:00 PM', status: 'scheduled' },
  { id: 'G2', date: new Date(Date.now() + 86400000).toISOString(), home: 'BJD', away: 'LGN', venue: 'Beijing Tennis Academy', time: '6:30 PM', status: 'scheduled' },
  { id: 'G3', date: new Date(Date.now() + 2*86400000).toISOString(), home: 'TJG', away: 'JZH', venue: 'Tianjin Tennis Club', time: '8:00 PM', status: 'scheduled' },
  { id: 'G4', date: new Date(Date.now() + 3*86400000).toISOString(), home: 'HBR', away: 'DND', venue: 'Hubei Tennis Center', time: '7:30 PM', status: 'scheduled' },
  { id: 'G5', date: new Date(Date.now() + 4*86400000).toISOString(), home: 'FJT', away: 'BJD', venue: 'Fujian Tennis Club', time: '6:00 PM', status: 'scheduled' },
  { id: 'G6', date: new Date(Date.now() + 5*86400000).toISOString(), home: 'LGN', away: 'TJG', venue: 'Guangdong Tennis Center', time: '8:30 PM', status: 'scheduled' },
  { id: 'G7', date: new Date(Date.now() + 6*86400000).toISOString(), home: 'JZH', away: 'HBR', venue: 'Jiangsu Tennis Academy', time: '7:00 PM', status: 'scheduled' }
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
    content: "🎾🥟 圣地亚哥食神杯：网球、美食和友情的三重奏\n\n🍲 为什么要搞这个？\n\n一句话总结：吃好、打好、玩好，顺便交朋友。\n\n我们要做的，就是把圣地亚哥的华人吃货 + 网球爱好者们召集起来。打完球大家别急着跑，留下来吃一顿、秀一场，把友情、乡情都拉满！\n\n🏷️ 看名字就饿的球队榜\n\n目前已有 7 支战队，名字一个比一个下饭：\n• 🥟 天津狗不理包子队 – 队长雪峰\n• 🍲 福建佛跳墙队 – 队长卫东\n• 🍜 湖北热干面队 – 队长 Roger 007\n• 🥬 东北酸菜炖粉条队 – 队长胡哥\n• 🦆 北京全聚德烤鸭队 – 队长 Henry Shao\n• 🦁 江沪浙狮子头队 – 队长 Sophi\n• 🐂 两广牛河队 – 队长麦克\n\n光看队名就能感受到比赛当天的香味儿了……\n\n🎾 网球规则也能整花活\n• 比赛组合随心搭：男双、女双、混双随便凑，甚至可能加一个短盘男单。\n• 规则有弹性：有 ITF 正规赛制，也有 Pro 8，打得过瘾就行。\n• 计分机制：比赛结果只占总分的三分之一，别怕！\n\n👨‍🍳 美食才是终极杀器\n• 厨艺对决：各队端出家乡招牌菜，全场一起吃、一起打分。\n• 才艺助攻：唱歌跳舞、脱口秀、小品都能上场，氛围组冲鸭！\n• 占比很高：吃喝玩乐加一起，分数能和球赛打个平手。\n\n所以：球打得菜？没事，菜做得好一样能赢！\n\n🧭 队员归属：不许抢人！\n\n规则很简单：\n1. 生长地（中学前）优先\n2. 大学所在地其次\n3. 其他条件再说\n\n这样一来，大家心里都有数，避免转会风波。\n\n🏆 奖励 & 惩罚：面子和奖杯都要\n• 流动奖杯 – 食神杯：冠军抱回家，放一年。\n• 单项奖：最强球手、最佳厨神、最佳才艺……样样有。\n• 罚分机制：不来、不上、不参与——都要扣分！\n\n🤝 我们的约定\n• 尊重对手，尊重比赛，主要是来开心的。\n• 每个队员至少要上场一次，别当隐形人。\n• 规则随时可调，但原则只有一个：大家开心最重要！\n\n🔔 总结\n\n这不是单纯的网球赛，这是一个 吃货打球趴 + 美食才艺秀。\n能打球、能做饭、能唱歌的人都能在这里找到舞台。\n\n圣地亚哥食神杯，等你来拼：拼球技、拼厨艺、拼人缘！ 🍷🎤🍜",
    contentEn: "🎾🥟 San Diego Food God Cup: The Perfect Blend of Tennis, Food, and Friendship\n\n🍲 Why Are We Doing This?\n\nIn one sentence: Eat well, play well, have fun, and make friends along the way.\n\nWhat we want to do is bring together San Diego's Chinese food lovers and tennis enthusiasts. After playing tennis, don't rush off - stay for a meal, show off your talents, and build friendships and hometown connections!\n\n🏷️ Team Names That Make You Hungry\n\nWe currently have 7 teams with names that make your mouth water:\n• 🥟 Tianjin Goubuli Dumplings Team – Captain Xue Feng\n• 🍲 Fujian Buddha Jumps Over Wall Team – Captain Wei Dong\n• 🍜 Hubei Hot Dry Noodles Team – Captain Roger 007\n• 🥬 Northeast Pickled Cabbage Stewed Noodles Team – Captain Brother Hu\n• 🦆 Beijing Quanjude Roast Duck Team – Captain Henry Shao\n• 🦁 Jiangsu Lion Head Team – Captain Sophia\n• 🐂 Cantonese Beef Noodles Team – Captain Mike\n\nJust reading the team names makes you smell the delicious aromas of competition day...\n\n🎾 Tennis Rules Can Be Fun Too\n• Flexible match combinations: Men's doubles, women's doubles, mixed doubles, and maybe even a short men's singles match.\n• Flexible rules: We have ITF standard format and Pro 8 - whatever makes it exciting!\n• Scoring system: Match results only count for one-third of the total score, so don't worry!\n\n👨‍🍳 Food is the Ultimate Weapon\n• Culinary showdown: Each team brings their hometown signature dishes, everyone eats together and scores together.\n• Talent support: Singing, dancing, stand-up comedy, skits - all welcome to create the atmosphere!\n• High weight: Food, drinks, and entertainment combined can match the tennis scores.\n\nSo: Bad at tennis? No problem, good cooking can still win!\n\n🧭 Team Member Assignment: No Poaching!\n\nThe rules are simple:\n1. Birthplace (before high school) takes priority\n2. University location comes second\n3. Other conditions follow\n\nThis way, everyone knows where they stand and avoids transfer drama.\n\n🏆 Rewards & Penalties: Both Face and Trophies Matter\n• Floating trophy - Food God Cup: Champions take it home for a year.\n• Individual awards: Best player, best chef, best performer... all covered.\n• Penalty system: Not showing up, not participating, not contributing - all result in point deductions!\n\n🤝 Our Agreement\n• Respect opponents, respect the game, but mainly come to have fun.\n• Every team member must play at least once - no invisible players.\n• Rules can be adjusted anytime, but the principle remains: everyone's happiness is most important!\n\n🔔 Summary\n\nThis isn't just a tennis tournament - it's a foodie tennis party + culinary talent show.\nPeople who can play tennis, cook, or sing can all find their stage here.\n\nSan Diego Food God Cup, waiting for you to compete: compete in tennis skills, culinary arts, and social connections! 🍷🎤🍜"
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function latestPost() {
  return posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
}
