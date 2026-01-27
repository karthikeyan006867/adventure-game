import './globals.css'

export const metadata = {
  title: '🌸 Ultimate Isekai Adventure - Your Second Life Awaits!',
  description: 'Anime-style 3D MMORPG with 9 classes, 50 pets, 3,000,000+ quests, 2000+ hours of gameplay! Choose your destiny in this epic isekai adventure!',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
