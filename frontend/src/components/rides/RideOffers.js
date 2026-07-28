"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Tag, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "./RideOffers.css";

export default function RideOffers() {
  const sliderRef = useRef(null);

  const sampleOffers = [
    {
      id: 1,
      type: "COMBO OFFER",
      title: "Super Fun Pass",
      subtext: "Unlimited rides + Water Park",
      price: "₹1,299",
      save: "Save 20%",
      badgeColor: "#E65100"
    },
    {
      id: 2,
      type: "FAMILY OFFER",
      title: "Family Fun Pack",
      subtext: "4 Tickets + 1 Free",
      price: "₹3,999",
      save: "Save 25%",
      badgeColor: "#E65100"
    },
    {
      id: 3,
      type: "LIMITED TIME",
      title: "Weekend Special",
      subtext: "Flat 30% OFF on all tickets",
      price: "30% OFF",
      save: "Save 30%",
      badgeColor: "#C62828"
    }
  ];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="ride-offers-section">
      <div className="ride-offers-wrap">
        
        {/* Banner Card Wrapper matching reference design */}
        <div className="offers-banner-container">
          
          <div className="offers-header-row">
            <div>
              <h2 className="offers-title">READY FOR MORE ADVENTURES?</h2>
              <p className="offers-subtext">Explore our exciting offers and enjoy more fun for less!</p>
            </div>
            <div className="slider-controls">
              <button className="slider-arrow-btn" onClick={scrollLeft} aria-label="Previous offers">
                <ChevronLeft size={20} />
              </button>
              <button className="slider-arrow-btn" onClick={scrollRight} aria-label="Next offers">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="offers-main-grid">
            
            {/* LEFT SIDE: Reusable Offer Cards Slider */}
            <div className="offers-slider-container" ref={sliderRef}>
              {sampleOffers.map((offer) => (
                <div key={offer.id} className="reference-offer-card">
                  <div className="card-top-tag">
                    <span className="offer-type-label">{offer.type}</span>
                    <span className="save-badge">{offer.save}</span>
                  </div>

                  <h3 className="card-offer-title">{offer.title}</h3>
                  <p className="card-offer-subtext">{offer.subtext}</p>

                  <div className="card-price-row">
                    <span className="card-price-value">{offer.price}</span>
                  </div>

                  <button className="card-book-now-btn">
                    <span>BOOK NOW</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: Purple CTA Card */}
            <div className="reference-purple-cta-card">
              <h3 className="purple-cta-title">View All Offers</h3>
              <p className="purple-cta-desc">
                Explore more exciting offers and combos made just for you!
              </p>
              <Link href="/offers" className="yellow-view-offers-btn">
                <span>VIEW OFFERS</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
