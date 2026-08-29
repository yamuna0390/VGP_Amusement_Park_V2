"use client";

import Link from 'next/link';
import { Trophy, Medal, Star, Award } from 'lucide-react';

export default function AwardsPage() {
  return (
    <div className="page show" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        height: '40vh', 
        minHeight: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(42, 16, 61, 0.75), rgba(74, 33, 107, 0.85)), url("/images/bg5.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '0 20px',
        borderBottom: '4px solid #FDDB00'
      }}>
        <div style={{ maxWidth: '700px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: '1.2', marginBottom: '16px', textShadow: '0 4px 15px rgba(0,0,0,0.4)', color: '#FDDB00' }}>
            Awards &amp; Recognition
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', fontWeight: '500', margin: '0 auto', color: '#E2D6EE', lineHeight: '1.6' }}>
            Celebrating the recognition that inspires us to create better experiences, bigger smiles, and unforgettable memories.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ padding: '60px 16px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* 2. INTRODUCTION */}
        <section style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: '900', color: '#1E293B', marginBottom: '24px', lineHeight: '1.3' }}>
            Recognised for Creating Memorable Experiences
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', marginBottom: '16px', fontWeight: '500' }}>
            VGP Universal Kingdom has built a strong reputation as a destination for family entertainment, adventure and leisure. Over the years, the park has received recognition from government and industry bodies for its commitment to excellence and service.
          </p>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', fontWeight: '500' }}>
            While our greatest reward is the joy of our visitors, these commendations fuel our passion to constantly innovate and elevate the standard of amusement parks in India.
          </p>
        </section>

        {/* 3. AWARDS / RECOGNITION CARDS */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            
            {/* Card 1 */}
            <div style={{ background: '#fff', padding: '36px 24px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#fdf4ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Trophy color="#c026d3" size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Industry Recognition</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
                Recognition for excellence in the leisure and entertainment sector.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ background: '#fff', padding: '36px 24px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Star color="#3b82f6" size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Service Excellence</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
                Recognition reflecting VGP&apos;s commitment to guest experience and service.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ background: '#fff', padding: '36px 24px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award color="#e11d48" size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Entertainment &amp; Family Experience</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
                Recognition associated with creating memorable experiences for families and visitors.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{ background: '#fff', padding: '36px 24px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#fefce8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Medal color="#ca8a04" size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Park Excellence</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
                Recognition reflecting the park&apos;s continued development and contribution to leisure and tourism.
              </p>
            </div>

          </div>
        </section>

        {/* 4. CLOSING SECTION */}
        <section style={{ 
          background: 'linear-gradient(135deg, #4A216B 0%, #2A103D 100%)', 
          borderRadius: '24px', 
          padding: '60px 24px', 
          color: '#fff', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(74, 33, 107, 0.2)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '16px', color: '#FDDB00' }}>
            Every Award Inspires the Next Adventure
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#E2D6EE', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Our greatest recognition is seeing families return with smiles, stories and memories worth sharing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/book" style={{ padding: '16px 36px', backgroundColor: '#FDDB00', color: '#2A103D', fontWeight: '900', borderRadius: '50px', textDecoration: 'none', fontSize: '1.1rem', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(253, 219, 0, 0.3)', transition: 'transform 0.2s' }}>
              BOOK YOUR VISIT
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
