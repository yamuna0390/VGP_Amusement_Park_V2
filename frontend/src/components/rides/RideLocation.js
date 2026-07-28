import React from "react";
import { MapPin, Navigation, Compass } from "lucide-react";
import "./RideLocation.css";

export default function RideLocation({ rideName, mapInfo }) {
  const name = rideName || "Castle Jet";
  const zone = mapInfo?.zone || "Adventure Zone";
  const lat = mapInfo?.lat || 12.9089;
  const lng = mapInfo?.lng || 80.2495;

  return (
    <section className="ride-location-section">
      <div className="ride-location-wrap">
        
        {/* Header */}
        <div className="location-header">
          <span className="location-subhead">Park Navigation</span>
          <h2 className="location-title">Find {name}</h2>
          <p className="location-desc">
            Located conveniently inside the <strong>{zone}</strong> at VGP Universal Kingdom. Follow park directional signages or use the map below.
          </p>
        </div>

        {/* Map Container Placeholder */}
        <div className="map-placeholder-card">
          <div className="map-visual-background">
            <div className="map-grid-pattern"></div>
            <div className="map-zone-path"></div>
            
            {/* Centered Location Marker */}
            <div className="map-marker-pin">
              <div className="marker-pulse"></div>
              <div className="marker-head">
                <MapPin size={26} color="#ffffff" />
              </div>
              <div className="marker-label">
                <strong>{name}</strong>
                <span>{zone}</span>
              </div>
            </div>

            {/* Map Controls overlay mock */}
            <div className="map-control-overlay">
              <div className="map-info-badge">
                <Compass size={16} />
                <span>Zone: {zone}</span>
              </div>
              <div className="map-coord-badge">
                <Navigation size={14} />
                <span>{lat}° N, {lng}° E</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
