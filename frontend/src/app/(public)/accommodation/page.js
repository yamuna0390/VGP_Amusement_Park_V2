"use client";

import Link from "next/link";
import { BedDouble, Wifi, Car, Users, Phone, MapPin, Coffee, ShieldCheck } from "lucide-react";

export default function AccommodationPage() {
  return (
    <div className="page show" style={{ backgroundColor: "#FAFAFA" }}>
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        height: '60vh', 
        minHeight: '450px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("/assets/acco_room.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#FDDB00', marginBottom: '16px', display: 'block' }}>STAY AT VGP</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Accommodation</h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '500', color: '#f8f9fa', margin: 0 }}>
            Step into comfort and relaxation during your visit to the Kingdom.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ padding: '60px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 2. INTRODUCTION & VISUAL */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="/assets/room2.png" 
              alt="VGP Resort Environment" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover', aspectRatio: '4/3' }} 
            />
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', color: '#e11d48', marginBottom: '12px', display: 'block' }}>RELAX & RECHARGE</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '900', color: '#1E293B', marginBottom: '24px', lineHeight: '1.2' }}>A Comfortable Stay for Your Visit</h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', marginBottom: '16px', fontWeight: '500' }}>
              Make your visit more convenient with a comfortable place to relax before or after your day at VGP. Our accommodation options are designed to provide a seamless and enjoyable experience for families, couples, and groups.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', fontWeight: '500' }}>
              Enjoy the beautiful surroundings and stay close to the action.
            </p>
          </div>
        </section>

        {/* 3. FACILITIES & FEATURES */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>Facilities & Features</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fefce8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <BedDouble color="#ca8a04" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Comfortable Rooms</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Clean and cozy spaces for a restful night.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Wifi color="#3b82f6" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Wi-Fi Access</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Stay connected during your visit.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fdf4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Car color="#c026d3" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Parking</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Convenient parking for your vehicles.</p>
            </div>

            <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Users color="#e11d48" size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Family Friendly</h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>Safe and accommodating for families of all sizes.</p>
            </div>

          </div>
        </section>

        {/* 4. FINAL CTA */}
        <section style={{ 
          background: 'linear-gradient(135deg, #ed3212 0%, #be123c 100%)', 
          borderRadius: '24px', 
          padding: '60px 20px', 
          color: '#fff', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(225, 29, 72, 0.2)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '900', marginBottom: '16px', color: '#fff' }}>Plan Your Stay</h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffe4e6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Looking for accommodation during your VGP visit? Contact our team directly to check availability and make a booking.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+918939700588" style={{ padding: '14px 32px', backgroundColor: '#FDDB00', color: '#1E293B', fontWeight: '900', borderRadius: '50px', textDecoration: 'none', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(253, 219, 0, 0.4)' }}>
              Call to Enquire
            </a>
            <a href="tel:+918939700588" style={{ padding: '14px 32px', backgroundColor: 'transparent', color: '#fff', fontWeight: '800', borderRadius: '50px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={20} />
              +91 89397 00588
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
