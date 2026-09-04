"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchRides } from "@/services/rideApi";
import { getImageUrl } from "@/constants/api";
import { IC } from "@/data/rideIcons";
import Pill from "@/components/ui/Pill";
import RideVideoPreview from "@/components/ui/RideVideoPreview";
import Link from "next/link";
// Pastel background hex values — used for the curved body overlap colour
const BG_HEX = {
  "bg-mint":       "#D8F5EF",
  "bg-lavender":   "#EAE2F8",
  "bg-sky":        "#D5EEFF",
  "bg-cream":      "#FFF8EC",
  "bg-peach":      "#FFE8DC",
  "bg-softyellow": "#FFF6D0",
  "bg-purple-card":"#5A257F",  // Telecombat card (dark accent)
};

export default function RidesClient() {
  const [filter, setFilter] = useState("all");
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRides() {
      const apiRides = await fetchRides();
      setRides(apiRides);
      setIsLoading(false);
    }
    loadRides();
  }, []);

  const filters = [
    { id: "all",    label: "All" },
    { id: "family", label: "Family Rides" },
    { id: "adult",  label: "Adult Rides" },
    { id: "child",  label: "Child Rides" },
    { id: "90-130", label: "90 cm – 130 cm" },
    { id: "water",  label: "Water Park" },
    { id: "zoo",    label: "Petting Zoo" }
  ];

  const filteredRides = filter === "all" 
    ? rides 
    : filter === "90-130"
      ? rides.filter(r => r.h === "90-130" || r.rideInfo?.minHeight?.includes("90"))
      : rides.filter(r => r.c === filter);

  if (isLoading) {
    return (
      <div className="page show" id="page-rides" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Loading rides...</p>
      </div>
    );
  }

  return (
    <div className="page show" id="page-rides">
      <div className="hero" style={{ padding: "46px 20px" }}>
        <h2 className="gradient-heading">The Ride Timetable 🎢</h2>
        <p>22 rides + 11 water park attractions + Pet Zoo — from Okamoto, Zamperla, Moser &amp; more!</p>
        {/* RideVideoPreview: YouTube temp — swap to local MP4 via VIDEO_SOURCE config */}
        <RideVideoPreview />
      </div>
      <div className="zigzag"></div>

      <section>
        <div className="wrap">
          {/* ── Filter Pills ── */}
          <div className="pills">
            {filters.map(f => (
              <Pill
                key={f.id}
                label={f.label}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </div>

          {/* ── Ride Cards Grid ── */}
          <div className="grid ride-grid">
            {filteredRides.map((ride, idx) => {
              const hasImage = !!ride.img;
              const hasSvg   = !!ride.i && IC[ride.i];
              const cardBg   = BG_HEX[ride.bg] || "#FFF8EC";

              return (
                <div
                  key={idx}
                  className={`card ride-card ${ride.bg}`}
                  style={{ "--ride-body-bg": cardBg }}
                >
               {/* ── Image / Icon Media ── */}
<Link
  href={`/rides/${ride.slug}`}
  className="card-media ride-media"
  aria-label={`Explore ${ride.n}`}
>
  {hasImage ? (
    <Image
      src={getImageUrl(ride.img)}
      alt={ride.n}
      fill
      unoptimized
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="ride-photo"
      loading="lazy"
    />
  ) : hasSvg ? (
    <div
      className="svg-icon ride-svg-icon"
      dangerouslySetInnerHTML={{ __html: IC[ride.i]() }}
    />
  ) : (
    <div className="emoji-icon ride-emoji-icon">{ride.e}</div>
  )}

  {/* Category badge */}
  <span className="ride-badge">{ride.c}</span>
</Link>

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
                    <h3 className="ride-name">{ride.n}</h3>
                    <p className="ride-desc">{ride.d}</p>
                    <div className="ride-footer">
                      <p className="ride-mfr">By {ride.m}</p>
                    <Link
  href={`/rides/${ride.slug}`}
  className="ride-arrow"
  aria-label={`Explore ${ride.n}`}
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
</Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
