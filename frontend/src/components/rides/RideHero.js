import Image from "next/image";
import "./RideHero.css";

export default function RideHero({ ride }) {
  const isVideo = ride.heroType === "video";
  const videoSrc = isVideo ? (ride.heroVideo || "/assets/images/rides/roller1.jpg") : null;

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
            <Image
              src={ride.heroImage || "/images/rides/castle-jet/card.webp"}
              alt={ride.n}
              fill
              priority
              className="ride-hero-image"
            />
          )}

          {ride.heroType === "video" && (
            <video
              className="ride-hero-video"
              autoPlay
              muted
              loop
              playsInline
              poster={ride.heroImage || "/assets/images/rides/roller1.jpg"}
            >
              <source src={videoSrc} type="video/mp4" />
              <Image
                src={ride.heroImage || "/assets/images/rides/roller1.jpg"}
                alt={ride.n}
                fill
                priority
                className="ride-hero-image"
              />
            </video>
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