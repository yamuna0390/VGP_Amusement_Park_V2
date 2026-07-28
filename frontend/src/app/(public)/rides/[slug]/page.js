import { notFound } from "next/navigation";
import { singleRide } from "@/data/singleRide";

import RideHero from "@/components/rides/RideHero";
import RideHighlights from "@/components/rides/RideHighlights";
import RideOverview from "@/components/rides/RideOverview";
import RideInfoSafetyWrapper from "@/components/rides/RideInfoSafetyWrapper";
import RideOffers from "@/components/rides/RideOffers";
import RideLocation from "@/components/rides/RideLocation";
import BottomCTA from "@/components/rides/BottomCTA";

export async function generateStaticParams() {
  return singleRide.map((ride) => ({
    slug: ride.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ride = singleRide.find((item) => item.slug === slug);
  if (!ride) return {};

  return {
    title: `${ride.n} - VGP Universal Kingdom`,
    description: ride.d || ride.overview || `Experience ${ride.n} at VGP Universal Kingdom amusement park.`,
  };
}

export default async function RideDetails({ params }) {
  const { slug } = await params;

  const ride = singleRide.find((item) => item.slug === slug);

  if (!ride) notFound();

  return (
    <main className="ride-details-page">
      {/* 1. Hero Section */}
      <RideHero ride={ride} />

      {/* 2. Floating Highlights Card */}
      <RideHighlights rideInfo={ride.rideInfo} />

      {/* 3. Ride Overview (2 column layout with interactive gallery) */}
      <RideOverview ride={ride} />

      {/* 4 & 5. Ride Information & Safety Information (Side-by-side Cards) */}
      <RideInfoSafetyWrapper 
        rideInfo={ride.rideInfo} 
        safetyRules={ride.safety}
        locationName={ride.map?.zone}
      />

      {/* 6. Offers Section */}
      <RideOffers />

      {/* 7. Ride Location */}
      <RideLocation rideName={ride.n} mapInfo={ride.map} />

      {/* 8. Bottom CTA */}
      <BottomCTA rideName={ride.n} />
    </main>
  );
}