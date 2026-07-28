"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  Keyboard,
  EffectFade,
  A11y,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "./RestaurantGallerySlider.css";

const GALLERY_SLIDES = [
  {
    id: 1,
    img: "/images/restaurant/beachside-ambience.jpg",
    title: "Beachside Ambience",
    tagline: "BAY OF BENGAL VIEWS",
    description: "Relax by the ocean breeze with panoramic shoreline seating and golden sunset vistas.",
    alt: "Sea Thru Diner beachside ambience"
  },
  {
    id: 2,
    img: "/images/restaurant/dine-under-stars.jpg",
    title: "Dine Under The Stars",
    tagline: "ROMANTIC OPEN-AIR DINING",
    description: "An unforgettable evening experience beneath the starry sky with waves crashing nearby.",
    alt: "Sea Thru Diner dining under the stars"
  },
  {
    id: 3,
    img: "/images/restaurant/gourmet-cuisine.jpg",
    title: "Gourmet Cuisine",
    tagline: "EXQUISITE MULTI-CUISINE",
    description: "Savor chef-curated seafood, authentic South Indian thalis, live grill counters and delicacies.",
    alt: "Sea Thru Diner gourmet cuisine"
  },
  {
    id: 4,
    img: "/images/restaurant/candlelight-evenings.jpg",
    title: "Candlelight Evenings",
    tagline: "MEMORABLE MOMENTS",
    description: "Curated candlelight dining setups perfect for couples, full moon nights, and special dates.",
    alt: "Sea Thru Diner candlelight evenings"
  },
  {
    id: 5,
    img: "/images/restaurant/celebrations.jpg",
    title: "Celebrations",
    tagline: "PRIVATE & GROUP EVENTS",
    description: "Host birthdays, family gatherings, and corporate celebrations in a premium seaside setting.",
    alt: "Sea Thru Diner celebrations"
  },
  {
    id: 6,
    img: "/images/restaurant/live-music.jpg",
    title: "Live Music",
    tagline: "EVENING ENTERTAINMENT",
    description: "Enjoy soothing acoustic melodies and live performances every weekend by the shore.",
    alt: "Sea Thru Diner live music"
  }
];

export default function RestaurantGallerySlider() {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef(null);
  const progressRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const paginationRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="restaurant-gallery-slider-wrapper">
        <div className="rg-swiper" />
      </div>
    );
  }

  return (
    <div className="restaurant-gallery-slider-wrapper">
      <Swiper
        className="rg-swiper"
        modules={[Autoplay, Pagination, Navigation, Keyboard, EffectFade, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={800}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        grabCursor={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (swiper.params && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevBtnRef.current;
            swiper.params.navigation.nextEl = nextBtnRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
          if (swiper.params && swiper.params.pagination) {
            swiper.params.pagination.el = paginationRef.current;
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();
          }
        }}
        onAutoplayTimeLeft={(_s, _time, progress) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${1 - progress})`;
          }
        }}
      >
        {GALLERY_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="rg-slide-card">
                {/* Background Image with subtle Ken Burns zoom */}
                <div className={`rg-image-container ${isActive ? "active-zoom" : ""}`}>
                  <Image
                    src={slide.img}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1150px"
                    priority={slide.id === 1}
                    className="rg-slide-img"
                  />
                  {/* Cinematic gradient overlay */}
                  <div className="rg-overlay" />
                </div>

                {/* Glassmorphism Caption Panel */}
                <div className={`rg-caption-panel ${isActive ? "rg-caption-anim" : ""}`}>
                  <span className="rg-tagline">{slide.tagline}</span>
                  <h3 className="rg-title">{slide.title}</h3>
                  <p className="rg-description">{slide.description}</p>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls Row */}
      <div className="rg-controls-row">
        <button
          ref={prevBtnRef}
          className="rg-nav-btn rg-prev"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div ref={paginationRef} className="rg-dots" />

        <button
          ref={nextBtnRef}
          className="rg-nav-btn rg-next"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Smooth Autoplay Progress Track */}
      <div className="rg-progress-track">
        <div className="rg-progress-bar" ref={progressRef} />
      </div>
    </div>
  );
}
