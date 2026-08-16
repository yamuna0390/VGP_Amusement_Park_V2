"use client";

import OfferForm from "@/components/admin/Offers/OfferForm";

export default function CreateOfferPage() {
  return (
    <div className="admin-page">
      <OfferForm isEdit={false} />
    </div>
  );
}
