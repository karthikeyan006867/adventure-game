import './globals.css'

export const metadata = {
  title: 'Epic 3D Adventure - 20,000+ Possibilities',
  description: 'The ultimate 3D adventure game with pets, leveling, combat, and endless exploration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
