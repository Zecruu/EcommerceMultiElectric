import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multi Electric Supply - Professional Electrical Supplies',
  description: 'Your trusted source for professional electrical supplies and equipment. Quality products, competitive prices, and expert service.',
  keywords: 'electrical supplies, electrical equipment, professional electrical, Multi Electric Supply',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
