import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karel Interior Designs',
  description: 'Where imagination becomes a masterpiece. Transform your space with our expert interior design services.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/karel-logo.png" type="image/png" />
        <link rel="preload" href="/images/karel-logo.png" as="image" />
        <link rel="preload" href="/images/living-room-1.jpg" as="image" />
        <link rel="preload" href="/images/living-room-2.jpg" as="image" />
        <link rel="preload" href="/images/living-room-3.jpg" as="image" />
        <link rel="preload" href="/images/living-room-4.jpg" as="image" />
        <link rel="preload" href="/images/living-room-5.jpg" as="image" />
      </head>
      <body className={GeistSans.className}>{children}</body>
    </html>
  )
}
