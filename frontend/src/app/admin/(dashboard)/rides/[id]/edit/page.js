"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RideForm from "@/components/admin/Rides/RideForm";
import { adminRideService } from "@/services/adminRideService";

export default function EditRidePage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRide() {
      try {
        const data = await adminRideService.getRideById(id);
        setRide(data);
      } catch (err) {
        setError("Failed to load ride details");
      } finally {
        setLoading(false);
      }
    }
    loadRide();
  }, [id]);

  if (loading) {
    return <div className="admin-page">Loading ride details...</div>;
  }

  if (error) {
    return <div className="admin-page">{error}</div>;
  }

  return (
    <div className="admin-page">
      <RideForm initialData={ride} isEdit={true} />
    </div>
  );
}
