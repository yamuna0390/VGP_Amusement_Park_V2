import React from "react";
import { Info, UserCheck, Settings, Timer, Ruler, Flame, Users, MapPin, Activity } from "lucide-react";
import "./RideInformation.css";

export default function RideInformation({ rideInfo, locationName }) {
  const info = rideInfo || {};

  const detailsList = [
    { label: "Ride Type", value: info.type || "Family Ride", icon: Info },
    { label: "Manufacturer", value: info.manufacturer || "Zamperla", icon: Settings },
    { label: "Ride Duration", value: info.duration || "2–3 Minutes", icon: Timer },
    { label: "Minimum Height", value: info.minHeight || "90 cm", icon: Ruler },
    { label: "Thrill Level", value: info.thrillLevel || "Medium", icon: Flame },
    { label: "Capacity", value: info.capacity || "24 Riders", icon: Users },
    { label: "Age Group", value: info.ageGroup || "3+ Years", icon: UserCheck },
    { label: "Location", value: info.location || locationName || "Adventure Zone", icon: MapPin },
    { label: "Status", value: info.status || "Operational", icon: Activity, isStatus: true }
  ];

  return (
    <div className="ride-info-card">
      <div className="ride-info-card-header">
        <h3 className="ride-info-card-title">Ride Information</h3>
        <span className="ride-info-badge">Key Specs</span>
      </div>

      <div className="ride-info-grid">
        {detailsList.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div key={index} className="ride-info-row">
              <div className="ride-info-label-box">
                <IconComp size={18} className="ride-info-row-icon" />
                <span className="ride-info-label">{item.label}</span>
              </div>
              <div className="ride-info-value-box">
                {item.isStatus ? (
                  <span className={`status-pill ${item.value.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    {item.value}
                  </span>
                ) : (
                  <span className="ride-info-value">{item.value}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
