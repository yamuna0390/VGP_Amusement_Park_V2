"use client";

/**
 * HeroVideoBackground
 * -------------------
 * Temporary development implementation: uses a YouTube embed as the hero
 * video background while the final /public/assets/video/hero.mp4 asset is
 * being prepared.
 *
 * ── HOW TO SWAP TO THE LOCAL VIDEO LATER ─────────────────────────────────
 *   1. Change VIDEO_SOURCE.type  to  "local"
 *   2. Change VIDEO_SOURCE.src   to  "/assets/video/hero.mp4"
 *   3. The rest of the component adapts automatically.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * CONTRACT
 *   • Renders into the existing #hero-video container that is already
 *     present in the hero JSX. Do NOT call this component outside that
 *     context — it expects `.hero-video { position:absolute; inset:0; }`.
 *   • Existing `.hero-scrim`, decorations, characters, and CTAs sit above
 *     this layer via their own z-index rules (already in globals.css).
 *   • Falls back silently to the `.hero` background colour (#FFF7E7) if
 *     YouTube fails to load or the browser blocks autoplay.
 */

import { useEffect, useRef } from "react";

// ── VIDEO SOURCE CONFIG ───────────────────────────────────────────────────
const VIDEO_SOURCE = {
  /** "youtube" | "local" */
  type: "youtube",

  /** YouTube video ID (used when type === "youtube") */
  youtubeId: "a1Fw7SqAcP0",

  /** Local file path (used when type === "local") */
  // src: "/assets/video/hero.mp4",
};
// ─────────────────────────────────────────────────────────────────────────

/** Duration (ms) for the opacity fade-in once the video starts playing. */
const FADE_DURATION_MS = 700;

export default function HeroVideoBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── LOCAL VIDEO PATH ────────────────────────────────────────────────
    if (VIDEO_SOURCE.type === "local") {
      const video = document.createElement("video");
      video.src = VIDEO_SOURCE.src;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.cssText =
        "width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity " +
        FADE_DURATION_MS +
        "ms ease";

      const showVideo = () => {
        video.style.opacity = "1";
      };
      video.addEventListener("canplay", showVideo, { once: true });
      video.addEventListener("playing", showVideo, { once: true });

      container.appendChild(video);

      return () => {
        video.removeEventListener("canplay", showVideo);
        video.removeEventListener("playing", showVideo);
        if (container.contains(video)) container.removeChild(video);
      };
    }

    // ── YOUTUBE EMBED ───────────────────────────────────────────────────
    if (VIDEO_SOURCE.type !== "youtube") return;

    const { youtubeId } = VIDEO_SOURCE;

    // Create the iframe element that will receive the YT player.
    // The `.yt-cover` class in globals.css handles the cover-fill sizing.
    const iframe = document.createElement("iframe");
    iframe.id = "hero-yt-player";
    iframe.className = "yt-cover";
    iframe.title = "VGP Universal Kingdom — hero background video";
    iframe.allow = "autoplay; encrypted-media";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "opacity:0;transition:opacity " +
      FADE_DURATION_MS +
      "ms ease;border:0;pointer-events:none;";

    // Build the embed URL with all the flags needed to suppress controls &
    // autoplay silently. `enablejsapi=1` allows the IFrame API to control it.
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: youtubeId, // required for loop to work
      controls: "0",
      showinfo: "0",
      rel: "0",
      iv_load_policy: "3", // suppress video annotations
      modestbranding: "1",
      disablekb: "1",
      fs: "0",
      cc_load_policy: "0",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?${params}`;

    container.appendChild(iframe);

    // ── YouTube IFrame API ─────────────────────────────────────────────
    let player;
    let destroyed = false;

    const initPlayer = () => {
      if (destroyed) return;

      player = new window.YT.Player("hero-yt-player", {
        events: {
          onReady(event) {
            if (destroyed) return;
            // Ensure muted & playing — some browsers block autoplay otherwise.
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange(event) {
            if (destroyed) return;

            // YT.PlayerState.PLAYING === 1  →  fade the iframe in
            if (event.data === window.YT.PlayerState.PLAYING) {
              iframe.style.opacity = "1";
            }

            // YT.PlayerState.ENDED === 0  →  loop manually as a safety net
            // (the `loop` param + `playlist` already handles this natively,
            // but we add the JS fallback for reliability).
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      // API already loaded (e.g. navigated back to this page).
      initPlayer();
    } else {
      // Inject the IFrame API script once and register our callback.
      if (!document.getElementById("yt-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }

      // `onYouTubeIframeAPIReady` may already be set by another component;
      // chain onto it to be safe.
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === "function") prevReady();
        initPlayer();
      };
    }

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      destroyed = true;
      if (player && typeof player.destroy === "function") {
        try {
          player.destroy();
        } catch (_) {
          // swallow errors on unmount
        }
      }
      if (container.contains(iframe)) container.removeChild(iframe);
    };
  }, []); // run once on mount

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
