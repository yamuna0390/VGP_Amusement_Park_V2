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

import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/constants/api";

const FADE_DURATION_MS = 700;
const FALLBACK_YOUTUBE_ID = "a1Fw7SqAcP0";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function HeroVideoBackground() {
  const containerRef = useRef(null);
  const [videoConfig, setVideoConfig] = useState(null);

  // Fetch config on mount
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/homepage-video`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        const data = await response.json();
        
        if (isMounted) {
          if (data && data.success && data.videoUrl) {
            setVideoConfig({ type: "local", src: getImageUrl(data.videoUrl) });
          } else {
            setVideoConfig({ type: "youtube", youtubeId: FALLBACK_YOUTUBE_ID });
          }
        }
      } catch (error) {
        console.error("Failed to load video settings:", error);
        if (isMounted) {
          setVideoConfig({ type: "youtube", youtubeId: FALLBACK_YOUTUBE_ID });
        }
      }
    };
    fetchConfig();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !videoConfig) return;

    // ── LOCAL VIDEO PATH ────────────────────────────────────────────────
    if (videoConfig.type === "local") {
      const video = document.createElement("video");
      video.src = videoConfig.src;
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
    if (videoConfig.type !== "youtube") return;

    const { youtubeId } = videoConfig;

    // Create the iframe element that will receive the YT player.
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

    // Build the embed URL with all the flags needed to suppress controls & autoplay silently
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
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange(event) {
            if (destroyed) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              iframe.style.opacity = "1";
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById("yt-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }

      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === "function") prevReady();
        initPlayer();
      };
    }

    return () => {
      destroyed = true;
      if (player && typeof player.destroy === "function") {
        try { player.destroy(); } catch (_) {}
      }
      if (container.contains(iframe)) container.removeChild(iframe);
    };
  }, [videoConfig]); 

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
