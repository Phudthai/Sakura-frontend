import type { Metadata } from 'next'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sakura - Japanese Product Ordering Platform',
  description:
    'บริการสั่งสินค้าจากญี่ปุ่นแบบออนไลน์พร้อมระบบติดตามพัสดุแบบเรียลไทม์',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
