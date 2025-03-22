import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karan Gupta | Space Portfolio',
  description: 'A modern portfolio showcasing my journey through the cosmos of code, featuring interactive 3D experiences and cutting-edge web technologies.',
  keywords: [
    'portfolio',
    'web development',
    '3D graphics',
    'React',
    'Three.js',
    'TypeScript',
    'WebGL',
    'space theme',
  ],
  authors: [{ name: 'Karan Gupta' }],
  creator: 'Karan Gupta',
  publisher: 'Karan Gupta',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://karangupta.dev',
    title: 'Karan Gupta | Space Portfolio',
    description: 'A modern portfolio showcasing my journey through the cosmos of code, featuring interactive 3D experiences and cutting-edge web technologies.',
    siteName: 'Karan Gupta Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Karan Gupta Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karan Gupta | Space Portfolio',
    description: 'A modern portfolio showcasing my journey through the cosmos of code, featuring interactive 3D experiences and cutting-edge web technologies.',
    images: ['/og-image.jpg'],
    creator: '@karangupta',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
} 