import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./OfferCard.css";

const BG_HEX = {
  "bg-mint": "#D8F5EF",
  "bg-lavender": "#EAE2F8",
  "bg-sky": "#D5EEFF",
  "bg-cream": "#FFF8EC",
  "bg-peach": "#FFE8DC",
  "bg-softyellow": "#FFF6D0",
  "bg-purple": "#EAE2F8",
};

export default function OfferCard({ offer }) {
  const cardBg = BG_HEX[offer.bg] || "#FFF8EC";

  return (
    <div
      className={`card ride-card offer-card ${offer.bg}`}
      style={{ "--ride-body-bg": cardBg }}
    >
      {/* ── Image & Badge ── */}
      <div className="card-media ride-media offer-media">
        <Image
          src={offer.img}
          alt={offer.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="ride-photo offer-photo"
          loading="lazy"
        />

        {/* Offer Badge over image */}
        <span className="ride-badge offer-badge">{offer.badge}</span>
      </div>

      {/* ── Curved Wave Transition ── */}
      <div className="ride-wave" aria-hidden="true">
        <svg
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 L0,18 Q100,0 200,20 Q300,40 400,18 L400,40 Z"
            fill={cardBg}
          />
        </svg>
      </div>

      {/* ── Card Body ── */}
      <div className="card-body ride-body offer-body">
        <div className="offer-code-tag">
          <span>CODE:</span> <strong>{offer.code}</strong>
        </div>

        <h3 className="ride-name offer-title">{offer.name}</h3>
        <p className="ride-desc offer-desc">{offer.desc}</p>

        <div className="offer-validity-box">
          <span>{offer.validity}</span>
        </div>

        <div className="ride-footer offer-footer">
          <Link href="/booking" className="btn-book offer-claim-btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
