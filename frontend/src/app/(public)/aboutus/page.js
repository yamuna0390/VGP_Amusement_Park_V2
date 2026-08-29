"use client";

import Link from 'next/link';
import { Anchor, Droplets, Users, Umbrella, Snowflake, HeartHandshake, User } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="page show" style={{ backgroundColor: "#FAFAFA" }}>
      
      {/* 2. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        height: '60vh', 
        minHeight: '450px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("/images/rides/ferriswheel.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#FDDB00', marginBottom: '16px', display: 'block' }}>ABOUT VGP UNIVERSAL KINGDOM</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Where Every Day Becomes an Adventure</h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '500', marginBottom: '32px', color: '#f8f9fa' }}>
            Step into a world of thrilling rides, family fun, water adventures and unforgettable moments at VGP Universal Kingdom.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#experiences" style={{ padding: '14px 28px', backgroundColor: '#fff', color: '#1E293B', fontWeight: '800', borderRadius: '50px', textDecoration: 'none' }}>
              Explore the Kingdom
            </Link>
            <Link href="/book" style={{ padding: '14px 28px', backgroundColor: '#e11d48', color: '#fff', fontWeight: '800', borderRadius: '50px', textDecoration: 'none' }}>
              Book Your Tickets
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ padding: '60px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 3. OUR STORY SECTION */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="/images/groupbanner.png" 
              alt="VGP Universal Kingdom Park" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover', aspectRatio: '4/3' }} 
            />
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', color: '#e11d48', marginBottom: '12px', display: 'block' }}>OUR STORY</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '900', color: '#1E293B', marginBottom: '24px', lineHeight: '1.2' }}>A Kingdom Built on Fun</h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', marginBottom: '16px', fontWeight: '500' }}>
              VGP&apos;s journey began in 1975 with a vision to create a place where families could relax, play and celebrate together. What began as VGP Golden Beach grew into a larger entertainment destination, drawing inspiration from theme parks around the world.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', fontWeight: '500' }}>
              In 1997, the park became VGP Universal Kingdom, continuing its journey as a destination for families, friends and adventure seekers.
            </p>
          </div>
        </section>
 {/* 5. VGP HIGHLIGHTS */}
       <section
  style={{
    background: 'linear-gradient(135deg, #5a257f 0%, #0F172A 100%)',
    borderRadius: '24px',
    padding: '50px 32px',
    color: '#fff',
    marginBottom: '80px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box'
  }}
>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '30px',
      textAlign: 'center',
      width: '100%'
    }}
  >
    <div
      style={{
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2rem, 3vw, 3rem)',
          lineHeight: '1.05',
          fontWeight: '900',
          color: '#FDDB00',
          marginBottom: '12px',
          overflowWrap: 'break-word',
          wordBreak: 'normal'
        }}
      >
        45 ACRES
      </div>

      <div
        style={{
          fontSize: '1rem',
          lineHeight: '1.4',
          fontWeight: '600',
          color: '#cbd5e1'
        }}
      >
        Lush entertainment destination
      </div>
    </div>

    <div
      style={{
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2rem, 3vw, 3rem)',
          lineHeight: '1.05',
          fontWeight: '900',
          color: '#38bdf8',
          marginBottom: '12px',
          overflowWrap: 'break-word',
          wordBreak: 'normal'
        }}
      >
        BAY OF BENGAL
      </div>

      <div
        style={{
          fontSize: '1rem',
          lineHeight: '1.4',
          fontWeight: '600',
          color: '#cbd5e1'
        }}
      >
        Seaside setting
      </div>
    </div>

    <div
      style={{
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2rem, 3vw, 3rem)',
          lineHeight: '1.05',
          fontWeight: '900',
          color: '#fb923c',
          marginBottom: '12px',
          overflowWrap: 'break-word',
          wordBreak: 'normal'
        }}
      >
        45+ RIDES
      </div>

      <div
        style={{
          fontSize: '1rem',
          lineHeight: '1.4',
          fontWeight: '600',
          color: '#cbd5e1'
        }}
      >
        Action-packed experiences
      </div>
    </div>

    <div
      style={{
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          fontSize: 'clamp(1.8rem, 2.7vw, 3rem)',
          lineHeight: '1.05',
          fontWeight: '900',
          color: '#a78bfa',
          marginBottom: '12px',
          overflowWrap: 'break-word',
          wordBreak: 'normal'
        }}
      >
        WATER EXPERIENCES
      </div>

      <div
        style={{
          fontSize: '1rem',
          lineHeight: '1.4',
          fontWeight: '600',
          color: '#cbd5e1'
        }}
      >
        Slides, pools and aquatic fun
      </div>
    </div>
  </div>
</section>
        {/* 4. A WORLD OF EXPERIENCES */}
        <section id="experiences" style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>A World of Experiences</h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '500' }}>
            From high-energy rides to refreshing water adventures and relaxing moments by the sea, there is something for every kind of visitor.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Anchor color="#e11d48" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Thrilling Rides</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Feel the excitement with rides created for thrill seekers and adventure lovers.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Droplets color="#3b82f6" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Aqua Adventures</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Make a splash with water attractions, slides and refreshing aquatic experiences.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fdf4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Users color="#c026d3" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Family Fun</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Enjoy memorable experiences designed to bring families and friends together.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fefce8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Umbrella color="#ca8a04" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Beach &amp; Beyond</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Relax by the Bay of Bengal and enjoy the unique combination of entertainment and seaside experiences.</p>
            </div>

          </div>
        </section>

       

        {/* 6. SIGNATURE EXPERIENCES */}
        {/* <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '900', color: '#1E293B', marginBottom: '40px', textAlign: 'center' }}>More Than Just Rides</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <img src="/images/vgp-cyber-kingdom.jpg" alt="Snow Kingdom" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Snowflake color="#0ea5e9" size={24} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Snow Kingdom</h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>Step into a cool world of snow-filled fun.</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <img src="/images/vgrides/Kids Play zone.png" alt="Petting Zoo" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <HeartHandshake color="#f43f5e" size={24} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Petting Zoo</h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>Discover a playful experience where visitors can observe and learn about animals.</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <img src="/images/final_sepoy.png" alt="Statue Man" style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#f8fafc' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <User color="#8b5cf6" size={24} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Statue Man</h3>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>Meet one of the park&apos;s iconic attractions.</p>
              </div>
            </div>

          </div>
        </section> */}

        {/* 7. FINAL CTA */}
        <section style={{ 
          background: 'linear-gradient(135deg, #ed3212 0%, #be123c 100%)', 
          borderRadius: '24px', 
          padding: '60px 20px', 
          color: '#fff', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(225, 29, 72, 0.2)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '900', marginBottom: '16px', color: '#fff' }}>Your Adventure Starts Here</h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffe4e6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Bring your family and friends and create memories worth coming back for.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" style={{ padding: '14px 32px', backgroundColor: '#FDDB00', color: '#1E293B', fontWeight: '900', borderRadius: '50px', textDecoration: 'none', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(253, 219, 0, 0.4)' }}>
              Book Your Tickets
            </Link>
            <Link href="/offers" style={{ padding: '14px 32px', backgroundColor: 'transparent', color: '#fff', fontWeight: '800', borderRadius: '50px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', fontSize: '1.1rem' }}>
              Explore Offers
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
