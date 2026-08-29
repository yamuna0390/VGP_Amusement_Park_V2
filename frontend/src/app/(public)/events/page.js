"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublicEvents } from "@/services/eventApi";
import { getImageUrl } from "@/constants/api";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import "./Events.css";

function formatEventDate(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return "";
  
  const options = { day: "numeric", month: "short", year: "numeric" };
  const d1 = new Date(startDateStr);
  const d2 = new Date(endDateStr);
  
  const startFmt = d1.toLocaleDateString("en-US", options);
  const endFmt = d2.toLocaleDateString("en-US", options);
  
  if (startFmt === endFmt) {
    return startFmt;
  } else {
    // If same month/year, could shorten, but full dates is safer
    return `${startFmt} – ${endFmt}`;
  }
}

function formatEventTime(startTime, endTime) {
  if (startTime && endTime) {
    return `${formatTimeStr(startTime)} – ${formatTimeStr(endTime)}`;
  } else if (startTime) {
    return `From ${formatTimeStr(startTime)}`;
  }
  return null;
}

function formatTimeStr(timeStr) {
  // timeStr is usually "10:00:00"
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; 
  return `${hour}:${m} ${ampm}`;
}

function EventImage({ src, alt }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="event-image-fallback" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image Unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="event-card-image"
      onError={() => setError(true)}
    />
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const apiEvents = await getPublicEvents();
        setEvents(apiEvents || []);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Unable to load events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="page show" id="page-events">
      <div className="hero" style={{ padding: "60px 20px", background: "linear-gradient(135deg, #1e293b, #0f172a)", color: "white", textAlign: "center" }}>
        <h1 className="gradient-heading" style={{ margin: 0, fontSize: "2.5rem" }}>Upcoming Events</h1>
        <p style={{ maxWidth: "600px", margin: "16px auto 0", fontSize: "1.1rem", opacity: 0.9 }}>
          Discover the latest shows, festivals, and live entertainment happening at VGP Universal Kingdom.
        </p>
      </div>

      <section style={{ padding: "40px 20px" }}>
        <div className="wrap" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {isLoading ? (
            <div className="events-empty" style={{ border: "none", background: "transparent" }}>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="events-error">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="events-empty">
              <h3>No Events Available</h3>
              <p>There are no upcoming events at the moment. Please check back soon.</p>
            </div>
          ) : (
            <div className="event-grid">
              {events.map((event) => {
                const dateStr = formatEventDate(event.start_date, event.end_date);
                const timeStr = formatEventTime(event.start_time, event.end_time);

                return (
                  <div key={event.id} className="event-card">
                    <div className="event-card-image-wrap">
                      <div className={`event-status-badge ${event.status === 'LIVE' ? 'status-live' : 'status-upcoming'}`}>
                        {event.status}
                      </div>
                      {event.image_url ? (
                        <EventImage src={getImageUrl(event.image_url)} alt={event.event_name} />
                      ) : (
                        <div className="event-image-fallback" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="event-card-content">
                      <div className="event-type">{event.event_type}</div>
                      <h3 className="event-name" title={event.event_name}>{event.event_name}</h3>
                      
                      <div className="event-details">
                        {dateStr && (
                          <div className="event-detail-row">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{dateStr}</span>
                          </div>
                        )}
                        {timeStr && (
                          <div className="event-detail-row">
                            <Clock size={16} className="text-gray-400" />
                            <span>{timeStr}</span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="event-detail-row">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                        {event.capacity > 0 && (
                          <div className="event-detail-row">
                            <Users size={16} className="text-gray-400" />
                            <span>Capacity: {event.capacity}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <div className="event-description">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
