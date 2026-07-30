"use client";

import Link from "next/link";
import "@/components/booking/booking.css";

export default function BookingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bk-footer">
      <div className="bk-footer-inner">
        <p className="bk-copyright">
          &copy; {currentYear} VGP Universal Kingdom. All rights reserved.
        </p>
        <div className="bk-footer-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span className="bk-dot-sep">•</span>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <span className="bk-dot-sep">•</span>
          <Link href="/contact">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}
