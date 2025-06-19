import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VTuber AI Chat',
  description: 'VTuber風オリジナルキャラクターとのAIチャットアプリケーション',
  keywords: ['VTuber', 'AI', 'Chat', 'キャラクター', 'チャット'],
  authors: [{ name: 'VTuber AI Chat Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">🎭</div>
                  <h1 className="text-xl font-bold gradient-text">
                    VTuber AI Chat
                  </h1>
                </div>
                <div className="text-sm text-gray-600">
                  オリジナルキャラクターとの楽しいチャット
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 flex overflow-hidden">
            {children}
          </main>
          
          <footer className="bg-white border-t flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center text-sm text-gray-600">
                <p>
                  このアプリケーションのキャラクターは、実在のVTuberから
                  インスパイアされたオリジナルキャラクターです。
                </p>
                <p className="mt-1">
                  実在の人物・団体とは関係ありません。
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}