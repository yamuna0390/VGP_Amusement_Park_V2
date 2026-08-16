"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminOfferService } from "@/services/adminOfferService";
import OfferForm from "@/components/admin/Offers/OfferForm";

export default function EditOfferPage() {
  const params = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffer() {
      try {
        const data = await adminOfferService.getOfferById(params.id);
        setOffer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffer();
  }, [params.id]);

  if (loading) {
    return <div className="admin-page"><p style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold' }}>Loading offer data...</p></div>;
  }

  if (error) {
    return (
      <div className="admin-page">
        <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-secondary" onClick={() => router.push('/admin/offers')}>Back to Offers</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {offer && <OfferForm initialData={offer} isEdit={true} />}
    </div>
  );
}
