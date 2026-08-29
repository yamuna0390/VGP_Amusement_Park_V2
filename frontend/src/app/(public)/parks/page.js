"use client";
import "./parks.css";
import Link from "next/link";
import { ExternalLink, Compass } from "lucide-react";

export default function Parks() {
  const parksData = [
    {
      id: "marine",
      name: "VGP Marine Kingdom",
      url: "https://vgpmarinekingdom.in/",
      image: "/images/vgp-marine-kingdom.png",
      description: "India's first and largest underground walkthrough aquarium featuring a 70-meter underwater tunnel with sharks, stingrays, exotic marine species, and live mermaid performances.",
      badge: "Aquarium & Underwater Tunnel"
    },
    {
      id: "playy",
      name: "VGP Playy Kingdom",
      url: "https://vgpplayykingdom.in/",
      image: "/images/vgp-playy-kingdom.jpg",
      description: "Chennai's ultimate active entertainment center packed with trampoline parks, dodgeball arenas, foam pits, ninja warrior courses, and arcade adventures for all ages.",
      badge: "Trampoline & Indoor Arena"
    },
    {
      id: "cyber",
      name: "VGP Cyber Kingdom",
      url: "https://vgpcyberkingdom.in/",
      image: "/images/vgp-cyber-kingdom.jpg",
      description: "Next-generation immersive virtual reality gaming zone, multiplayer esports simulators, 9D VR motion rides, and cutting-edge cyber gaming experiences.",
      badge: "Virtual Reality & Esports"
    },
    {
      id: "waghoba",
      name: "VGP Waghoba",
      url: "https://www.vgpwaghoba.in/",
      image: "/images/zooPark.jpeg",
      description: "An eco-safari and nature park experience dedicated to wildlife conservation, wild cat habitats, exotic bird aviaries, and interactive outdoor trails.",
      badge: "Eco-Safari & Nature Park"
    }
  ];

  return (
    <div className="page show" id="page-parks" style={{ background: "#F4F5F7", minHeight: "100vh", paddingBottom: "60px" }}>
      
      {/* ── Hero Header Banner ── */}
      <div className="hero" style={{ padding: "48px 20px 36px", textAlign: "center", background: "linear-gradient(135deg, var(--purple-deep) 0%, #2A103D 100%)", color: "#fff" }}>
        <h1 className="contact-main-heading" style={{ color: "#FDDB00", textShadow: "3px 3px 0 var(--red)" }}>
          FOUR PARKS . ONE KINGDOM 👑
        </h1>
        <p style={{ color: "#E2D6EE", fontWeight: 700, fontSize: "1.1rem", marginTop: "10px", maxWidth: "780px", margin: "10px auto 0" }}>
          Your ultimate gateway to four world-class attraction kingdoms within VGP Universal Kingdom.
        </p>
      </div>

      <div className="zigzag"></div>

      {/* ── 4 Parks Cards Grid Section (2 per row desktop) ── */}
      <section style={{ padding: "40px 20px 60px" }}>
        <div className="wrap" style={{ maxWidth: "1180px", margin: "0 auto" }}>
          
          <div className="parks-grid-2">
            {parksData.map((park) => (
              <div
                key={park.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
              >
                <div>
                  {/* Card Thumbnail Image */}
                  <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden", background: "#1E293B" }}>
                    <img
                      src={park.image}
                      alt={park.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      loading="eager"
                    />
                    <span style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "rgba(15, 23, 42, 0.8)",
                      backdropFilter: "blur(6px)",
                      color: "#FDDB00",
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      padding: "5px 14px",
                      borderRadius: "16px",
                      letterSpacing: "0.5px"
                    }}>
                      {park.badge}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: "26px 24px 18px" }}>
                    <h3 style={{ fontSize: "1.45rem", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0", fontFamily: "var(--font-roboto-condensed), sans-serif", letterSpacing: "0.5px" }}>
                      {park.name}
                    </h3>
                    <p style={{ fontSize: "0.92rem", color: "#475569", fontWeight: "600", lineHeight: "1.6", margin: 0 }}>
                      {park.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Link Button */}
                <div style={{ padding: "0 24px 26px" }}>
                  <a
                    href={park.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-big cta-green"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "12px 20px",
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      borderRadius: "16px"
                    }}
                  >
                    <span>Visit {park.name}</span>
                    <ExternalLink size={17} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Callout Banner */}
          <div className="panel" style={{
            marginTop: "44px",
            textAlign: "center",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "36px 24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0"
          }}>
            <h3 style={{ fontSize: "1.45rem", fontWeight: "900", color: "#1E293B", marginBottom: "10px" }}>
              Ready for Unlimited Park Thrills?
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#64748B", fontWeight: "600", marginBottom: "22px" }}>
              Pre-book your tickets online to unlock exclusive discounts and skip queue lines!
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
