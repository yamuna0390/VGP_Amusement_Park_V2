import { Roboto_Condensed, Nunito } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
import { ToastProvider } from "@/context/ToastContext";
import { BookingProvider } from "@/context/BookingContext";

export default function RootLayout({ children }) {
  return (
 <html lang="en" className={`${robotoCondensed.variable} ${nunito.variable}`}>
       <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1489626672612829');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
  <body>
    <ToastProvider>
        <BookingProvider>
          {children}
        </BookingProvider>
    </ToastProvider>
  </body>
</html>
  );
}
