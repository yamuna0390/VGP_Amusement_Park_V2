"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Loader2 } from "lucide-react";
import "@/components/Offers/offers-page.css";
import { fetchOffers } from "@/services/offerApi";

const BG_HEX = {
  "bg-mint":       "#D8F5EF",
  "bg-lavender":   "#EAE2F8",
  "bg-sky":        "#D5EEFF",
  "bg-cream":      "#FFF8EC",
  "bg-peach":      "#FFE8DC",
  "bg-softyellow": "#FFF6D0"
};

const bgKeys = Object.keys(BG_HEX);

const fallbackImages = [
  "/images/offers/offer_early_bird.jpg",
  "/images/offers/offer_college_students.jpg",
  "/images/offers/offer_double_dhamaka.jpg",
  "/images/offers/offer_aadi_special.jpg",
  "/images/offers/offer_friendship_day.jpg",
  "/images/offers/offer_little_legend.jpg",
  "/images/offers/offer_birthday_special.jpg"
];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getShortTicketName(name) {
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower.includes("adult")) return "Adult";
  if (lower.includes("child")) return "Child";
  if (lower.includes("senior")) return "Senior";
  if (lower.includes("student")) return "Student";
  return name;
}

function groupBuyXGetY(offerTickets) {
  if (!offerTickets || offerTickets.length === 0) return [];
  const groups = {};
  offerTickets.forEach(tk => {
    const minQty = tk.minQty !== undefined ? tk.minQty : tk.min_qty;
    const freeQty = tk.freeQty !== undefined ? tk.freeQty : tk.free_qty;
    const key = `${minQty}-${freeQty}`;
    if (!groups[key]) groups[key] = { min: minQty, free: freeQty, tickets: [] };
    groups[key].tickets.push(getShortTicketName(tk.ticketCode || tk.ticketName || tk.ticket_name));
  });

  return Object.values(groups).map(g => ({
    mainText: `Buy ${g.min} → Get ${g.free} Free`,
    subText: `Applicable to: ${[...new Set(g.tickets)].join(", ")}`
  }));
}

function generateBadge(offer) {
  if (offer.promotion_type === "PERCENTAGE") return `${offer.discount_value}% OFF`;
  if (offer.promotion_type === "FLAT") return `₹${offer.discount_value} OFF`;
  return null;
}

export default function Offers() {
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOffers();
        setOffersData(data);
      } catch (err) {
        console.error("Failed to load offers:", err);
        setError("Offers are temporarily unavailable. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          {loading ? (
            <div className="empty-offers-box" style={{ padding: "60px 20px" }}>
              <Loader2 className="spinner" size={40} color="#5A257F" style={{ margin: "0 auto", animation: "spin 1s linear infinite" }} />
              <p style={{ marginTop: "16px", color: "#666" }}>Loading amazing offers...</p>
            </div>
          ) : error ? (
            <div className="empty-offers-box">
              <div style={{ fontSize: "3rem", marginBottom: "12px", color: "red" }}>⚠️</div>
              <h3 className="empty-offers-title">Oops!</h3>
              <p className="empty-offers-desc">{error}</p>
            </div>
          ) : offersData.length > 0 ? (
            <div className="grid ride-grid">
              {offersData.map((offer, idx) => {
                const bgClass = bgKeys[idx % bgKeys.length];
                const cardBg = BG_HEX[bgClass];
                const badgeText = generateBadge(offer);
                const displayImg = fallbackImages[idx % fallbackImages.length];

                return (
                  <div
                    key={offer.id || idx}
                    className={`card ride-card ${bgClass}`}
                    style={{ "--ride-body-bg": cardBg }}
                  >
                    {/* ── Image Media ── */}
                    <div
                      className="card-media ride-media"
                      aria-label={`Apply ${offer.offer_name}`}
                    >
                      <Image
                        src={displayImg}
                        alt={offer.offer_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="ride-photo"
                        loading="lazy"
                      />
                    
                      {/* Category badge */}
                      {badgeText && <span className="ride-badge">{badgeText}</span>}
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
                    <div className="card-body ride-body" style={{ color: "#222" }}>
                      <h3 className="ride-name" style={{ marginBottom: "8px" }}>{offer.offer_name}</h3>
                      
                      {/* BUY X GET Y Rules */}
                      {offer.promotion_type === "BUY_X_GET_Y" && (
                        <div style={{ marginBottom: "12px" }}>
                          {groupBuyXGetY(offer.offer_tickets).map((rule, rIdx) => (
                            <div key={rIdx} style={{ marginBottom: "6px" }}>
                              <strong style={{ display: "block", fontSize: "1.1rem" }}>{rule.mainText}</strong>
                              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{rule.subText}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      {offer.description && (
                        <p className="ride-desc" style={{ marginBottom: "12px", fontWeight: "500", color: "#333" }}>
                          {offer.description}
                        </p>
                      )}

                      {/* Instruction */}
                      {offer.instruction && (
                        <div style={{ marginTop: "12px", padding: "10px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "6px" }}>
                          <strong style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>Instructions:</strong>
                          <p style={{ fontSize: "0.85rem", margin: 0 }}>{offer.instruction}</p>
                        </div>
                      )}

                      <div className="ride-footer" style={{ marginTop: "16px" }}>
                        <p className="ride-mfr" style={{ fontWeight: "600" }}>
                          {offer.valid_from && offer.valid_to 
                            ? `Valid: ${formatDate(offer.valid_from)} – ${formatDate(offer.valid_to)}` 
                            : "Apply Online"}
                        </p>
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
