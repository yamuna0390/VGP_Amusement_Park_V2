"use client";
import Link from "next/link";
import ScrollBanner from "@/components/ui/ScrollBanner";
import Polaroid from "@/components/ui/Polaroid";
import RestaurantGallerySlider from "@/components/ui/RestaurantGallerySlider";

export default function Restaurant() {
  return (
    <div className="page show" id="page-restaurant">
      <section style={{ background: "#fff" }}>
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Royal Kitchen" subtitle="Lunch break, kingdom style" colorClass="sb-ribbon" />
          </div>
          <p className="rk-intro">
            <b>Kutti Raja's Royal Kitchen</b> is a multi-cuisine family restaurant inside the park — South-Indian thalis, chaats, pizzas, biryani, ice-creams and more. Pre-book a meal package with your tickets and skip the queue.
          </p>
          <div className="meal-grid rk-menu">
            <div className="meal-card"><div className="meal-emoji bg-green">🥗</div><span className="veg-dot">● Veg</span><h4>Veg Meal</h4><p>South-Indian thali — rice, curries, poriyal & sweet.</p><div className="meal-foot"><b>₹150</b></div></div>
            <div className="meal-card"><div className="meal-emoji bg-red">🍗</div><span className="nonveg-dot">● Non-veg</span><h4>Non-veg Meal</h4><p>Chicken curry, flavoured rice & dessert.</p><div className="meal-foot"><b>₹200</b></div></div>
            <div className="meal-card"><div className="meal-emoji bg-blue">🧒</div><span className="meal-tag">Kid-friendly</span><h4>Kids Happy Meal</h4><p>Mini meal + a treat & a surprise.</p><div className="meal-foot"><b>₹199</b></div></div>
            <div className="meal-card"><div className="meal-emoji bg-purple">🍿</div><span className="meal-tag">Snacks</span><h4>Snack & Beverage Pack</h4><p>Popcorn/fries + a chilled drink.</p><div className="meal-foot"><b>₹149</b></div></div>
            <div className="meal-card"><div className="meal-emoji bg-blue">🍕</div><span className="meal-tag">Live</span><h4>Live Counters</h4><p>Pizza · Chaat · Ice-cream · Coffee — pay at the park.</p><div className="meal-foot"><b>à la carte</b></div></div>
          </div>
          <p style={{ textAlign: "center", marginTop: "22px" }}>
            <Link href="/book" className="cta-big cta-red">🍽️ Add Meal Packages While Booking ➜</Link>
          </p>
        </div>
      </section>

      <section className="stall-band">
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Snack Street" subtitle="Follow the royal signposts" />
          </div>
          <img className="stalls-img" src="/assets/img_484d44fafa7d.png" loading="lazy" decoding="async" alt="Popcorn, tea & coffee, cold drinks, ice cream and quick snacks signposts" />
          <p style={{ textAlign: "center", fontWeight: 800, color: "var(--purple)", marginTop: "14px" }}>
            Popcorn · Tea & Coffee · Cold Drinks · Ice Cream · Quick Snacks — the signposts lead the way!
          </p>
        </div>
      </section>

      <section className="seathru">
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Sea Thru Diner" subtitle="Dine by the sea — where every meal comes with a view" colorClass="sb-scroll" />
          </div>
          <div className="st-top">
            <div className="logo-chip st-logo"><img src="https://vgpseathrudiner.in/wp-content/uploads/2024/07/logo-seathru.png" alt="VGP Sea Thru Diner logo" loading="lazy" /></div>
            <div className="st-info">
              <p>Beachside multicuisine diner nestled <b>inside VGP Universal Kingdom</b> — gourmet cuisine, live music and the Bay of Bengal as your table view. <b>Restaurant Guru Recommended 2026</b> · 🐾 Pet friendly · Free parking inside the park.</p>
              <div className="st-chips">
                <span>🌙 Full Moon Candlelight Dinner</span>
                <span>✨ Dine Under The Stars</span>
                <span>🦞 Beach Food Festival</span>
                <span>💑 Private Candlelight Dinner</span>
                <span>🎉 Group Celebrations</span>
              </div>
              <div className="land-cta">
                <a className="site-link" href="https://vgpseathrudiner.in/" target="_blank" rel="noopener noreferrer">Official Website ➜</a>
                <a className="site-link" style={{ background: "var(--red)", color: "#fff", boxShadow: "0 3px 0 var(--red-dark)" }} href="tel:+917358227778">📞 +91 73582 27778</a>
              </div>
            </div>
          </div>
          <RestaurantGallerySlider />
          <p style={{ textAlign: "center", fontWeight: 800, color: "var(--purple)", marginTop: "8px" }}>
            ⭐ Must try: Coin Parotta · Thai Green Curry · BBQ Fish · Grilled Chicken
          </p>
        </div>
      </section>
    </div>
  );
}
