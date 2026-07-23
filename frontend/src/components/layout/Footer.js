"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="ft-grid">
        <div className="ft-col">
          <h3>VGP Universal Kingdom</h3>
          <p>East Coast Road, Injambakkam,<br/>Chennai, Tamil Nadu 600115</p>
          <div className="ft-soc">
            <a href="#" aria-label="Facebook">fb</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="YouTube">yt</a>
          </div>
        </div>
        <div className="ft-col">
          <h4>Explore</h4>
          <Link href="/parks">Parks &amp; Attractions</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/restaurant">Dining</Link>
          <Link href="/stay">VGP Golden Beach Resort</Link>
          <Link href="/events">Events</Link>
        </div>
        <div className="ft-col">
          <h4>Information</h4>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms & Conditions"); }}>Terms &amp; Conditions</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }}>Privacy Policy</a>
          <Link href="/awards">Awards</Link>
        </div>
        <div className="ft-col">
          <h4>Partners</h4>
          <Link href="/group">Group Booking</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Tour Operator Login"); }}>Tour Operator Portal</a>
          <Link href="/operator/register">Partner Registration</Link>
          <p style={{marginTop: "12px", fontSize: "0.8rem", opacity: 0.7}}>VGP Universal Kingdom is a member of IAAPA.</p>
        </div>
      </div>
      <div className="ft-copy">
        &copy; {new Date().getFullYear()} VGP Universal Kingdom. All rights reserved. Prices and offers subject to change.
      </div>
    </footer>
  );
}
