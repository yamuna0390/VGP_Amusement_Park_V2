"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Info, Loader2 } from "lucide-react";
import "@/components/Offers/offers-page.css";
import { fetchOffers } from "@/services/offerApi";
import { getImageUrl } from "@/constants/api";

const BG_HEX = {
  "bg-mint": "#D8F5EF",
  "bg-lavender": "#EAE2F8",
  "bg-sky": "#D5EEFF",
  "bg-cream": "#FFF8EC",
  "bg-peach": "#FFE8DC",
  "bg-softyellow": "#FFF6D0",
};

const bgKeys = Object.keys(BG_HEX);

/*
|--------------------------------------------------------------------------
| GET OFFER IMAGE
|--------------------------------------------------------------------------
*/

function getOfferImage(offer) {
  if (offer?.image_url) {
    return getImageUrl(offer.image_url);
  }

  return "/images/sampleVGP.jpg";
}

/*
|--------------------------------------------------------------------------
| DATE FORMAT
|--------------------------------------------------------------------------
*/

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| BUY X GET Y GROUPING
|--------------------------------------------------------------------------
*/

function groupBuyXGetY(offerTickets) {
  if (!offerTickets || offerTickets.length === 0) {
    return [];
  }

  const groups = {};

  offerTickets.forEach((tk) => {
    const minQty = tk.buyQuantity;
    const freeQty = tk.freeQuantity;
    
    // Ignore invalid entries
    if (minQty === undefined || minQty === null) return;

    const key = `${minQty}-${freeQty}`;

    if (!groups[key]) {
      groups[key] = {
        min: minQty,
        free: freeQty || 0,
        tickets: [],
      };
    }

    if (tk.displayName) {
      groups[key].tickets.push(tk.displayName);
    }
  });

  return Object.values(groups).map((g) => ({
    mainText: `Buy ${g.min} → Get ${g.free} Free`,
    subText: `Applicable to: ${[...new Set(g.tickets)].join(", ")}`,
  }));
}

/*
|--------------------------------------------------------------------------
| BADGE
|--------------------------------------------------------------------------
*/

function generateBadge(offer) {
  if (Number(offer.offer_type_id) === 1 && offer.discount_percentage) {
    const val = Number(offer.discount_percentage);
    return `${val}% OFF`;
  }

  if (Number(offer.offer_type_id) === 2 && offer.flat_discount) {
    const val = Number(offer.flat_discount);
    return `₹${val} OFF`;
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| OFFERS PAGE
|--------------------------------------------------------------------------
*/

export default function Offers() {
  const router = useRouter();

  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD OFFERS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOffers();

        setOffersData(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Failed to load offers:",
          err
        );

        setError(
          "Offers are temporarily unavailable. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="page show"
      id="page-offers"
    >

      {/* ================================================================
          HERO
      ================================================================= */}

      <div
        className="hero"
        style={{ padding: "46px 20px" }}
      >
        <h2>
          Special Offers &amp; Exclusive Deals
        </h2>

        <p>
          Enjoy amazing savings on your next visit
          to VGP Universal Kingdom. Limited-time
          offers, student discounts, birthday
          specials, family deals, and more.
        </p>

        <div
          className="offers-notice-pill"
          style={{ marginTop: "18px" }}
        >
          <div className="notice-icon-circle">
            <Info
              size={16}
              color="#ffffff"
            />
          </div>

          <span>
            All Offers are Valid Only on Online
            Bookings
          </span>
        </div>
      </div>

      <div className="zigzag"></div>

      {/* ================================================================
          OFFER CARDS
      ================================================================= */}

      <section>
        <div className="wrap">

          {loading ? (

            /* ============================================================
               LOADING
            ============================================================ */

            <div
              className="empty-offers-box"
              style={{
                padding: "60px 20px",
              }}
            >
              <Loader2
                className="spinner"
                size={40}
                color="#5A257F"
                style={{
                  margin: "0 auto",
                  animation:
                    "spin 1s linear infinite",
                }}
              />

              <p
                style={{
                  marginTop: "16px",
                  color: "#666",
                }}
              >
                Loading amazing offers...
              </p>
            </div>

          ) : error ? (

            /* ============================================================
               ERROR
            ============================================================ */

            <div className="empty-offers-box">
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "12px",
                  color: "red",
                }}
              >
                ⚠️
              </div>

              <h3 className="empty-offers-title">
                Oops!
              </h3>

              <p className="empty-offers-desc">
                {error}
              </p>
            </div>

          ) : offersData.length > 0 ? (

            /* ============================================================
               GRID
            ============================================================ */

            <div className="grid ride-grid">

              {offersData.map((offer, idx) => {

                /*
                |--------------------------------------------------------------------------
                | CARD BACKGROUND
                |--------------------------------------------------------------------------
                |
                | Background can still depend on card position.
                | This is purely visual and does NOT affect the offer image.
                |--------------------------------------------------------------------------
                */

                const bgClass =
                  bgKeys[idx % bgKeys.length];

                const cardBg =
                  BG_HEX[bgClass];

                /*
                |--------------------------------------------------------------------------
                | BADGE
                |--------------------------------------------------------------------------
                */

                const badgeText =
                  generateBadge(offer);

                /*
                |--------------------------------------------------------------------------
                | CORRECT IMAGE
                |--------------------------------------------------------------------------
                |
                | THIS IS THE IMPORTANT FIX.
                |
                | Before:
                |
                | fallbackImages[idx]
                |
                | Now:
                |
                | getOfferImage(offer)
                |--------------------------------------------------------------------------
                */

                const displayImg =
                  getOfferImage(offer);

                return (
                  <div
                    key={
                      offer.id ||
                      offer.offer_code ||
                      idx
                    }
                    className={`card ride-card ${bgClass}`}
                    style={{
                      "--ride-body-bg":
                        cardBg,
                    }}
                  >

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div
                      className="card-media ride-media"
                      aria-label={`Apply ${offer.offer_name}`}
                    >
                      <Image
                        src={displayImg}
                        alt={
                          offer.offer_name ||
                          "Special offer"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="ride-photo"
                        loading="lazy"
                      />

                      {badgeText && (
                        <span className="ride-badge">
                          {badgeText}
                        </span>
                      )}
                    </div>

                    {/* ==================================================
                        WAVE
                    ================================================== */}

                    <div
                      className="ride-wave"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 400 40"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M0,40 L0,18 Q100,0 200,20 Q300,40 400,18 L400,40 Z"
                          fill={cardBg}
                        />
                      </svg>
                    </div>

                    {/* ==================================================
                        CARD BODY
                    ================================================== */}

                    <div
                      className="card-body ride-body"
                      style={{
                        color: "#222",
                      }}
                    >

                      <h3
                        className="ride-name"
                        style={{
                          marginBottom: "8px",
                        }}
                      >
                        {offer.offer_name}
                      </h3>

                      {/* ==================================================
                          BUY X GET Y
                      ================================================== */}

                      {Number(offer.offer_type_id) ===
                        3 && (
                        <div
                          style={{
                            marginBottom:
                              "12px",
                          }}
                        >
                          {groupBuyXGetY(
                            offer.offer_tickets
                          ).map(
                            (
                              rule,
                              rIdx
                            ) => (
                              <div
                                key={rIdx}
                                style={{
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                <strong
                                  style={{
                                    display:
                                      "block",
                                    fontSize:
                                      "1.1rem",
                                  }}
                                >
                                  {
                                    rule.mainText
                                  }
                                </strong>

                                <span
                                  style={{
                                    fontSize:
                                      "0.85rem",
                                    opacity:
                                      0.8,
                                  }}
                                >
                                  {
                                    rule.subText
                                  }
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* ==================================================
                          DESCRIPTION
                      ================================================== */}

                      {offer.description && (
                        <p
                          className="ride-desc"
                          style={{
                            marginBottom:
                              "12px",
                            fontWeight:
                              "500",
                            color: "#333",
                          }}
                        >
                          {
                            offer.description
                          }
                        </p>
                      )}

                      {/* ==================================================
                          INSTRUCTION
                      ================================================== */}

                      {offer.instruction && (
                        <div
                          style={{
                            marginTop:
                              "12px",
                            padding: "10px",
                            backgroundColor:
                              "rgba(255,255,255,0.5)",
                            borderRadius:
                              "6px",
                          }}
                        >
                          <strong
                            style={{
                              display:
                                "block",
                              fontSize:
                                "0.85rem",
                              marginBottom:
                                "4px",
                            }}
                          >
                            Instructions:
                          </strong>

                          <p
                            style={{
                              fontSize:
                                "0.85rem",
                              margin: 0,
                            }}
                          >
                            {
                              offer.instruction
                            }
                          </p>
                        </div>
                      )}

                      {/* ==================================================
                          FOOTER
                      ================================================== */}

                      <div className="public-offer-footer-action">

                        <p
                          className="ride-mfr"
                          style={{
                            fontWeight: "600",
                            margin: 0,
                          }}
                        >
                          {offer.valid_from &&
                          offer.valid_to
                            ? `Valid: ${formatDate(
                                offer.valid_from
                              )} – ${formatDate(
                                offer.valid_to
                              )}`
                            : "Apply Online"}
                        </p>

                        <button
                          type="button"
                          className="public-offer-arrow"
                          aria-label={`Select ${offer.offer_name}`}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!offer?.id) {
                              console.error(
                                "Cannot navigate to booking: offer ID missing"
                              );
                              return;
                            }

                            router.push(
                              `/book?offerId=${encodeURIComponent(
                                offer.id
                              )}`
                            );
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

          ) : (

            /* ============================================================
               EMPTY
            ============================================================ */

            <div className="empty-offers-box">

              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "12px",
                }}
              >
                🎟️
              </div>

              <h3 className="empty-offers-title">
                No offers available
              </h3>

              <p className="empty-offers-desc">
                There are currently no active
                deals. Check back soon or
                explore all current park tickets.
              </p>

            </div>
          )}

          {/* ==============================================================
              PROMOTIONAL BANNER
          ============================================================== */}

          <div className="promo-banner-card">
            <div>

              <span className="promo-banner-sub">
                🎉 Limited Time Offers
              </span>

              <h3 className="promo-banner-title">
                Save More This Season
              </h3>

              <p className="promo-banner-desc">
                Exclusive online discounts are
                automatically applied when you
                pre-book your park passes.
              </p>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}