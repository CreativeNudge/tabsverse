import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: 'Tabsverse - Your Digital World, Curated by You',
  description: 'Organize, access, and share your web discoveries across devices and with your community.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
