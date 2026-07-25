"use client";
import { useState } from "react";
import OfferScroll from "@/components/ui/OfferScroll";
import ScrollBanner from "@/components/ui/ScrollBanner";
import { OFFER_DEFAULTS } from "@/data/offers";

export default function Offers() {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const colors = {
    "bg-green": "var(--green-deep)",
    "bg-purple": "var(--purple)",
    "bg-yellow": "var(--yellow-dark)",
    "bg-red": "var(--red)",
    "bg-blue": "var(--blue)"
  };

  const icons = {
    "online15": "🎟️",
    "pct-cat": "🎓",
    "flat-adult": "🇮🇳",
    "kids": "🧒",
    "bogo-samecat": "🎂",
    "b2g1-samecat": "🎉",
    "info-double": "🐬"
  };

  return (
    <div className="page show" id="page-offers">
      <div className="hero" style={{ padding: "46px 20px" }}>
        <h2>Deals from the Raja's Treasury 🎁</h2>
        <p>Because royal fun should come with royal savings. Unfurl the scrolls to reveal our current offers!</p>
      </div>
      <div className="zigzag"></div>

      <section>
        <div className="wrap" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="section-head">
            <ScrollBanner title="Current Offers" subtitle="Valid for online & counter bookings" colorClass="sb-c1" />
          </div>

          <div id="offer-list" style={{ display: "flex", flexDirection: "column", gap: "24px" ,backgroundColor: "brown"}}>
            {OFFER_DEFAULTS.map((offer) => {
              const enrichedOffer = {
                ...offer,
                color: colors[offer.bg] || "var(--purple)",
                icon: icons[offer.kind] || "🎁",
                tag: offer.badge
              };

              return (
                <OfferScroll 
                  key={offer.id} 
                  offer={enrichedOffer} 
                  isSelected={selectedOffer === offer.id}
                  onSelect={(id) => setSelectedOffer(id === selectedOffer ? null : id)}
                />
              );
            })}
          </div>

          <p style={{ textAlign: "center", marginTop: "32px", fontSize: "0.85rem", opacity: 0.7 }}>
            * Offers cannot be combined. One offer or coupon code applies per booking. Subject to terms & conditions.
          </p>
        </div>
      </section>
    </div>
  );
}
