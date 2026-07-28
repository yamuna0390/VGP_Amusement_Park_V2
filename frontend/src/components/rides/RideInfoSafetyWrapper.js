import React from "react";
import RideInformation from "./RideInformation";
import RideSafety from "./RideSafety";
import "./RideInfoSafetyWrapper.css";

export default function RideInfoSafetyWrapper({ rideInfo, safetyRules, locationName }) {
  return (
    <section className="ride-info-safety-section">
      <div className="ride-info-safety-wrap">
        <div className="ride-info-safety-grid">
          {/* Section 4: Ride Information */}
          <div className="info-col">
            <RideInformation rideInfo={rideInfo} locationName={locationName} />
          </div>

          {/* Section 5: Safety Information */}
          <div className="safety-col">
            <RideSafety safetyRules={safetyRules} />
          </div>
        </div>
      </div>
    </section>
  );
}
