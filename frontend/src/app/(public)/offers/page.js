"use client";

import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";
import "@/components/Offers/offers-page.css";
import { offersData } from "@/data/offersData";

// Pastel background hex values — used for the curved body overlap colour
const BG_HEX = {
  "bg-mint":       "#D8F5EF",
  "bg-lavender":   "#EAE2F8",
  "bg-sky":        "#D5EEFF",
  "bg-cream":      "#FFF8EC",
  "bg-peach":      "#FFE8DC",
  "bg-softyellow": "#FFF6D0",
  "bg-purple-card":"#5A257F",
};

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
              {offersData.map((offer, idx) => {
                const cardBg = BG_HEX[offer.bg] || "#FFF8EC";

                return (
                  <div
                    key={idx}
                    className={`card ride-card ${offer.bg}`}
                    style={{ "--ride-body-bg": cardBg }}
                  >
                    {/* ── Image Media ── */}
                    <div
                      className="card-media ride-media"
                      aria-label={`Apply ${offer.name}`}
                    >
                      {offer.img && (
                        <Image
                          src={offer.img}
                          alt={offer.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="ride-photo"
                          loading="lazy"
                        />
                      )}
                    
                      {/* Category badge */}
                      {offer.badge && <span className="ride-badge">{offer.badge}</span>}
                    </div>

                    {/* ── Curved Wave Transition ── */}
                    <div className="ride-wave" aria-hidden="true">
                      <svg
                        viewBox="0 0 400 40"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M0,40 L0,18 Q100,0 200,20 Q300,40 400,18 L400,40 Z"
                          fill={cardBg}
                        />
                      </svg>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="card-body ride-body">
                      <h3 className="ride-name">{offer.name}</h3>
                      <p className="ride-desc">{offer.desc}</p>
                      <div className="ride-footer">
                        <p className="ride-mfr">{offer.validity || "Apply Online"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          </div>

        </div>
      </section>
    </div>
  );
}
