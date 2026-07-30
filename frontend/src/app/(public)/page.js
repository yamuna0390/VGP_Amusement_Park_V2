"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeroVideoBackground from "@/components/ui/HeroVideoBackground";
import BeachSlider from "@/components/ui/BeachSlider";

export default function Home() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <div className="hero hero-full doodle-bg" id="page-home-hero">
        {/* hero-video: YouTube BG for now — swap to /public/assets/video/hero.mp4 later via HeroVideoBackground config */}
        <div className="hero-video" id="hero-video">
          <HeroVideoBackground />
        </div>
        {/* <div className="hero-scrim"></div> */}

        {/* Bunting */}
        <svg className="deco bunting" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,8 L1200,8" stroke="#4E1261" strokeWidth="5"/>
          {[0,75,150,225,300,375,450,525,600,675,750,825,900,975,1050,1125].map((x,i)=>(
            <path key={i} d={`M${x},6 L${x+37},52 L${x+75},6 Z`}
              fill={['#FDDB00','#E93212','#C5E3DB'][i%3]}
              stroke="#4E1261" strokeWidth="3"/>
          ))}
        </svg>

        {/* Ferris wheel deco
        <svg className="deco ferris-deco" viewBox="0 0 400 400" aria-hidden="true">
          <g stroke="#FDDB00" strokeWidth="6" fill="none">
            <circle cx="200" cy="200" r="150"/>
            <circle cx="200" cy="200" r="120"/>
            <line x1="200" y1="200" x2="350" y2="200"/>
            <line x1="200" y1="200" x2="306" y2="306"/>
            <line x1="200" y1="200" x2="200" y2="350"/>
            <line x1="200" y1="200" x2="94" y2="306"/>
            <line x1="200" y1="200" x2="50" y2="200"/>
            <line x1="200" y1="200" x2="94" y2="94"/>
            <line x1="200" y1="200" x2="200" y2="50"/>
            <line x1="200" y1="200" x2="306" y2="94"/>
          </g>
          <circle cx="339" cy="256" r="16" fill="#FDDB00"/>
          <circle cx="259" cy="338" r="16" fill="#FDDB00"/>
          <circle cx="144" cy="339" r="16" fill="#FDDB00"/>
          <circle cx="62" cy="259" r="16" fill="#FDDB00"/>
          <circle cx="61" cy="144" r="16" fill="#FDDB00"/>
          <circle cx="141" cy="62" r="16" fill="#FDDB00"/>
          <circle cx="256" cy="61" r="16" fill="#FDDB00"/>
          <circle cx="338" cy="141" r="16" fill="#FDDB00"/>
          <circle cx="200" cy="200" r="18" fill="#FDDB00"/>
        </svg> */}

        {/* Balloons
        <svg className="deco balloon-deco b1" viewBox="0 0 90 130" aria-hidden="true">
          <path d="M45,6 C22,6 12,28 14,46 C16,66 32,80 45,80 C58,80 74,66 76,46 C78,28 68,6 45,6 Z" fill="#E93212" stroke="#4E1261" strokeWidth="4"/>
          <path d="M32,9 C26,30 26,60 36,78 M58,9 C64,30 64,60 54,78" stroke="#4E1261" strokeWidth="3" fill="none"/>
          <path d="M34,78 L38,96 M56,78 L52,96" stroke="#4E1261" strokeWidth="3"/>
          <rect x="34" y="96" width="22" height="18" rx="4" fill="#DBB68A" stroke="#4E1261" strokeWidth="4"/>
        </svg>
        <svg className="deco balloon-deco b2" viewBox="0 0 90 130" aria-hidden="true">
          <path d="M45,6 C22,6 12,28 14,46 C16,66 32,80 45,80 C58,80 74,66 76,46 C78,28 68,6 45,6 Z" fill="#FDDB00" stroke="#4E1261" strokeWidth="4"/>
          <path d="M32,9 C26,30 26,60 36,78 M58,9 C64,30 64,60 54,78" stroke="#4E1261" strokeWidth="3" fill="none"/>
          <path d="M34,78 L38,96 M56,78 L52,96" stroke="#4E1261" strokeWidth="3"/>
          <rect x="34" y="96" width="22" height="18" rx="4" fill="#DBB68A" stroke="#4E1261" strokeWidth="4"/>
        </svg>
        <svg className="deco balloon-deco b3" viewBox="0 0 90 130" aria-hidden="true">
          <path d="M45,6 C22,6 12,28 14,46 C16,66 32,80 45,80 C58,80 74,66 76,46 C78,28 68,6 45,6 Z" fill="#C5E3DB" stroke="#4E1261" strokeWidth="4"/>
          <path d="M32,9 C26,30 26,60 36,78 M58,9 C64,30 64,60 54,78" stroke="#4E1261" strokeWidth="3" fill="none"/>
          <path d="M34,78 L38,96 M56,78 L52,96" stroke="#4E1261" strokeWidth="3"/>
          <rect x="34" y="96" width="22" height="18" rx="4" fill="#DBB68A" stroke="#4E1261" strokeWidth="4"/>
        </svg> */}

        {/* Skyline */}
        <svg className="deco skyline" viewBox="0 0 1440 190" preserveAspectRatio="none" aria-hidden="true">
          <path fill="#4E1261" d="M0,190 L0,120 L40,120 L40,90 L60,70 L80,90 L80,120 L140,120 L140,100 L160,100 L160,120 L260,120 Q330,20 400,120 L430,120 Q470,60 510,120 L560,120 L560,95 L580,75 L600,95 L600,120 L700,120 L700,80 L720,55 L740,80 L740,120 L840,120 Q900,30 980,110 L1010,110 L1010,120 L1080,120 L1080,95 L1100,75 L1120,95 L1120,120 L1200,120 L1200,100 L1230,100 L1230,120 L1300,120 L1300,90 L1320,70 L1340,90 L1340,120 L1440,120 L1440,190 Z"/>
          <circle cx="330" cy="52" r="6" fill="#FDDB00"/>
          <circle cx="910" cy="58" r="6" fill="#FDDB00"/>
          <path d="M580,75 L580,58 L598,63 L580,68" fill="#E93212" stroke="none"/>
          <path d="M720,55 L720,36 L740,42 L720,48" fill="#E93212" stroke="none"/>
        </svg>

        {/* Doodle icons
        <span className="doodle" style={{top:'12%',left:'6%'}}>🎠</span>
        <span className="doodle" style={{top:'30%',right:'8%',display:'none'}}>🎡</span>
        <span className="doodle" style={{bottom:'22%',left:'12%'}}>🎪</span>
        <span className="doodle" style={{bottom:'30%',left:'28%'}}>🍦</span> */}

        {/* Characters */}
        <img
          className="hero-char hero-raja"
          src="/assets/img_ac7c65601668.png"
          loading="lazy"
          decoding="async"
          alt="Kutti Raja welcomes you"
        />
        <img
          className="hero-char hero-sepoy"
          src="/assets/img_79f9c0375c2d.png"
          loading="lazy"
          decoding="async"
          alt="Chutti Sepoy"
        />
{/* 
        <h1>A New Time Table!</h1>
        <div className="hero-ctas">
          <Link href="/book" className="cta-big cta-red" id="home-book-btn">Book Tickets</Link>
          <Link href="/rides" className="cta-big cta-green" id="home-rides-btn">Explore Rides</Link>
        </div> */}
      </div>

      {/* Greek border divider */}
      <div className="greek"></div>

      {/* ================= UNIQUE RIDES ================= */}
      <section style={{background:'var(--yellow)',padding:'56px 20px'}}>
        <div className="wrap">
          <div className="section-head">
            <div className="scroll-banner sb-c0">
              <span className="kicker">44 acres of fun in Chennai</span>
              <h2>Unique Rides</h2>
            </div>
          </div>

          {/* Ornament */}
          <div style={{textAlign:'center',margin:'-12px 0 28px'}}>
            <svg width="340" height="24" viewBox="0 0 340 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,12 Q42,2 85,12 T170,12 T255,12 T340,12" stroke="#B36D3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="polaroid-grid">
            <Link href="/rides" style={{textDecoration:'none'}}>
              <div className="polaroid r-l">
                <img src="/assets/img_d19d00aca574.jpg" alt="Top Gun" loading="lazy"/>
                <span className="ribbon">Power Cell </span>
                <div className="note">
                  <b>Class 01 · Spinning in the Air</b>
               This ride steals your voice ⚡
Meet Power Surge 🎢  </div>
              </div>
            </Link>
            <Link href="/rides" style={{textDecoration:'none'}}>
              <div className="polaroid r-r">
                <img src="/assets/img_03a9fee670e4.jpg" alt="Roller Coaster" loading="lazy"/>
                <span className="ribbon">Roller Coaster</span>
                <div className="note">
                  <b>Class 04 · Highs &amp; Lows</b>
                  Show them that life is full of ups and downs. Of course, in a fun way.
                </div>
              </div>
            </Link>
            <Link href="/rides" style={{textDecoration:'none'}}>
              <div className="polaroid r-l">
                <img src="/assets/img_3d441bd929f9.jpg" alt="Ferris Wheel" loading="lazy"/>
                <span className="ribbon">Ferris Wheel</span>
                <div className="note">
                  <b>Class 05 · Circles</b>
                  The old classic that no kid gets enough of. Let them swing!
                </div>
              </div>
            </Link>
            <Link href="/rides" style={{textDecoration:'none'}}>
              <div className="polaroid r-r">
                <img src="/assets/img_d4c0f73d794b.jpg" alt="London Bull" loading="lazy"/>
                <span className="ribbon">Flying Tiger</span>
                <div className="note">
                  <b>Class 08 · Flying Tiger</b>
                  The Flying Tiger is here to turn your world completely upside down
                </div>
              </div>
            </Link>
          </div>

          <img className="sword-divider" src="/assets/img_f11217d58325.png" loading="lazy" decoding="async" alt=""/>
          <p style={{textAlign:'center',marginTop:'18px'}}>
            <Link href="/rides" className="cta-big cta-red" id="see-all-rides-btn">See All Rides ➜</Link>
          </p>
        </div>
      </section>

      {/* ================= PROCLAMATION ================= */}
      <section className="procl doodle-bg" style={{padding:'52px 20px'}}>
        <div className="wrap">
          <div className="procl-board">
            <img
              className="board-img"
              src="/assets/img_3595b51803c5.png"
              loading="lazy"
              decoding="async"
              alt="Kutti Raja holding the royal proclamation board"
            />
            <div className="board-text">
              <span className="bt-inner">
                VGP Universal Kingdom now boasts a new king and new soldiers! Under the
                reign of the great <b>Kutti Raja</b>, his army of <b>Chutti Sepoys</b> ensures every guest
                is treated royally. Welcome to the New VGP Universal Kingdom —{' '}
                <i>Something New For Everyone!</i>
              </span>
            </div>
          </div>

          <h3 className="story-title">Overheard at the royal gates&hellip;</h3>

          <div className="chat">
            <div className="chat-row">
              <img className="story-king" src="/assets/img_ac7c65601668.png" alt="Kutti Raja" loading="lazy"/>
              <div className="bubble left">Chutti sepoy, treat our guest royally! <b>Akum!</b></div>
            </div>
            <div className="chat-row right">
              <div className="bubble rightb">Ay, Kutti Raja! <b>Bakum!</b></div>
              <img className="story-sepoy" src="/assets/img_79f9c0375c2d.png" alt="Chutti Sepoy" loading="lazy"/>
            </div>
            <div className="chat-row">
              <img className="story-king" src="/assets/img_ac7c65601668.png" alt="Kutti Raja" loading="lazy"/>
              <div className="bubble left">Sentence this one to a day <b>full of fun</b>, Chutti sepoy!</div>
            </div>
            <div className="chat-row right">
              <div className="bubble rightb">Ay, my Kutti Raja!</div>
              <img className="story-sepoy" src="/assets/img_79f9c0375c2d.png" alt="Chutti Sepoy" loading="lazy"/>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY / POSTCARDS ================= */}
      <section className="gallery-band doodle-bg" style={{padding:'56px 0 50px'}}>
        <div className="section-head" style={{padding:'0 20px'}}>
          <div className="scroll-banner sb-c1">
            <span className="kicker">Straight from the kingdom</span>
            <h2>Postcards of Fun</h2>
          </div>
        </div>

        {/* Ornament */}
        <div style={{textAlign:'center',margin:'-8px 0 18px'}}>
          <svg width="360" height="20" viewBox="0 0 360 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,10 Q45,2 90,10 T180,10 T270,10 T360,10" stroke="#FDDB00" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="gallery-swiper-wrap">
          <Swiper
            className="gallery-swiper"
            modules={[Autoplay, Navigation]}
            loop={true}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={true}
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              768:  { slidesPerView: 3, spaceBetween: 22 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1400: { slidesPerView: 5, spaceBetween: 24 },
            }}
          >
            <SwiperSlide><figure className="shot r-l">
              <img src="/assets/img_cc82cec5afc0.jpg" loading="lazy" decoding="async" alt="The Statue Man"/>
              <figcaption>The Statue Man</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-r">
              <img src="/assets/img_8e05ad0b70cd.jpg" loading="lazy" decoding="async" alt="Sky War on Telecombat"/>
              <figcaption>Sky War · Telecombat</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-l">
              <img src="/assets/img_0ae6e232d4fd.jpg" loading="lazy" decoding="async" alt="Balloon Racer"/>
              <figcaption>Balloon Racer</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-r">
              <img src="/assets/img_42fedc45c496.jpg" loading="lazy" decoding="async" alt="Wave Swinger"/>
              <figcaption>Wave Swinger</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-l">
              <img src="/assets/img_5b25b363752a.jpg" loading="lazy" decoding="async" alt="Petting Zoo"/>
              <figcaption>Petting Zoo</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-r">
              <img src="/assets/img_0d6ae43f1289.jpg" loading="lazy" decoding="async" alt="Circus Train"/>
              <figcaption>Circus Train</figcaption>
            </figure></SwiperSlide>
            <SwiperSlide><figure className="shot r-l">
              <img src="/assets/img_3da7a8d8bdc1.jpg" loading="lazy" decoding="async" alt="Rain Dance"/>
              <figcaption>Rain Dance</figcaption>
            </figure></SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* ================= DID YOU KNOW ================= */}
      <section className="didyouknow">
        🎬 <b>Did you know?</b>&nbsp; VGP Universal Kingdom has seen over <b>500 film &amp; TV serial shootings</b> — Bollywood, Kollywood and Tollywood have found this place a lucky charm for box-office hits!
      </section>

      {/* ================= AWARDS ================= */}
      <section style={{background:'#b11e63',padding:'56px 20px'}}>
        <div className="wrap">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            speed={4000}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              768: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="awards-carousel"
          >
            <SwiperSlide>
              <div className="award">
                <div className="medal">🏆</div>
                <h3>Best Amusement Park</h3>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="award">
                <div className="medal">🎬</div>
                <h3>500+ Film Shootings</h3>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="award">
                <div className="medal">🛡️</div>
                <h3>Safety First</h3>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="award">
                <div className="medal">🌊</div>
                <h3>Best Beach Park</h3>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section style={{background:'var(--yellow)',padding:'56px 20px'}}>
        <div className="wrap">
          <div className="section-head">
            <div className="scroll-banner sb-c0">
              <span className="kicker">&ldquo;Are we there yet?&rdquo;</span>
              <h2>Happy Visitors</h2>
            </div>
          </div>
          <div className="grid g3">
            <div className="review">
              <div className="stars">★★★★★</div>
              <p>&ldquo;One of those rare times when you won&rsquo;t say &lsquo;silence&rsquo; when the kids are shouting!&rdquo;</p>
              <div className="who">— Priya R., Chennai</div>
            </div>
            <div className="review">
              <div className="stars">★★★★★</div>
              <p>&ldquo;Took my school group of 60 kids — the Chutti Sepoys kept everyone entertained all day.&rdquo;</p>
              <div className="who">— St. Mary&rsquo;s School, Adyar</div>
            </div>
            <div className="review">
              <div className="stars">★★★★☆</div>
              <p>&ldquo;Rodeo Ride and Flying Machine were the highlights. The beach at sunset is magical.&rdquo;</p>
              <div className="who">— Arun K., Bengaluru</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BEACH SLIDER ================= */}
      <BeachSlider />
    </main>
  );
}
