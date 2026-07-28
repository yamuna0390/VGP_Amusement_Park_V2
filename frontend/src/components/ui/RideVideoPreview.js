"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// ── VIDEO SOURCE CONFIG ────────────────────────────────────────────────
const VIDEO_SOURCE = {
  type: "youtube",
  youtubeId: "kKwysjmqxJU", // VGP rides video
};
// ──────────────────────────────────────────────────────────────────────

export default function RideVideoPreview() {
  const [activated, setActivated] = useState(false);

  return (
    <div
      className="video-frame"
      style={{
        aspectRatio: "16/8",
        maxWidth: "760px",
        position: "relative",
        overflow: "hidden",
        backgroundImage: activated ? "none" : "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url('/images/rides_video_poster.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: "6px solid #FDDB00",
        borderRadius: "24px",
        boxShadow: "0 14px 34px rgba(0, 0, 0, 0.3)"
      }}
      onClick={() => !activated && setActivated(true)}
      data-activated={activated ? "true" : undefined}
    >
      {activated ? (
        <VideoPlayer />
      ) : (
        /* ── PREVIEW WITH USER ATTACHED BACKGROUND IMAGE & PLAY BUTTON ── */
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          userSelect: "none"
        }}>
          {/* Animated Play Button */}
          <div style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "#B11E63",
            border: "4px solid #FDDB00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(177, 30, 99, 0.6)",
            color: "#FFFFFF",
            paddingLeft: "4px",
            transition: "transform 0.2s ease, background-color 0.2s ease"
          }}>
            <Play size={32} fill="#FFFFFF" />
          </div>

          <span style={{
            color: "#FFFFFF",
            fontWeight: "900",
            fontSize: "1.1rem",
            marginTop: "12px",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            fontFamily: "var(--font-roboto-condensed), sans-serif",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}>
            Watch Kingdom Rides &amp; Thrills Video 🎥
          </span>
        </div>
      )}
    </div>
  );
}

/** Renders YouTube iframe or HTML5 video */
function VideoPlayer() {
  if (VIDEO_SOURCE.type === "local") {
    return (
      <video
        src={VIDEO_SOURCE.src}
        autoPlay
        controls
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          display: "block",
          objectFit: "cover",
        }}
      />
    );
  }

  const { youtubeId } = VIDEO_SOURCE;
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "0",
  });

  return (
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?${params}`}
      title="VGP Universal Kingdom Rides Video"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "inherit",
        display: "block",
      }}
    />
  );
}
