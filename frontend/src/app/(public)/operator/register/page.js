"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OperatorRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/operator?tab=register");
  }, [router]);

  return <div style={{ padding: "60px", textAlign: "center", fontWeight: "700" }}>Redirecting to Agency Registration...</div>;
}
