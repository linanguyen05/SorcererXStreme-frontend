
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import GlobalStyles from '@/components/ui/GlobalStyles';
import AmplifyProvider from './AmplifyProvider';
import { Footer } from '@/components/layout/Footer';
import ExpertChat from '@/components/chat/ExpertChat';

export const metadata: Metadata = {
  title: "SorcererXStreme - Huyền Thuật AI",
  description: "Ứng dụng huyền thuật với AI tiên tiến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className="antialiased bg-gray-950 text-white min-h-screen" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
        <GlobalStyles />
        <AmplifyProvider>

          {/* Background layers */}
          <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-red-950/20 -z-10"></div>
          <div className="fixed inset-0 cosmic-bg -z-10"></div>

          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/40 rounded-full star-twinkle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-white/40 rounded-full star-twinkle" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-white/40 rounded-full star-twinkle" style={{ animationDelay: '2.5s' }}></div>
          </div>

          {children}
          <ExpertChat />
          <Footer />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(31, 41, 55, 0.9)',
                color: '#f3f4f6',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                backdropFilter: 'blur(16px)',
                borderRadius: '0.75rem',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AmplifyProvider>
      </body>
    </html>
  );
}
