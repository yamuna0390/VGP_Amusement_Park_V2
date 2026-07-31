"use client";

/**
 * BeachSlider
 * -----------
 * Refactored "Private Beach" section → immersive promotional slider.
 * Replaces the static .beach strip while keeping the existing component
 * architecture, Swiper dependency, colour palette and font variables.
 *
 * Swiper modules used: Autoplay · Pagination · Navigation · Keyboard · A11y
 * (all already available via the installed `swiper` package)
 *
 * DATA-DRIVEN — update SLIDES to change content without touching any markup.
 * Image paths: local assets under /assets/ where available; remote URLs
 * otherwise, ready to swap to real photography.
 */

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  Keyboard,
  A11y,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ── SLIDE DATA ─────────────────────────────────────────────────────────────
// To integrate with a CMS/API later, replace this array with a prop or fetch.
const SLIDES = [
  {
    id: "route-map",
    heading: "Park Route Map",
    sub: "Plan your adventure",
    description:
      "Navigate VGP Amusement Park with ease using our interactive route map. Quickly locate rides, attractions, food courts, restrooms, first aid, and other key facilities to make the most of your visit.",
    cta: { label: "VIEW MAP", href: "/contact" },
    cta2: { label: "Know More", href: "/contact" },
    img: "/assets/img_57957d8c2b63.jpg",
    imgAlt: "VGP Private Beach golden shoreline",
    accent: "#B11E63",        // --red
    accentDark: "#922152",    // --red-dark
  },
  {
    id: "corporate",
    icon: "🎉",
    heading: "Corporate Get-Together",
    sub: "TEAM CELEBRATIONS",
    description:
      "Impress your team with an award function, corporate day-out or product launch against the stunning backdrop of the Bay of Bengal — for groups of up to 3,000.",
    cta: { label: "Plan Your Event", href: "/contact" },
    cta2: { label: "Contact Us", href: "/contact" },
    img: "/assets/img_cc82cec5afc0.jpg",
    imgAlt: "Corporate celebration at VGP",
    accent: "#5A257F",        // --purple
    accentDark: "#4A216B",
  },
  {
    id: "birthday",
    icon: "🎂",
    heading: "Birthday Celebrations",
    sub: "MAKE IT UNFORGETTABLE",
    description:
      "Celebrate unforgettable birthdays by the sea — rides, entertainment and a private beach setting that your family will talk about for years.",
    cta: { label: "Book a Party", href: "/contact" },
    cta2: { label: "See the Park", href: "/rides" },
    img: "/assets/img_3da7a8d8bdc1.jpg",
    imgAlt: "Birthday celebration at VGP beach",
    accent: "#B11E63",
    accentDark: "#922152",
  },
  {
    id: "school",
    icon: "🏫",
    heading: "School Annual Day",
    sub: "GRAND VENUE · 3,000 GUESTS",
    description:
      "Host school annual days, award ceremonies and inter-school events in our sprawling open-air amphitheatre. Safe, spacious and spectacular.",
    cta: { label: "Reserve the Venue", href: "/contact" },
    cta2: { label: "Learn More", href: "/contact" },
    img: "/assets/img_5b25b363752a.jpg",
    imgAlt: "School annual day event at VGP",
    accent: "#22A7B3",
    accentDark: "#0E7C88",
  },
  {
    id: "college",
    icon: "🎉",
    heading: "College Group Outings",
    sub: "Adventure, Fun & Unforgettable Memories",
    description:
      "Enjoy thrilling rides, fun-filled attractions, delicious dining, and dedicated group packages designed to create lasting memories with friends and faculty. Whether it's a class picnic, farewell celebration, or educational outing, VGP offers an unforgettable experience.",
    cta: { label: "Enquire Now", href: "/contact" },
    cta2: { label: "See the Venue", href: "/contact" },
    img: "/assets/img_8e05ad0b70cd.jpg",
    imgAlt: "College group outing at VGP",
    accent: "#B36D3C",        // --green (warm brown)
    accentDark: "#8F5426",
  },
];
// ───────────────────────────────────────────────────────────────────────────

export default function BeachSlider() {
  const progressRef = useRef(null);

  return (
    <section className="beach-slider" aria-label="Private Beach &amp; Events">

      {/* ── Subtle SVG wave watermark ───────────────────────────────── */}
      <svg
        className="bs-wave-bg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="var(--blue)"
          fillOpacity=".22"
          d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,197.3C840,203,960,181,1080,165.3C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        <path
          fill="var(--blue-deep)"
          fillOpacity=".14"
          d="M0,256L80,240C160,224,320,192,480,197.3C640,203,800,245,960,250.7C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>

      {/* ── Swiper ───────────────────────────────────────────────────── */}
      <div className="bs-wrap">
        <Swiper
          className="bs-swiper"
          modules={[Autoplay, Pagination, Navigation, Keyboard, A11y]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, el: ".bs-dots" }}
          navigation={{ prevEl: ".bs-prev", nextEl: ".bs-next" }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          speed={650}
          grabCursor
          onAutoplayTimeLeft={(s, _time, progress) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${1 - progress})`;
            }
          }}
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <div className="bs-card" style={{ "--accent": slide.accent, "--accent-dark": slide.accentDark }}>

                  {/* LEFT — text content */}
                  <div className="bs-content">
                    <span className="bs-sub">{slide.sub}</span>
                    <div className="bs-icon" aria-hidden="true">{slide.icon}</div>
                    <h2 className={`bs-heading ${isActive ? "bs-anim-up" : ""}`}>
                      {slide.heading}
                    </h2>
                    <p className={`bs-desc ${isActive ? "bs-anim-up bs-delay-1" : ""}`}>
                      {slide.description}
                    </p>
                    <div className={`bs-actions ${isActive ? "bs-anim-up bs-delay-2" : ""}`}>
                      <Link
                        href={slide.cta.href}
                        className="bs-btn-primary"
                        id={`beach-slider-cta-${slide.id}`}
                      >
                        {slide.cta.label}
                      </Link>
                      <Link
                        href={slide.cta2.href}
                        className="bs-btn-ghost"
                        id={`beach-slider-cta2-${slide.id}`}
                      >
                        {slide.cta2.label} →
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT — image */}
                  <div className={`bs-img-wrap ${isActive ? "bs-anim-in" : ""}`}>
                    <img
                      src={slide.img}
                      alt={slide.imgAlt}
                      loading="lazy"
                      decoding="async"
                      className="bs-img"
                    />
                    {/* Accent chip */}
                    <div className="bs-chip" aria-hidden="true">{slide.icon}</div>
                  </div>

                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Custom nav row ─────────────────────────────────────────── */}
        <div className="bs-nav-row" aria-hidden="true">
          <button className="bs-arrow bs-prev" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dot indicators rendered by Swiper into this container */}
          <div className="bs-dots" />

          <button className="bs-arrow bs-next" aria-label="Next slide">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Autoplay progress bar */}
        <div className="bs-progress-track" aria-hidden="true">
          <div className="bs-progress-bar" ref={progressRef} />
        </div>
      </div>

    </section>
  );
}
