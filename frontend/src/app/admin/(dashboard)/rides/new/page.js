"use client";

import RideForm from "@/components/admin/Rides/RideForm";

export default function NewRidePage() {
  return (
    <div className="admin-page">
      <RideForm isEdit={false} />
    </div>
  );
}
