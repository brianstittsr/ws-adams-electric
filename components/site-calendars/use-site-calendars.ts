"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, type SiteCalendarDoc } from "@/lib/schema";

export interface UseSiteCalendarsResult {
  sites: SiteCalendarDoc[];
  loading: boolean;
  error: string | null;
}

export function useSiteCalendars(): UseSiteCalendarsResult {
  const [sites, setSites] = useState<SiteCalendarDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError("Firestore not initialized");
      return;
    }

    const q = query(collection(db, COLLECTIONS.SITECALENDARS), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SiteCalendarDoc);
        setSites(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error loading site calendars:", err);
        setError("Failed to load site calendars");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { sites, loading, error };
}
