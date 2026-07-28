"use client";

/**
 * RideVideoPreview
 * ----------------
 * Renders the existing `.video-frame` preview element.
 * On click the preview is replaced by a lazily-loaded YouTube player
 * (no iframe is created until the user interacts).
 *
 * ── HOW TO SWAP TO THE LOCAL VIDEO LATER ──────────────────────────────
 *   1. Change VIDEO_SOURCE.type  to  "local"
 *   2. Change VIDEO_SOURCE.src   to  "/assets/video/rides.mp4"
 *   3. Nothing else needs to change.
 * ──────────────────────────────────────────────────────────────────────
 *
 * VISUAL CONTRACT
 *   • The outer <div className="video-frame"> keeps every existing CSS rule:
 *       aspect-ratio, max-width, border, border-radius, shadow, hover scale,
 *       cursor, transition — all untouched.
 *   • Before click  → play button + label are shown (existing HTML).
 *   • After click   → the iframe fills the same box (no layout shift).
 */

import { useState } from "react";

// ── VIDEO SOURCE CONFIG ────────────────────────────────────────────────
const VIDEO_SOURCE = {
  /** "youtube" | "local" */
  type: "youtube",

  /** YouTube video ID  (used when type === "youtube") */
  youtubeId: "kKwysjmqxJU",

  /** Local file path   (used when type === "local") */
  // src: "/assets/video/rides.mp4",
};
// ──────────────────────────────────────────────────────────────────────

export default function RideVideoPreview() {
  const [activated, setActivated] = useState(false);

  return (
    <div
      className="video-frame"
      style={{ aspectRatio: "16/6", maxWidth: "640px" }}
      onClick={() => !activated && setActivated(true)}
      /* Remove the hover-scale once the player is live so it doesn't
         interfere with iframe mouse events. */
      data-activated={activated ? "true" : undefined}
    >
      {activated ? (
        <VideoPlayer />
      ) : (
        /* ── PREVIEW (identical to the original markup) ── */
        <>
          <div className="play-btn" />
          <span>All rides — video &amp; GIF preview</span>
        </>
      )}
    </div>
  );
}

/** Renders either a YouTube iframe or a <video> depending on VIDEO_SOURCE. */
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

  // YouTube — autoplay=1 is safe here because this only renders after a
  // deliberate user click, satisfying browser autoplay-with-sound policies.
  const { youtubeId } = VIDEO_SOURCE;
  const params = new URLSearchParams({
    autoplay: "1",   // auto-starts after click
    controls: "1",   // show native YT controls
    rel: "0",        // suppress unrelated suggestions
    modestbranding: "1",
    enablejsapi: "0",
  });

  return (
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?${params}`}
      title="VGP rides montage"
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
