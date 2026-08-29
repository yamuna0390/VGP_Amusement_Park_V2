"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/constants/api";
import "./RideOverview.css";

export default function RideOverview({ ride }) {
  const gallery = ride?.gallery && ride.gallery.length > 0 ? ride.gallery : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const overviewText = ride?.overview || "Experience high-flying fun and panoramic views at VGP Universal Kingdom. Perfect for guests of all ages looking for an unforgettable attraction.";
  const safetyBullets = ride?.safety || [
    "Minimum height requirement applies.",
    "Children must be accompanied by an adult.",
    "Follow ride operator instructions at all times."
  ];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="ride-overview-section">
      <div className="ride-overview-wrap">
        <div className="ride-overview-grid">
          
          {/* LEFT COLUMN: Overview Text & Bullets */}
          <div className="overview-left-col">
            <span className="overview-subhead">Discover The Thrill</span>
            <h2 className="overview-title">Ride Overview</h2>
            <p className="overview-description">{overviewText}</p>

            <div className="overview-features-box">
              <h4 className="features-box-heading">Key Highlights & Safety Features</h4>
              <ul className="overview-bullets-list">
                {safetyBullets.map((bullet, idx) => (
                  <li key={idx} className="overview-bullet-item">
                    <CheckCircle2 className="bullet-icon" size={20} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Gallery & Carousel */}
          <div className="overview-right-col">
            {gallery.length > 0 ? (
              <>
                <div className="main-gallery-stage">
                  <img
                    src={getImageUrl(gallery[activeImageIndex])}
                    alt={`${ride?.n || "Ride"} View ${activeImageIndex + 1}`}
                    className="gallery-main-image"
                  />
                  <div className="gallery-badge">
                    Photo {activeImageIndex + 1} of {gallery.length}
                  </div>

                  {gallery.length > 1 && (
                    <>
                      <button className="gallery-nav-btn prev" onClick={handlePrev} aria-label="Previous Image">
                        <ChevronLeft size={22} />
                      </button>
                      <button className="gallery-nav-btn next" onClick={handleNext} aria-label="Next Image">
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {/* Carousel Thumbnails */}
                {gallery.length > 1 && (
                  <div className="gallery-thumbnails-carousel">
                    {gallery.map((imgUrl, index) => (
                      <button
                        key={index}
                        className={`thumbnail-btn ${index === activeImageIndex ? "active" : ""}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={getImageUrl(imgUrl)}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          unoptimized
                          className="thumbnail-img"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="main-gallery-stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                <span style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gallery Unavailable</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
