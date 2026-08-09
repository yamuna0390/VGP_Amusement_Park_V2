'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Ticker from './Ticker';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isBookingPage = pathname?.startsWith('/book');

  if (isBookingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Ticker />
      <Navigation />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
