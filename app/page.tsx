"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootGate() {
  const router = useRouter();

  useEffect(() => {
    try {
      router.replace(window.localStorage.getItem("margem-consentimento") === "true" ? "/app" : "/bem-vindo");
    } catch {
      router.replace("/bem-vindo");
    }
  }, [router]);

  return null;
}

