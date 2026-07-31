import Navigation from "@/components/layout/Navigation";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function PublicLayout({ children }) {
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