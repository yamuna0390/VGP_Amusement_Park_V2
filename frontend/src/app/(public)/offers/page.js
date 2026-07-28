"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import OfferCard from "@/components/Offers/OfferCard";
import { offersData } from "@/data/offersData";

export default function Offers() {
  return (
    <div className="page show" id="page-offers">
      
      {/* ── 1. Hero Section matching Rides Listing UI ── */}
     
         <div className="hero" style={{ padding: "46px 20px" }}>
        <h2>Special Offers &amp; Exclusive Deals</h2>
        <p>Enjoy amazing savings on your next visit to VGP Universal Kingdom. Limited-time offers, student discounts, birthday specials, family deals, and more.</p>
    
        {/* Online Booking Notice Pill */}
        <div className="offers-notice-pill" style={{ marginTop: "18px" }}>
          <div className="notice-icon-circle">
            <Info size={16} color="#ffffff" />
          </div>
          <span>All Offers are Valid Only on Online Bookings</span>
        </div>
      </div>

      <div className="zigzag"></div>

      {/* ── 2. Offer Cards Grid ── */}
      <section>
        <div className="wrap">
          
          {/* Offer Cards Grid (3 cards per row desktop, 2 tablet, 1 mobile) */}
          {offersData.length > 0 ? (
            <div className="grid ride-grid">
              {offersData.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="empty-offers-box">
              <div style={{ fontSize: "4rem", marginBottom: "12px" }}>🎟️</div>
              <h3 className="empty-offers-title">No offers available</h3>
              <p className="empty-offers-desc">
                There are currently no active deals. Check back soon or explore all current park tickets.
              </p>
            </div>
          )}

          {/* ── 3. Promotional Banner ── */}
          <div className="promo-banner-card">
            <div>
              <span className="promo-banner-sub">🎉 Limited Time Offers</span>
              <h3 className="promo-banner-title">Save More This Season</h3>
              <p className="promo-banner-desc">
                Exclusive online discounts are automatically applied when you pre-book your park passes.
              </p>
            </div>

            <Link href="/booking" className="cta-big cta-green">
              Book Tickets Now ➔
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
