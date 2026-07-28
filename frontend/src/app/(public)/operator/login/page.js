"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OperatorLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/operator?tab=login");
  }, [router]);

  return <div style={{ padding: "60px", textAlign: "center", fontWeight: "700" }}>Redirecting to Tour Operator Portal...</div>;
}
