import Image from "next/image";
import { getImageUrl } from "@/constants/api";
import "./RideHero.css";

export default function RideHero({ ride }) {
  const isVideo = ride.heroType === "video" && ride.heroVideo;
  const videoSrc = isVideo ? getImageUrl(ride.heroVideo) : null;

  return (
    <section className="ride-hero-container">
      {/* Page Title Header matching reference image: CASTLE JET */}
      <div className="ride-hero-header">
        <h1 className="ride-main-title">{ride.n}</h1>
      </div>

      {/* Rounded Hero Banner Box */}
      <div className="ride-hero-banner-wrapper">
        <div className="ride-hero-media">
          {ride.heroType === "image" && (
            ride.heroImage ? (
              <Image
                src={getImageUrl(ride.heroImage)}
                alt={ride.n}
                fill
                unoptimized
                priority
                className="ride-hero-image"
              />
            ) : (
              <div className="ride-hero-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                <span style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image Unavailable</span>
              </div>
            )
          )}

          {ride.heroType === "video" && (
            videoSrc ? (
              <video
                className="ride-hero-video"
                autoPlay
                muted
                loop
                playsInline
                poster={ride.heroImage ? getImageUrl(ride.heroImage) : undefined}
              >
                <source src={videoSrc} type="video/mp4" />
                {ride.heroImage && (
                  <Image
                    src={getImageUrl(ride.heroImage)}
                    alt={ride.n}
                    fill
                    unoptimized
                    priority
                    className="ride-hero-image"
                  />
                )}
              </video>
            ) : (
              <div className="ride-hero-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                <span style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Video Unavailable</span>
              </div>
            )
          )}

          {ride.heroType === "youtube" && (
            <iframe
              className="ride-hero-youtube"
              src={ride.heroYoutube?.includes('watch?v=') ? ride.heroYoutube.replace('watch?v=', 'embed/') : ride.heroYoutube}
              title={ride.n}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}