"use client";
import { useState } from "react";
import { rides } from "@/data/rides";
import { IC } from "@/data/rideIcons";
import Pill from "@/components/ui/Pill";

export default function Rides() {
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "family", label: "Family Rides" },
    { id: "adult", label: "Adult Rides" },
    { id: "child", label: "Child Rides" },
    { id: "water", label: "Water Park" },
    { id: "zoo", label: "Petting Zoo" }
  ];

  const filteredRides = filter === "all" ? rides : rides.filter(r => r.c === filter);

  return (
    <div className="page show" id="page-rides">
      <div className="hero" style={{ padding: "46px 20px" }}>
        <h2>The Ride Timetable 🎢</h2>
        <p>22 rides + 11 water park attractions + Pet Zoo — from Okamoto, Zamperla, Moser & more!</p>
        <div className="video-frame" style={{ aspectRatio: "16/6", maxWidth: "640px" }} onClick={() => alert("▶ Rides montage video plays here")}>
          <div className="play-btn"></div>
          <span>All rides — video & GIF preview</span>
        </div>
      </div>
      <div className="zigzag"></div>
      
      <section>
        <div className="wrap">
          <div className="pills">
            {filters.map(f => (
              <Pill 
                key={f.id} 
                label={f.label} 
                active={filter === f.id} 
                onClick={() => setFilter(f.id)} 
              />
            ))}
          </div>

          <div className="grid g4">
            {filteredRides.map((ride, idx) => (
              <div key={idx} className={`card ${ride.bg}`}>
                <div className="card-media">
                  {ride.i ? (
                    <div className="svg-icon" dangerouslySetInnerHTML={{ __html: IC[ride.i] ? IC[ride.i]() : "" }} />
                  ) : (
                    <div className="emoji-icon">{ride.e}</div>
                  )}
                </div>
                <div className="card-body">
                  <span className="tag">{ride.c}</span>
                  <h3>{ride.n}</h3>
                  <p>{ride.d}</p>
                  <p style={{ opacity: 0.6, fontSize: "0.75rem", marginTop: "12px" }}>By {ride.m}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
