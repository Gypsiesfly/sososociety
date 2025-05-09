import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'sosociety',
  description: 'Social Media Management Platform',
  generator: 'Next.js',
  icons: {
    icon: '/images/sslogo.png',
    apple: '/images/sslogo.png',
    shortcut: '/images/sslogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  )
}
