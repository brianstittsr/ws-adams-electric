"use client";

import { useEffect, useState } from "react";
import { SiteChooser } from "@/components/site-calendars/display/site-chooser";
import { PasswordGate } from "@/components/shared/password-gate";

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("password-gate-auth-home") === "true") {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <PasswordGate
        storageKey="home"
        title="Adams Electric"
        subtitle="Enter the credentials to continue."
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return <SiteChooser />;
}
