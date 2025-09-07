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
    'standings.wins': 'W',
    'standings.losses': 'L',
    'standings.draws': 'D',
    'standings.points': 'Pts',
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
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.teams': '队伍',
    'nav.schedule': '赛程',
    'nav.standings': '排名',
    'nav.blog': '博客',
    
    // Homepage
    'home.welcome': '欢迎来到',
    'home.title': '圣地亚哥华人网球俱乐部食神杯',
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
    'standings.wins': '胜',
    'standings.losses': '负',
    'standings.draws': '平',
    'standings.points': '积分',
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
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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
    <LanguageContext.Provider value={{ language, setLanguage, t, getTeamName, getCoachName, getArenaName, getPlayerName, getPlayerPosition, getPlayerExperience, getPostTitle, getPostExcerpt, getPostContent }}>
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
