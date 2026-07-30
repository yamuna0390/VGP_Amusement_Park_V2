export const metadata = {
  title: "Book Tickets | VGP Universal Kingdom",
  description: "Securely book your VGP Universal Kingdom tickets and food packages online.",
};

import BookingHeader from "@/components/booking/BookingHeader";
import BookingFooter from "@/components/booking/BookingFooter";

export default function BookingLayout({ children }) {
  return (
    <>
      <BookingHeader />
      {children}
      <BookingFooter />
    </>
  );
}
