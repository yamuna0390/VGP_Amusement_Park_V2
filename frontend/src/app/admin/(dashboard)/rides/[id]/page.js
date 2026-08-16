"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminRideService } from "@/services/adminRideService";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ViewRidePage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRide() {
      try {
        const data = await adminRideService.getRideById(id);
        setRide(data);
      } catch (err) {
        console.error("Failed to load ride");
      } finally {
        setLoading(false);
      }
    }
    loadRide();
  }, [id]);

  if (loading) return <div className="admin-page">Loading...</div>;
  if (!ride) return <div className="admin-page">Ride not found.</div>;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button className="btn-secondary" onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <Link href={`/admin/rides/${id}/edit`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Pencil size={16} /> Edit Ride
        </Link>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
          {ride.name} <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>({ride.slug})</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Basic Info</h3>
            <p><strong>Category:</strong> {ride.category}</p>
            <p><strong>Sub-Category:</strong> {ride.sub_category}</p>
            <p><strong>Manufacturer:</strong> {ride.manufacturer}</p>
            <p><strong>Status:</strong> {ride.status}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Ride Details</h3>
            <p><strong>Duration:</strong> {ride.duration}</p>
            <p><strong>Min Height:</strong> {ride.min_height}</p>
            <p><strong>Capacity:</strong> {ride.capacity}</p>
            <p><strong>Age Group:</strong> {ride.age_group}</p>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Description</h3>
          <p><strong>Short:</strong> {ride.short_description}</p>
          <div style={{ marginTop: '8px' }}>
            <strong>Overview:</strong> 
            <div style={{ background: '#f9f9f9', padding: '12px', marginTop: '8px', borderRadius: '4px' }}>
              {ride.overview}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Media</h3>
          {ride.card_image_url && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Card Image:</strong><br/>
              <img src={ride.card_image_url} alt={ride.name} style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '4px' }} />
            </div>
          )}
          <p><strong>Hero Type:</strong> {ride.hero_type}</p>
          <p><strong>Hero Image:</strong> {ride.hero_image_url}</p>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Gallery</h3>
          {ride.gallery && ride.gallery.length > 0 ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {ride.gallery.map(g => (
                <img key={g.id} src={g.image_url} alt="Gallery" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>No gallery images.</p>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Safety Rules</h3>
          {ride.safety_rules && ride.safety_rules.length > 0 ? (
            <ul style={{ paddingLeft: '20px' }}>
              {ride.safety_rules.map(s => (
                <li key={s.id} style={{ marginBottom: '8px' }}>{s.rule_text}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#888' }}>No safety rules.</p>
          )}
        </div>

      </div>
    </div>
  );
}
