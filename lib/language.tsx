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
    'nav.rules': 'Rules',
    
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
    
    // Rules
    'rules.title': 'Rules',
    'rules.description': 'Comprehensive rules and regulations for both tennis and culinary competitions',
    'rules.culinary.title': 'Culinary Competition Rules',
    'rules.culinary.scoring.title': 'Scoring System',
    'rules.culinary.scoring.first': '1st Place: 3 points',
    'rules.culinary.scoring.second': '2nd Place: 2 points',
    'rules.culinary.scoring.third': '3rd Place: 1 point',
    'rules.culinary.rounds.title': 'Competition Rounds',
    'rules.culinary.rounds.description': '3 rounds total, top 3 players selected per round',
    'rules.culinary.evaluation.title': 'Evaluation Criteria',
    'rules.culinary.evaluation.taste': 'Taste and flavor',
    'rules.culinary.evaluation.presentation': 'Visual presentation',
    'rules.culinary.evaluation.creativity': 'Creativity and innovation',
    'rules.culinary.evaluation.authenticity': 'Authenticity of regional cuisine',
    'rules.tennis.title': 'Tennis Competition Rules',
    'rules.tennis.chapter1.title': 'Chapter 1: Match Format',
    'rules.tennis.chapter1.rule1': 'Matches use 4 doubles lines as standard. Teams can flexibly adjust based on court and personnel availability, but minimum 3 lines must be played.',
    'rules.tennis.chapter1.rule2': 'Recommended combinations:',
    'rules.tennis.chapter1.optionA': '2 Men\'s Doubles + 2 Mixed Doubles',
    'rules.tennis.chapter1.optionB': '3 Men\'s Doubles + 1 Women\'s Doubles',
    'rules.tennis.chapter1.optionC': '3 Men\'s Doubles + 1 Mixed Doubles',
    'rules.tennis.chapter1.rule3': 'Regardless of 3+ lines played, at least 1 mixed doubles or 1 women\'s doubles must be arranged.',
    'rules.tennis.chapter1.rule4': 'Special circumstances may allow additional singles matches, but results do not count toward team total score.',
    'rules.tennis.chapter2.title': 'Chapter 2: Player Ranking & Rating',
    'rules.tennis.chapter2.rating.title': 'Rating Calculation Standard',
    'rules.tennis.chapter2.rating.desc': 'Based on USTA/NTRP standards, combined with club internal match results, determined by captain group consensus.',
    'rules.tennis.chapter2.order.title': 'Ranking Order',
    'rules.tennis.chapter2.order.mens': 'Men\'s Doubles: MD1 ≥ MD2 ≥ MD3',
    'rules.tennis.chapter2.order.mixed': 'Mixed Doubles: XD1 ≥ XD2',
    'rules.tennis.chapter2.limits.title': 'Rating Limits by Line',
    'rules.tennis.chapter2.limits.md1': 'Men\'s Doubles 1: ≥ 8.0',
    'rules.tennis.chapter2.limits.md2': 'Men\'s Doubles 2: ≤ 8.0',
    'rules.tennis.chapter2.limits.md3': 'Men\'s Doubles 3: ≤ 7.5',
    'rules.tennis.chapter2.limits.wd': 'Women\'s Doubles: No strict limits, recommended 7.0-8.0 range, team rating difference ≤ 0.5',
    'rules.tennis.chapter2.limits.xd1': 'Mixed Doubles 1: ≤ 8.0',
    'rules.tennis.chapter2.limits.xd2': 'Mixed Doubles 2: ≤ 7.5',
    'rules.tennis.chapter3.title': 'Chapter 3: Match Rules',
    'rules.tennis.chapter3.format.title': 'Match formats (agreed by captains before match):',
    'rules.tennis.chapter3.format.regular': 'Regular Set: First to 6 games, must lead by 2; at 6-6, play tiebreak (7 points, must lead by 2)',
    'rules.tennis.chapter3.format.pro8': 'Pro Set: First to 8 games, at 6-6 play tiebreak',
    'rules.tennis.chapter3.team.title': 'Team matches: Win one line = 1 point. If tied (e.g., 2-2), can be draw or play one "deciding match" (preferably mixed doubles) for final result.',
    'rules.tennis.chapter3.time.title': 'Timed matches (35-45 minutes including 5-minute warmup): Score at time limit determines winner; if mid-game, complete current game then stop.',
    'rules.tennis.chapter6.title': 'Chapter 6: Umpiring & Order',
    'rules.tennis.chapter6.self.title': 'Self-umpiring system following ITF principles:',
    'rules.tennis.chapter6.self.rule1': 'Each player responsible for their side\'s line calls',
    'rules.tennis.chapter6.self.rule2': 'Doubt goes to opponent - if unclear, opponent gets the point',
    'rules.tennis.chapter6.self.rule3': 'Call immediately - "OUT" or "FAULT" must be called loudly and clearly with gesture',
    'rules.tennis.chapter6.self.rule4': 'Cannot claim "didn\'t see" to change call - if unclear, opponent gets the point',
    'rules.tennis.chapter6.details.title': 'Specific Details:',
    'rules.tennis.chapter6.details.doubles': 'Doubles: Both teammates can make line calls; if different conclusions, closer player\'s call takes precedence',
    'rules.tennis.chapter6.details.serve': 'Serve calls: Receiving team responsible for determining if ball lands in service area',
    'rules.tennis.chapter6.details.noExcuse': 'Cannot claim "didn\'t see" to change call - if unclear, opponent gets the point',
    'rules.tennis.chapter6.details.let': '"Let" balls: If both sides uncertain or interference (e.g., ball from adjacent court), replay the point',
    'rules.tennis.chapter6.dispute.title': 'Dispute resolution:',
    'rules.tennis.chapter6.dispute.rule1': 'Suggest replaying the point (play a let)',
    'rules.tennis.chapter6.dispute.rule2': 'If multiple disputes, can ask third party (spectator/coach) to assist, but "doubt to opponent" remains the principle',
    'rules.tennis.chapter6.officials.title': 'Officials:',
    'rules.tennis.chapter6.officials.desc': 'If each match has 1 non-playing player as scorekeeper/observer, responsible only for recording scores and time',
    'rules.tennis.chapter6.etiquette.title': 'Court Etiquette:',
    'rules.tennis.chapter6.etiquette.desc': 'Maintain good sportsmanship on court; prohibit loud arguments, verbal abuse, or intentional delays',
    'rules.tennis.chapter6.friendship.title': 'Sportsmanship:',
    'rules.tennis.chapter6.friendship.desc': 'Pre-match handshake, post-match group photo - friendship first',
    'rules.tennis.chapter7.title': 'Chapter 7: Safety & Disclaimer',
    'rules.tennis.chapter7.voluntary.title': 'Voluntary Participation:',
    'rules.tennis.chapter7.voluntary.desc': 'All participants register voluntarily and must self-assess their physical condition',
    'rules.tennis.chapter7.injury.title': 'Injury Responsibility:',
    'rules.tennis.chapter7.injury.desc': 'If injury or accident occurs during competition, participants are responsible for their own medical and related expenses',
    'rules.tennis.chapter7.liability.title': 'Organizer Liability:',
    'rules.tennis.chapter7.liability.desc': 'Tournament organizers and hosts are responsible only for organization; not liable for any personal or property damage',
    'rules.tennis.chapter7.agreement.title': 'Agreement:',
    'rules.tennis.chapter7.agreement.desc': 'Playing in matches constitutes agreement to and acceptance of the above disclaimer terms',
    'rules.tennis.chapter7.club.title': 'Club Activity:',
    'rules.tennis.chapter7.club.desc': 'This tournament is an internal activity of San Diego Chinese Tennis Club; club disclaimer forms may be used. Captains responsible for collecting signatures and submitting to organizing committee',
    
    // Tennis Etiquette
    'rules.tennis.etiquette.title': 'Tennis Etiquette Guide',
    'rules.tennis.etiquette.subtitle': 'Tennis Etiquette Concise Guide (Doubles/Mixed Doubles)',
    'rules.tennis.etiquette.basic.title': 'I. Basic Etiquette',
    'rules.tennis.etiquette.basic.punctual': 'Be on time: Respect teammates and opponents',
    'rules.tennis.etiquette.basic.warmup': 'Moderate warmup: Light hitting, no intentional point winning',
    'rules.tennis.etiquette.basic.respect': 'Respect opponents: Acknowledge out balls, handshake or racket tap after match',
    'rules.tennis.etiquette.basic.emotions': 'Control emotions: No excessive racket throwing or shouting, moderate celebrations',
    'rules.tennis.etiquette.basic.ballReturn': 'Proper ball return: Roll gently, don\'t hit hard',
    'rules.tennis.etiquette.basic.crossing': 'Wait to cross: Wait for point to end before crossing court',
    'rules.tennis.etiquette.doubles.title': 'II. Doubles Etiquette',
    'rules.tennis.etiquette.doubles.teammates': 'Between teammates: Encourage more, complain less; say "no problem" for mistakes',
    'rules.tennis.etiquette.doubles.communication': 'Clear communication: Short commands ("mine", "yours"), avoid ball conflicts',
    'rules.tennis.etiquette.doubles.responsibility': 'Responsibility division: Agree before match who calls lines, who watches short balls',
    'rules.tennis.etiquette.doubles.overhead': 'Net overhead: In doubles, if opponent is close at net, avoid full power smash to body; choose placement or control power for safety and sportsmanship',
    'rules.tennis.etiquette.doubles.disputes': 'Respect officials and opponents: One person speaks in disputes, no group arguments',
    'rules.tennis.etiquette.mixed.title': 'III. Mixed Doubles Additional Notes',
    'rules.tennis.etiquette.mixed.serving': 'Serving/receiving: Alternate male-female positioning, avoid targeting one gender',
    'rules.tennis.etiquette.mixed.power': 'Power balance: Male players should not use excessive power against female players',
    'rules.tennis.etiquette.mixed.tactics': 'Tactical cooperation: Encourage female players to use net reaction and control advantages, not rely entirely on male teammates',
    'rules.tennis.etiquette.mixed.atmosphere': 'Polite atmosphere: Support each other, avoid unfair or unpleasant feelings due to gender differences',
    'rules.tennis.etiquette.post.title': 'IV. Post-Match Etiquette',
    'rules.tennis.etiquette.post.greeting': 'End greeting: Go to net, greet opponents and officials',
    'rules.tennis.etiquette.post.thanks': 'Thank teammates: Win or lose, say "well played"',
    'rules.tennis.etiquette.post.cleanup': 'Court cleanup: Take trash, return borrowed items',
    'rules.general.title': 'General Rules',
    'rules.general.participation.title': 'Participation Requirements',
    'rules.general.participation.attendance': 'Regular attendance required',
    'rules.general.participation.minimum': 'Minimum one match per player',
    'rules.general.participation.respect': 'Respect opponents and officials',
    'rules.general.penalties.title': 'Penalty System',
    'rules.general.penalties.noShow': 'No-show: -1 point',
    'rules.general.penalties.noParticipation': 'Non-participation: -1 point',
    'rules.general.penalties.unsportsmanlike': 'Unsportsmanlike conduct: -2 points',
    
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
    'nav.rules': '规则',
    
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
    
    // Rules
    'rules.title': '规则',
    'rules.description': '网球和美食比赛的完整规则和规定',
    'rules.culinary.title': '美食赛规则',
    'rules.culinary.scoring.title': '计分系统',
    'rules.culinary.scoring.first': '第一名：3分',
    'rules.culinary.scoring.second': '第二名：2分',
    'rules.culinary.scoring.third': '第三名：1分',
    'rules.culinary.rounds.title': '比赛轮次',
    'rules.culinary.rounds.description': '共3轮，每轮评选前3名',
    'rules.culinary.evaluation.title': '评分标准',
    'rules.culinary.evaluation.taste': '口味和风味',
    'rules.culinary.evaluation.presentation': '视觉呈现',
    'rules.culinary.evaluation.creativity': '创意和创新',
    'rules.culinary.evaluation.authenticity': '地方菜系正宗性',
    'rules.tennis.title': '网球比赛规则',
    'rules.tennis.chapter1.title': '第一章 比赛形式',
    'rules.tennis.chapter1.rule1': '比赛采用4条双打线为基准。双方可根据场地和人员情况灵活调整（增减对抗项目），但出场总线数不得少于3条',
    'rules.tennis.chapter1.rule2': '推荐组合形式：',
    'rules.tennis.chapter1.optionA': '2男双 + 2混双',
    'rules.tennis.chapter1.optionB': '3男双 + 1女双',
    'rules.tennis.chapter1.optionC': '3男双 + 1混双',
    'rules.tennis.chapter1.rule3': '无论出战3条或以上，总需安排至少1混双或1女双',
    'rules.tennis.chapter1.rule4': '特殊情况可协商增加单打对抗，但结果不计入团队总比分',
    'rules.tennis.chapter2.title': '第二章 队员排位与Rating',
    'rules.tennis.chapter2.rating.title': 'Rating计算标准',
    'rules.tennis.chapter2.rating.desc': '根据USTA/NTRP，兼顾俱乐部内部比赛成绩，由队长群统一评定确定的等级分',
    'rules.tennis.chapter2.order.title': '排位顺序',
    'rules.tennis.chapter2.order.mens': '男双：MD1 ≥ MD2 ≥ MD3',
    'rules.tennis.chapter2.order.mixed': '混双：XD1 ≥ XD2',
    'rules.tennis.chapter2.limits.title': '各线Rating限制',
    'rules.tennis.chapter2.limits.md1': '男双1：≥ 8.0',
    'rules.tennis.chapter2.limits.md2': '男双2：≤ 8.0',
    'rules.tennis.chapter2.limits.md3': '男双3：≤ 7.5',
    'rules.tennis.chapter2.limits.wd': '女双：不设严格限制，建议控制在7.0–8.0区间，双方rating差≤0.5',
    'rules.tennis.chapter2.limits.xd1': '混双1：≤ 8.0',
    'rules.tennis.chapter2.limits.xd2': '混双2：≤ 7.5',
    'rules.tennis.chapter3.title': '第三章 比赛规则',
    'rules.tennis.chapter3.format.title': '比赛形式由双方队长赛前协商，可采用：',
    'rules.tennis.chapter3.format.regular': '常规盘：先赢6局，需领先2局；6:6时打抢七（7分，需领先2分）',
    'rules.tennis.chapter3.format.pro8': '8局赛：先赢8局，6:6时打抢七',
    'rules.tennis.chapter3.team.title': '若为团队对抗赛：胜一条线记1分。总比分相同时，可以平局或者决定一条"决胜对抗"（优先混双），打一盘定胜负',
    'rules.tennis.chapter3.time.title': '如果多队比赛场地有限采用计时赛情况：每场比赛限时35-45分钟（含5分钟热身）。时间到时，若已完成该局，按比分判定胜负；若在进行中，则完成该局后终止',
    'rules.tennis.chapter6.title': '第六章 裁判与秩序',
    'rules.tennis.chapter6.self.title': '比赛采用信任制自判，Line Call（界线判定）一般遵循国际网联（ITF）和通用的"球员自判"精神：',
    'rules.tennis.chapter6.self.rule1': '谁在那一边，谁负责判线',
    'rules.tennis.chapter6.self.rule2': '疑球归对手（benefit of the doubt）',
    'rules.tennis.chapter6.self.rule3': '立即喊出 - 如果是"OUT"或"FAULT"，要马上大声清楚地喊，并最好伴随手势',
    'rules.tennis.chapter6.self.rule4': '不能借口"没看到"来改判 - 如果球员没看清，应当给对手得分',
    'rules.tennis.chapter6.details.title': '几个细则：',
    'rules.tennis.chapter6.details.doubles': '双打时：两个同队球员都可以判线，如果看到不同结论，应该判对方得分',
    'rules.tennis.chapter6.details.serve': '发球判定：接发球方负责判定球是否落在接发区内',
    'rules.tennis.chapter6.details.noExcuse': '不能借口"没看到"来改判：如果球员没看清，应当给对手得分',
    'rules.tennis.chapter6.details.let': '"Let"球：如果双方都不确定，或有干扰（比如隔壁场球滚进来），可重新发球',
    'rules.tennis.chapter6.dispute.title': '争议处理：',
    'rules.tennis.chapter6.dispute.rule1': '建议重打这一分（play a let）',
    'rules.tennis.chapter6.dispute.rule2': '如果多次争议，可以请第三方（旁边观众/教练）临时协助，但最终还是以"疑球归对手"为基本精神',
    'rules.tennis.chapter6.officials.title': '裁判安排：',
    'rules.tennis.chapter6.officials.desc': '如果每场安排1名不参赛球员担任计分员/观察员，仅负责记录比分与时间',
    'rules.tennis.chapter6.etiquette.title': '场上礼仪：',
    'rules.tennis.chapter6.etiquette.desc': '场上须保持良好礼仪，禁止大声争吵、辱骂或恶意拖延',
    'rules.tennis.chapter6.friendship.title': '友谊第一：',
    'rules.tennis.chapter6.friendship.desc': '赛前握手，赛后合影，友谊第一',
    'rules.tennis.chapter7.title': '第七章 安全与免责',
    'rules.tennis.chapter7.voluntary.title': '自愿参赛：',
    'rules.tennis.chapter7.voluntary.desc': '所有参赛者均为自愿报名，需自行评估身体状况',
    'rules.tennis.chapter7.injury.title': '受伤责任：',
    'rules.tennis.chapter7.injury.desc': '比赛中如发生受伤或意外，参赛者自行负责医疗和相关费用',
    'rules.tennis.chapter7.liability.title': '组织方责任：',
    'rules.tennis.chapter7.liability.desc': '赛事组委会和承办方仅负责组织，不承担任何人身或财产损失责任',
    'rules.tennis.chapter7.agreement.title': '同意条款：',
    'rules.tennis.chapter7.agreement.desc': '上场比赛即视为同意并接受以上免责条款',
    'rules.tennis.chapter7.club.title': '俱乐部活动：',
    'rules.tennis.chapter7.club.desc': '本赛事属于圣地亚哥华人网球俱乐部内部活动，可采用俱乐部免责文件。由队长负责收集签名，提交文件给主委会',
    
    // 网球礼仪
    'rules.tennis.etiquette.title': '网球礼仪',
    'rules.tennis.etiquette.subtitle': '网球礼仪简明指南（双打/混双通用）',
    'rules.tennis.etiquette.basic.title': '一、基本礼仪',
    'rules.tennis.etiquette.basic.punctual': '准时到场：尊重队友和对手',
    'rules.tennis.etiquette.basic.warmup': '热身有度：轻击为主，不刻意赢分',
    'rules.tennis.etiquette.basic.respect': '尊重对手：承认界外球，比赛结束握手或点拍致意',
    'rules.tennis.etiquette.basic.emotions': '控制情绪：不过度摔拍、怒吼，庆祝适度即可',
    'rules.tennis.etiquette.basic.ballReturn': '捡球规范：轻轻滚球，不用力猛击',
    'rules.tennis.etiquette.basic.crossing': '过场等待：等一分结束后再穿越球场',
    'rules.tennis.etiquette.doubles.title': '二、双打礼仪',
    'rules.tennis.etiquette.doubles.teammates': '队友之间：多鼓励，少抱怨；失误时说"没关系"',
    'rules.tennis.etiquette.doubles.communication': '沟通明确：简短口令（"我来""你来"），避免抢球或漏球',
    'rules.tennis.etiquette.doubles.responsibility': '责任分工：开赛前约定谁呼叫界外，谁盯短球',
    'rules.tennis.etiquette.doubles.overhead': '网前高压：在双打中，如对手近距离在网前，应避免全力扣杀打向身体；应选择落点或控制力量，既保证安全又体现风度',
    'rules.tennis.etiquette.doubles.disputes': '尊重裁判与对手：有争议时由一人代表发言，不多人起哄',
    'rules.tennis.etiquette.mixed.title': '三、混双比赛额外注意事项',
    'rules.tennis.etiquette.mixed.serving': '发球/接发球：男女交叉站位，避免过度针对某一方',
    'rules.tennis.etiquette.mixed.power': '力度平衡：男选手对女选手时，不应刻意用过强的压制性打法',
    'rules.tennis.etiquette.mixed.tactics': '战术配合：鼓励女选手发挥网前反应和控球优势，而不是完全依赖男队友',
    'rules.tennis.etiquette.mixed.atmosphere': '礼貌氛围：互相支持，避免因性别差异产生不公平或不愉快的感觉',
    'rules.tennis.etiquette.post.title': '四、赛后礼仪',
    'rules.tennis.etiquette.post.greeting': '结束致意：走到网前，与对手、裁判致意',
    'rules.tennis.etiquette.post.thanks': '感谢队友：输赢都说一句"打得不错"',
    'rules.tennis.etiquette.post.cleanup': '场地收拾：带走垃圾，归还借用物品',
    'rules.general.title': '通用规则',
    'rules.general.participation.title': '参与要求',
    'rules.general.participation.attendance': '要求定期出席',
    'rules.general.participation.minimum': '每名球员至少参加一场比赛',
    'rules.general.participation.respect': '尊重对手和裁判',
    'rules.general.penalties.title': '罚分制度',
    'rules.general.penalties.noShow': '缺席：-1分',
    'rules.general.penalties.noParticipation': '不参与：-1分',
    'rules.general.penalties.unsportsmanlike': '不文明行为：-2分',
    
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
