import Navigation from "@/components/layout/Navigation";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import Mascot from "@/components/layout/Mascot";
export default function PublicLayout({ children }) {
  return (
    <>
      <Ticker />
      <Navigation />
      {children}
      <Footer />
      <Mascot />
    </>
  );
}