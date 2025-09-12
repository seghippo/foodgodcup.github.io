import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/lib/language';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '圣地亚哥华人网球俱乐部食神杯 - San Diego Chinese Tennis Club',
  description: 'Your premier destination for San Diego Chinese Tennis Club Food God Cup management, schedules, standings, and community updates. Experience the ultimate fusion of tennis excellence and culinary passion.',
  keywords: 'tennis, chinese, san diego, club, food god cup, sports, league, management, schedule, standings, teams, community',
  authors: [{ name: '圣地亚哥华人网球俱乐部食神杯 Team' }],
  robots: 'index, follow',
  other: {
    'wechat:description': '圣地亚哥华人网球俱乐部食神杯 - 网球比赛管理、赛程安排、排名统计和社区更新',
    'wechat:image': 'https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg',
  },
  openGraph: {
    title: '圣地亚哥华人网球俱乐部食神杯 - San Diego Chinese Tennis Club',
    description: 'Your premier destination for San Diego Chinese Tennis Club Food God Cup management, schedules, standings, and community updates.',
    type: 'website',
    url: 'https://seghippo.github.io/foodgodcup.github.io',
    images: [
      {
        url: 'https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg',
        width: 920,
        height: 1388,
        alt: 'San Diego Chinese Tennis Club Food God Cup Teams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '圣地亚哥华人网球俱乐部食神杯 - San Diego Chinese Tennis Club',
    description: 'Your premier destination for San Diego Chinese Tennis Club Food God Cup management, schedules, standings, and community updates.',
    images: ['https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f3460',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="圣地亚哥华人网球俱乐部食神杯" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* WeChat specific meta tags */}
        <meta name="wechat:description" content="圣地亚哥华人网球俱乐部食神杯 - 网球比赛管理、赛程安排、排名统计和社区更新" />
        <meta name="wechat:image" content="https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg" />
        <meta property="og:image" content="https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg" />
        <meta property="og:image:width" content="920" />
        <meta property="og:image:height" content="1388" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://seghippo.github.io/foodgodcup.github.io/teamlogos.jpeg" />
        
        {/* Additional WeChat compatibility */}
        <meta name="description" content="圣地亚哥华人网球俱乐部食神杯 - 网球比赛管理、赛程安排、排名统计和社区更新" />
        <meta name="keywords" content="网球, 圣地亚哥, 华人, 俱乐部, 食神杯, 比赛, 排名" />
        <meta name="author" content="圣地亚哥华人网球俱乐部食神杯" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
