"use client";
import Link from "next/link";
import ScrollBanner from "@/components/ui/ScrollBanner";

export default function Parks() {
  return (
    <div className="page show" id="page-parks">
      <div className="hero" style={{ padding: "46px 20px" }}>
        <h2>Three Parks. One Kingdom. 👑</h2>
        <p>Your Fun Pass unlocks access to all three major attractions within VGP Universal Kingdom.</p>
      </div>
      <div className="zigzag"></div>

      <section>
        <div className="wrap">
          <div className="grid g3">
            <div className="card bg-purple">
              <div className="card-media bg-yellow">🎢</div>
              <div className="card-body">
                <h3>Amusement Park</h3>
                <p>22 thrilling rides for adults, families, and children. Highlights include the Roller Coaster, Top Gun, and the giant Ferris Wheel by the beach.</p>
                <Link href="/rides" className="pill" style={{ marginTop: "12px", display: "inline-block" }}>Explore Rides</Link>
              </div>
            </div>
            
            <div className="card bg-blue">
              <div className="card-media bg-green">🌊</div>
              <div className="card-body">
                <h3>Aqua Kingdom</h3>
                <p>11 water attractions including the Wave Pool, Tornado, River Ride, and Rain Dance. The perfect place to cool off in the Chennai heat.</p>
                <Link href="/rides" className="pill" style={{ marginTop: "12px", display: "inline-block" }}>Explore Water Park</Link>
              </div>
            </div>

            <div className="card bg-green">
              <div className="card-body" style={{ padding: "0" }}>
                <img src="/assets/img_5b25b363752a.jpg" alt="Petting Zoo" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} loading="lazy" />
              </div>
              <div className="card-body">
                <h3>Petting Zoo</h3>
                <p>Meet friendly macaws, cockatoos, emus, rabbits, and more. A gentle, engaging experience for the youngest visitors.</p>
              </div>
            </div>
          </div>
          
          <div className="panel" style={{ marginTop: "36px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Ready to explore?</h3>
            <Link href="/book" className="cta-big cta-red">Book Your Fun Pass Now ➜</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
