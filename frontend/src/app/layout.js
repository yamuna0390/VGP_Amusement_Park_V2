import { Roboto_Condensed, Nunito } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "VGP Universal Kingdom — Family Amusement Park",
  description: "VGP Universal Kingdom, Chennai — a family amusement & water park with 22 rides, 11 water-park attractions, a pet zoo, dining and stay.",
};

// import Navigation from "@/components/layout/Navigation";
// import Ticker from "@/components/layout/Ticker";
// import Footer from "@/components/layout/Footer";
// import Mascot from "@/components/layout/Mascot";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";

export default function RootLayout({ children }) {
  return (
 <html lang="en" className={`${robotoCondensed.variable} ${nunito.variable}`}>
  <body>
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          {children}
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  </body>
</html>
  );
}
