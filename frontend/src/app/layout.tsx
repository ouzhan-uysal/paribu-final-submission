import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToastProvider from 'components/contexts/ToastContext';
import { Web3AssistantContextProvider } from 'components/contexts/Web3AssistantContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Paribu - Solidity Bootcamp',
  description: 'House and Shop Rental Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="context">
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  )
}
