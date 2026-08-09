"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Lock, Headphones } from "lucide-react";
import "@/components/booking/booking.css";

export default function BookingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A216B] text-white mt-12 py-8 border-t border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-purple-800 text-center sm:text-left">
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <ShieldCheck className="w-7 h-7 text-[#F6C33B] flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm">Best Price Guaranteed</h4>
              <p className="text-[11px] text-purple-200">Official Direct Booking</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Zap className="w-7 h-7 text-[#F6C33B] flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm">Instant Confirmation</h4>
              <p className="text-[11px] text-purple-200">E-Tickets & QR Pass</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Lock className="w-7 h-7 text-[#F6C33B] flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm">Safe & Secure</h4>
              <p className="text-[11px] text-purple-200">PCI DSS Encrypted</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Headphones className="w-7 h-7 text-[#F6C33B] flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm">24/7 Support</h4>
              <p className="text-[11px] text-purple-200">+91 44 2744 1234</p>
            </div>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-200">
          <p>© {currentYear} VGP Universal Kingdom. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
