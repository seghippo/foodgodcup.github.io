'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getTeamName: (team: any) => string;
  getCoachName: (team: any) => string;
  getArenaName: (team: any) => string;
  getPlayerName: (player: any) => string;
  getPlayerPosition: (player: any) => string;
  getPlayerExperience: (player: any) => string;
  getPostTitle: (post: any) => string;
  getPostExcerpt: (post: any) => string;
  getPostContent: (post: any) => string;
  isClient: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.teams': 'Teams',
    'nav.schedule': 'Schedule',
    'nav.standings': 'Standings',
    'nav.blog': 'Blog',
    'nav.captain': 'Captain',
    
    // Homepage
    'home.welcome': 'Welcome to',
    'home.title': 'San Diego Chinese Tennis Club Food God Cup',
    'home.subtitle': 'San Diego Chinese Tennis Club',
    'home.description': 'Your premier destination for San Diego Chinese Tennis Club Food God Cup management, schedules, standings, and community updates. Experience the ultimate fusion of tennis excellence and culinary passion.',
    'home.viewSchedule': 'View Schedule',
    'home.viewStandings': 'View Standings',
    'home.activeTeams': 'Active Teams',
    'home.gamesPlayed': 'Games Played',
    'home.championships': 'Championships',
    'home.players': 'Players',
    'home.latestNews': 'Latest News',
    'home.quickAccess': 'Quick Access',
    'home.importantUpdates': 'Important Updates',
    'home.readFullArticle': 'Read Full Article',
    'home.registrationDeadline': 'Registration Deadline',
    'home.registrationDeadlineDesc': 'Closes this Friday at 5pm',
    'home.openingDay': 'Opening Day',
    'home.openingDayDesc': 'October 1st - Get ready!',
    'home.refereeClinic': 'Referee Clinic',
    'home.refereeClinicDesc': 'Next Wednesday at 6pm',
    
    // Standings
    'standings.title': 'Standings',
    'standings.tennisCompetition': 'Tennis Competition',
    'standings.culinaryCompetition': 'Food Competition',
    'standings.scoringSystem': 'Scoring System:',
    'standings.scoringDesc': 'Top 2 teams = 3 points, Middle 2 teams = 1 point, Bottom 3 teams = 0 points',
    'standings.team': 'Team',
    'standings.player': 'Player',
    'standings.wins': 'W',
    'standings.losses': 'L',
    'standings.draws': 'D',
    'standings.points': 'Pts',
    'standings.gamesPlayed': 'Games',
    'standings.percentage': 'Pct',
    'standings.total': 'Total',
    'standings.round1': 'Round 1',
    'standings.round2': 'Round 2',
    'standings.round3': 'Round 3',
    'standings.tennisScoring': 'Tennis Scoring System:',
    'standings.tennisScoringDesc': 'Win = 3 points, Draw = 1 point, Loss = 0 points',
    
    // Teams
    'teams.title': 'Teams',
    'teams.coach': 'Captain',
    'teams.roster': 'Roster',
    'teams.players': 'Players',
    'teams.position': 'Position',
    'teams.age': 'Age',
    'teams.experience': 'Experience',
    
    // Schedule
    'schedule.title': 'Schedule',
    'schedule.date': 'Date',
    'schedule.home': 'Home',
    'schedule.away': 'Away',
    'schedule.venue': 'Venue',
    'schedule.time': 'Time',
    'schedule.match': 'Match',
    'schedule.score': 'Score',
    'schedule.status': 'Status',
    'schedule.completed': 'Completed',
    'schedule.scheduled': 'Scheduled',
    'schedule.preseason': 'Preseason',
    'schedule.submitScore': 'Submit Match Score',
    'schedule.finalScore': 'Final Score',
    'schedule.playerStats': 'Player Statistics',
    'schedule.submitting': 'Submitting...',
    'schedule.submitDetailedScore': 'Submit Detailed Match Scores',
    'schedule.matchLine': 'Match Line',
    'schedule.matchType': 'Match Type',
    'schedule.doubles': 'Doubles',
    'schedule.singles': 'Singles',
    'schedule.players': 'Players',
    'schedule.selectPlayer': 'Select Player',
    'schedule.addPlayer': 'Add Player',
    'schedule.sets': 'Sets',
    'schedule.addSet': 'Add Set',
    'schedule.set': 'Set',
    'schedule.addMatchLine': 'Add Match Line',
    
    // Captain
    'captain.title': 'Captain Dashboard',
    'captain.subtitle': 'Submit match scores and manage team statistics',
    'captain.selectGame': 'Select Game to Submit Score',
    'captain.submittedResults': 'Submitted Results',
    'captain.modifyScores': 'Modify Scores',
    'captain.editScores': 'Edit Scores',
    'captain.saveChanges': 'Save Changes',
    'captain.cancel': 'Cancel',
    'captain.submitting': 'Submitting...',
    'captain.addSet': 'Add Set',
    'captain.remove': 'Remove',
    'captain.lineWinner': 'Line Winner',
    'captain.noWinner': 'No Winner',
    'captain.totalScore': 'Total Score',
    'captain.line': 'Line',
    'captain.players': 'Players',
    'captain.selectPlayer': 'Select Player',
    'captain.noPlayer': 'No Player',
    'captain.sets': 'Sets',
    'captain.set': 'Set',
    'captain.noExistingResult': 'No existing result found for this game',
    'captain.futureGameWarning': 'This game is scheduled for a future date. You cannot submit scores until the game date is modified to today or earlier.',
    'captain.modifyGameDate': 'Modify Game Date',
    'captain.currentDate': 'Current Date',
    'captain.scoresResetWarning': 'Scores will be automatically reset to zero for future games.',
    'captain.dateModified': 'Game date has been modified. You can now submit scores.',
    'captain.modifyResult': 'Modify Result',
    'captain.viewDetails': 'View Details',
    'captain.hideDetails': 'Hide Details',
    'captain.matchDetails': 'Match Details',
    'captain.wins': 'Wins',
    'captain.addMatchLine': 'Add Match Line',
    'captain.removeMatchLine': 'Remove Match Line',
    'captain.confirmRemoveLine': 'Are you sure you want to remove this match line?',
    'captain.matchType': 'Match Type',
    'captain.doubles': 'Doubles',
    'captain.singles': 'Singles',
    'captain.unsavedChanges': 'You have unsaved changes. Do you want to save them?',
    'captain.saveBeforeLeave': 'Save before leaving?',
    'captain.discardChanges': 'Discard Changes',
    'captain.keepEditing': 'Keep Editing',
    'captain.changesSaved': 'Changes saved successfully!',
    'captain.saveFailed': 'Failed to save changes. Please try again.',
    'captain.createNewGame': 'Create New Game',
    'captain.selectOpponent': 'Select Opponent',
    'captain.gameDate': 'Game Date',
    'captain.gameTime': 'Game Time',
    'captain.venue': 'Venue',
    'captain.createGame': 'Create Game',
    'captain.gameCreated': 'Game created successfully!',
    'captain.gameCreationFailed': 'Failed to create game. Please try again.',
    'captain.noGamesScheduled': 'No games scheduled yet. Create your first game!',
    'captain.homeTeam': 'Home Team',
    'captain.creating': 'Creating...',
    'captain.deleteGame': 'Delete Game',
    'captain.confirmDeleteGame': 'Are you sure you want to delete this game?',
    'captain.gameDeleted': 'Game deleted successfully!',
    'captain.gameDeleteFailed': 'Failed to delete game. Please try again.',
    'captain.delete': 'Delete',
    'captain.editGame': 'Edit Game',
    'captain.gameUpdated': 'Game updated successfully!',
    'captain.gameUpdateFailed': 'Failed to update game. Please try again.',
    'captain.save': 'Save',
    'captain.updating': 'Updating...',
    
    // Authentication
    'auth.welcome': 'Welcome Captain',
    'auth.subtitle': 'Sign in to manage your team and submit scores',
    'auth.login': 'Sign In',
    'auth.register': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.team': 'Team',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.namePlaceholder': 'Enter your full name',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.selectTeam': 'Select your team',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.loggingIn': 'Signing in...',
    'auth.registering': 'Creating account...',
    'auth.loginError': 'Invalid email or password',
    'auth.registrationError': 'Registration failed. Please try again.',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters',
    'auth.demoCredentials': 'Demo credentials',
    'auth.features': 'Captain Features',
    'auth.feature1': 'Submit match scores',
    'auth.feature2': 'Manage team statistics',
    'auth.feature3': 'Track player performance',
    'auth.logout': 'Logout',
    
    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Read More',
    
    // Footer
    'footer.description': 'Your premier destination for San Diego Chinese Tennis Club Food God Cup management, schedules, standings, and community updates.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.copyright': 'All rights reserved.',
    'footer.builtWith': 'Built with Next.js & Tailwind CSS',
    
    // Common
    'common.new': 'New',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.remove': 'Remove',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.teams': '队伍',
    'nav.schedule': '赛程',
    'nav.standings': '排名',
    'nav.blog': '博客',
    'nav.captain': '队长',
    
    // Homepage
    'home.welcome': '欢迎来到',
    'home.title': '圣地亚哥食神杯',
    'home.subtitle': '圣地亚哥华人网球俱乐部',
    'home.description': '圣地亚哥华人网球俱乐部食神杯管理、赛程、排名和社区更新的首选平台。体验网球卓越与烹饪激情的完美融合。',
    'home.viewSchedule': '查看赛程',
    'home.viewStandings': '查看排名',
    'home.activeTeams': '活跃队伍',
    'home.gamesPlayed': '已比赛场次',
    'home.championships': '冠军次数',
    'home.players': '球员数量',
    'home.latestNews': '最新消息',
    'home.quickAccess': '快速访问',
    'home.importantUpdates': '重要更新',
    'home.readFullArticle': '阅读全文',
    'home.registrationDeadline': '报名截止',
    'home.registrationDeadlineDesc': '本周五下午5点截止',
    'home.openingDay': '开幕日',
    'home.openingDayDesc': '10月1日 - 准备就绪！',
    'home.refereeClinic': '裁判培训',
    'home.refereeClinicDesc': '下周三晚上6点',
    
    // Standings
    'standings.title': '排名',
    'standings.tennisCompetition': '网球比赛',
    'standings.culinaryCompetition': '美食赛',
    'standings.scoringSystem': '计分系统：',
    'standings.scoringDesc': '前2名队伍 = 3分，中间2名队伍 = 1分，后3名队伍 = 0分',
    'standings.team': '队伍',
    'standings.player': '球员',
    'standings.wins': '胜',
    'standings.losses': '负',
    'standings.draws': '平',
    'standings.points': '积分',
    'standings.gamesPlayed': '场次',
    'standings.percentage': '胜率',
    'standings.total': '总分',
    'standings.round1': '第一轮',
    'standings.round2': '第二轮',
    'standings.round3': '第三轮',
    'standings.tennisScoring': '网球计分系统：',
    'standings.tennisScoringDesc': '胜 = 3分，平 = 1分，负 = 0分',
    
    // Teams
    'teams.title': '队伍',
    'teams.coach': '队长',
    'teams.roster': '阵容',
    'teams.players': '球员',
    'teams.position': '位置',
    'teams.age': '年龄',
    'teams.experience': '经验',
    'teams.founded': '成立年份',
    'teams.arena': '主场',
    
    // Schedule
    'schedule.title': '赛程',
    'schedule.date': '日期',
    'schedule.home': '主队',
    'schedule.away': '客队',
    'schedule.venue': '场地',
    'schedule.time': '时间',
    'schedule.match': '比赛',
    'schedule.score': '比分',
    'schedule.status': '状态',
    'schedule.completed': '已结束',
    'schedule.scheduled': '已安排',
    'schedule.preseason': '季前赛',
    'schedule.submitScore': '提交比赛成绩',
    'schedule.finalScore': '最终比分',
    'schedule.playerStats': '球员统计',
    'schedule.submitting': '提交中...',
    'schedule.submitDetailedScore': '提交详细比赛成绩',
    'schedule.matchLine': '比赛线',
    'schedule.matchType': '比赛类型',
    'schedule.doubles': '双打',
    'schedule.singles': '单打',
    'schedule.players': '球员',
    'schedule.selectPlayer': '选择球员',
    'schedule.addPlayer': '添加球员',
    'schedule.sets': '盘数',
    'schedule.addSet': '添加盘',
    'schedule.set': '盘',
    'schedule.addMatchLine': '添加比赛线',
    
    // Captain
    'captain.title': '队长管理台',
    'captain.subtitle': '提交比赛成绩和管理球队统计',
    'captain.selectGame': '选择要提交成绩的比赛',
    'captain.submittedResults': '已提交的成绩',
    'captain.modifyScores': '修改成绩',
    'captain.editScores': '编辑成绩',
    'captain.saveChanges': '保存更改',
    'captain.cancel': '取消',
    'captain.submitting': '提交中...',
    'captain.addSet': '添加盘',
    'captain.remove': '删除',
    'captain.lineWinner': '比赛线获胜者',
    'captain.noWinner': '无获胜者',
    'captain.totalScore': '总比分',
    'captain.line': '比赛线',
    'captain.players': '球员',
    'captain.selectPlayer': '选择球员',
    'captain.noPlayer': '无球员',
    'captain.sets': '盘数',
    'captain.set': '盘',
    'captain.noExistingResult': '未找到此比赛的现有成绩',
    'captain.futureGameWarning': '此比赛安排在未来的日期。您需要先将比赛日期修改为今天或更早的日期才能提交成绩。',
    'captain.modifyGameDate': '修改比赛日期',
    'captain.currentDate': '当前日期',
    'captain.scoresResetWarning': '未来比赛的分数将自动重置为零。',
    'captain.dateModified': '比赛日期已修改。您现在可以提交成绩了。',
    'captain.modifyResult': '修改成绩',
    'captain.viewDetails': '查看详情',
    'captain.hideDetails': '隐藏详情',
    'captain.matchDetails': '比赛详情',
    'captain.wins': '获胜',
    'captain.addMatchLine': '添加比赛线',
    'captain.removeMatchLine': '删除比赛线',
    'captain.confirmRemoveLine': '确定要删除这条比赛线吗？',
    'captain.matchType': '比赛类型',
    'captain.doubles': '双打',
    'captain.singles': '单打',
    'captain.unsavedChanges': '您有未保存的更改。是否要保存它们？',
    'captain.saveBeforeLeave': '离开前保存？',
    'captain.discardChanges': '放弃更改',
    'captain.keepEditing': '继续编辑',
    'captain.changesSaved': '更改保存成功！',
    'captain.saveFailed': '保存更改失败。请重试。',
    'captain.createNewGame': '创建新比赛',
    'captain.selectOpponent': '选择对手',
    'captain.gameDate': '比赛日期',
    'captain.gameTime': '比赛时间',
    'captain.venue': '比赛场地',
    'captain.createGame': '创建比赛',
    'captain.gameCreated': '比赛创建成功！',
    'captain.gameCreationFailed': '创建比赛失败。请重试。',
    'captain.noGamesScheduled': '还没有安排比赛。创建您的第一场比赛！',
    'captain.homeTeam': '主队',
    'captain.creating': '创建中...',
    'captain.deleteGame': '删除比赛',
    'captain.confirmDeleteGame': '您确定要删除这场比赛吗？',
    'captain.gameDeleted': '比赛删除成功！',
    'captain.gameDeleteFailed': '删除比赛失败。请重试。',
    'captain.delete': '删除',
    'captain.editGame': '编辑比赛',
    'captain.gameUpdated': '比赛更新成功！',
    'captain.gameUpdateFailed': '更新比赛失败。请重试。',
    'captain.save': '保存',
    'captain.updating': '更新中...',
    
    // Authentication
    'auth.welcome': '欢迎队长',
    'auth.subtitle': '登录以管理您的球队并提交成绩',
    'auth.login': '登录',
    'auth.register': '创建账户',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.fullName': '姓名',
    'auth.team': '球队',
    'auth.emailPlaceholder': '输入您的邮箱',
    'auth.passwordPlaceholder': '输入您的密码',
    'auth.namePlaceholder': '输入您的姓名',
    'auth.confirmPasswordPlaceholder': '确认您的密码',
    'auth.selectTeam': '选择您的球队',
    'auth.haveAccount': '已有账户？',
    'auth.noAccount': '没有账户？',
    'auth.loggingIn': '登录中...',
    'auth.registering': '创建账户中...',
    'auth.loginError': '邮箱或密码错误',
    'auth.registrationError': '注册失败，请重试',
    'auth.passwordMismatch': '密码不匹配',
    'auth.passwordTooShort': '密码至少需要6个字符',
    'auth.demoCredentials': '演示账户',
    'auth.features': '队长功能',
    'auth.feature1': '提交比赛成绩',
    'auth.feature2': '管理球队统计',
    'auth.feature3': '跟踪球员表现',
    'auth.logout': '退出登录',
    
    // Blog
    'blog.title': '博客',
    'blog.readMore': '阅读更多',
    
    // Footer
    'footer.description': '圣地亚哥华人网球俱乐部食神杯管理、赛程、排名和社区更新的首选平台。',
    'footer.quickLinks': '快速链接',
    'footer.contact': '联系方式',
    'footer.copyright': '版权所有。',
    'footer.builtWith': '使用 Next.js & Tailwind CSS 构建',
    
    // Common
    'common.new': '新',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.remove': '删除',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [isClient, setIsClient] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const getTeamName = (team: any): string => {
    if (!team) return '';
    return language === 'en' ? (team.nameEn || team.name) : team.name;
  };

  const getCoachName = (team: any): string => {
    if (!team) return '';
    return language === 'en' ? (team.coachEn || team.coach) : team.coach;
  };

  const getArenaName = (team: any): string => {
    if (!team) return '';
    return language === 'en' ? (team.arenaEn || team.arena) : team.arena;
  };

  const getPlayerName = (player: any): string => {
    if (!player) return '';
    return language === 'en' ? (player.nameEn || player.name) : player.name;
  };

  const getPlayerPosition = (player: any): string => {
    if (!player) return '';
    return language === 'en' ? (player.positionEn || player.position) : player.position;
  };

  const getPlayerExperience = (player: any): string => {
    if (!player) return '';
    return language === 'en' ? (player.experienceEn || player.experience) : player.experience;
  };

  const getPostTitle = (post: any): string => {
    if (!post) return '';
    return language === 'en' ? (post.titleEn || post.title) : post.title;
  };

  const getPostExcerpt = (post: any): string => {
    if (!post) return '';
    return language === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt;
  };

  const getPostContent = (post: any): string => {
    if (!post) return '';
    return language === 'en' ? (post.contentEn || post.content) : post.content;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTeamName, getCoachName, getArenaName, getPlayerName, getPlayerPosition, getPlayerExperience, getPostTitle, getPostExcerpt, getPostContent, isClient }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
