"use client";
import Link from "next/link";
import "./restaurant.css";
import ScrollBanner from "@/components/ui/ScrollBanner";
import Polaroid from "@/components/ui/Polaroid";
import RestaurantGallerySlider from "@/components/ui/RestaurantGallerySlider";

export default function Restaurant() {
  const restaurantMeals = [
    {
      id: "veg",
      name: "Veg Meal",
      type: "veg",
      description: "South-Indian thali — rice, curries, poriyal & sweet.",
      price: "₹150",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
      tag: "● Veg",
      tagClass: "veg-dot"
    },
    {
      id: "nonveg",
      name: "Non-veg Meal",
      type: "nonveg",
      description: "Chicken curry, flavoured rice & dessert.",
      price: "₹200",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      tag: "● Non-veg",
      tagClass: "nonveg-dot"
    },
    {
      id: "kids",
      name: "Kids Happy Meal",
      type: "veg",
      description: "Mini meal + a treat & a surprise.",
      price: "₹199",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      tag: "Kid-friendly",
      tagClass: "meal-tag"
    },
    {
      id: "snacks",
      name: "Snack & Beverage Pack",
      type: "veg",
      description: "Popcorn/fries + a chilled drink.",
      price: "₹149",
      image: "/images/snacks.png",
      tag: "Snacks",
      tagClass: "meal-tag"
    },
    {
      id: "live",
      name: "Live Counters",
      type: "veg",
      description: "Pizza · Chaat · Ice-cream · Coffee — pay at the park.",
      price: "à la carte",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      tag: "Live",
      tagClass: "meal-tag"
    }
  ];

  return (
    <div className="page show" id="page-restaurant">
      <section style={{ background: "#fff", paddingBottom: "50px" }}>
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Royal Kitchen" subtitle="Lunch break, kingdom style" colorClass="sb-ribbon" />
          </div>
          <p className="rk-intro">
            <b>Kutti Raja&apos;s Royal Kitchen</b> is a multi-cuisine family restaurant inside the park — South-Indian thalis, chaats, pizzas, biryani, ice-creams and more. Pre-book a meal package with your tickets and skip the queue.
          </p>

          <div className="meal-grid rk-menu restaurant-menu-grid">
            {restaurantMeals.map((meal) => (
              <div
                key={meal.id}
                className="meal-card"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ width: "100%", height: "135px", overflow: "hidden", position: "relative", background: "#1E293B" }}>
                    <img
                      src={meal.image}
                      alt={meal.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="eager"
                    />
                  </div>
                  <div style={{ padding: "14px 14px 8px" }}>
                    <span className={meal.tagClass} style={{ fontSize: "0.78rem", fontWeight: "800", marginBottom: "6px", display: "inline-block" }}>
                      {meal.tag}
                    </span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1E293B", margin: "4px 0 6px 0" }}>
                      {meal.name}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "600", lineHeight: "1.4", margin: 0 }}>
                      {meal.description}
                    </p>
                  </div>
                </div>

                <div className="meal-foot" style={{ padding: "10px 14px 14px" }}>
                  <b style={{ fontSize: "1.1rem", color: "#B11E63", fontWeight: "900" }}>{meal.price}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stall-band">
        <div className="wrap">
          <div className="section-head">
            <ScrollBanner title="Snack Street" subtitle="Follow the royal signposts" />
          </div>
          <img className="stalls-img" src="/assets/img_484d44fafa7d.png" loading="lazy" decoding="async" alt="Popcorn, tea & coffee, cold drinks, ice cream and quick snacks signposts" />
          <p style={{ textAlign: "center", fontWeight: 800, color: "var(--purple)", marginTop: "14px" }}>
            Popcorn · Tea &amp; Coffee · Cold Drinks · Ice Cream · Quick Snacks — the signposts lead the way!
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
