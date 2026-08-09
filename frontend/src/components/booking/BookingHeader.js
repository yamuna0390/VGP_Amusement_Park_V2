"use client";

import Link from "next/link";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import BookingStepper from "@/components/booking/BookingStepper";
import { Clock, Phone, ShieldCheck } from "lucide-react";
import "@/components/booking/booking.css";

export default function BookingHeader() {
  return (
    <header className="w-full bg-white border-b border-[#E8E0EC] shadow-[0_2px_10px_rgba(75,15,97,0.05)] relative z-50 flex items-center justify-center min-h-[86px] h-auto py-3">
      <Link href="/" className="flex items-center justify-center" aria-label="Return to homepage">
        <Image
          src="/assets/ukd_logo_t.png"
          alt="VGP Universal Kingdom Logo"
          width={180}
          height={75}
          className="h-[55px] sm:h-[65px] md:h-[75px] w-auto object-contain"
          priority
        />
      </Link>
    </header>
  );
}
