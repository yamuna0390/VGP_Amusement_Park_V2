import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight } from "lucide-react";
import "./BottomCTA.css";

export default function BottomCTA({ rideName }) {
  const name = rideName || "Castle Jet";

  return (
    <section className="bottom-cta-section">
      <div className="bottom-cta-wrap">
        <div className="bottom-cta-card">
          
          {/* Left Text */}
          <div className="bottom-cta-left">
            <h2 className="bottom-cta-title">
              Can&apos;t wait to ride {name}?
            </h2>
            <p className="bottom-cta-desc">
              Book your park tickets online now to skip the entry queue and enjoy instant access to all attractions!
            </p>
          </div>

          {/* Right Action */}
          <div className="bottom-cta-right">
            <Link href="/booking" className="bottom-cta-yellow-btn">
              <Ticket size={20} />
              <span>Book Tickets</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
