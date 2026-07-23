export default function Ticker() {
  const announcements = [
    "🎉 A NEW TIME TABLE — Something New For Everyone!",
    "🕘 Open Daily from 9:30 AM",
    "📍 East Coast Road, Injambakkam, Chennai",
    "🎟️ ONLINE EXCLUSIVE: Get 15% OFF all tickets! Book now and skip the queues.",
    "🎂 Celebrate your Birthday Month with our Buddy Treat offer!",
    "👑 Little Legends Saturdays: Kids below 130cm go FREE with every Adult ticket!",
    "🌊 Beat the heat at Aqua Kingdom — 11 thrilling water attractions!",
    "🎢 22 rides + Water Park + Pet Zoo — one Fun Pass covers it all!",
  ];

  // Duplicate items so the scroll loops seamlessly
  const items = [...announcements, ...announcements];

  return (
    <div className="ticker-wrap" aria-label="Important announcements" role="marquee">
      <div className="ticker-track">
        {items.map((text, i) => (
          <span key={i} className="ticker-item">
            {text}
            <span className="ticker-sep" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
