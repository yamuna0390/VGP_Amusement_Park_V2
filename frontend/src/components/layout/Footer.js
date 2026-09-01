"use client";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="ft-grid">
        <div className="ft-col">
          <h3>VGP Universal Kingdom</h3>
          <p>East Coast Road, Injambakkam,<br/>Chennai, Tamil Nadu 600115</p>
          <div className="ft-soc">
            <a href="https://www.facebook.com/vgpuniversalkingdom/" aria-label="Visit VGP Universal Kingdom on Facebook" target="_blank" rel="noopener noreferrer" title="VGP Universal Kingdom Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/vgp_universal_kingdom/?hl=en" aria-label="Visit VGP Universal Kingdom on Instagram" target="_blank" rel="noopener noreferrer" title="VGP Universal Kingdom Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/@vgpuniversalkingdom6708" aria-label="Visit VGP Universal Kingdom on YouTube" target="_blank" rel="noopener noreferrer" title="VGP Universal Kingdom YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className="ft-col">
          <h4>Explore</h4>
          <Link href="/parks">Parks &amp; Attractions</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/restaurant">Dining</Link>
          <Link href="/stay">Seathru</Link>
          <Link href="/events">Events</Link>
        </div>
        <div className="ft-col">
          <h4>Information</h4>
          <Link href="/aboutus">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/awards">Awards</Link>
        </div>
        <div className="ft-col">
          <h4>Partners</h4>
          <Link href="/operator">Tour Operator Portal</Link>
          <Link href="/operator?tab=register">Partner Registration</Link>
          <p style={{marginTop: "12px", fontSize: "0.8rem", opacity: 0.7}}>VGP Universal Kingdom is a member of IAAPA.</p>
        </div>
      </div>
      <div className="ft-copy" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
        <span>&copy; {new Date().getFullYear()} VGP Universal Kingdom. All rights reserved. Prices and offers subject to change.</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="back-to-top-icon">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
      </div>
    </footer>
  );
}
