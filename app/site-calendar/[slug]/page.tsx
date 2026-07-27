"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { COLLECTIONS, type SiteCalendarDoc, type SiteCalendarItemDoc } from "@/lib/schema";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { format, parseISO, isSameDay } from "date-fns";
import { Loader2, CalendarDays, MapPin } from "lucide-react";

export default function SiteCalendarDisplayPage() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<SiteCalendarDoc | null>(null);
  const [items, setItems] = useState<SiteCalendarItemDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !slug) return;
    const firestore = db;

    let unsubscribe: (() => void) | undefined;

    async function loadSite() {
      const siteSnap = await getDoc(doc(firestore, COLLECTIONS.SITECALENDARS, slug));
      if (!siteSnap.exists()) {
        setLoading(false);
        return;
      }

      const siteData = { id: siteSnap.id, ...siteSnap.data() } as SiteCalendarDoc;
      setSite(siteData);

      const itemsQuery = query(
        collection(firestore, COLLECTIONS.SITECALENDARITEMS),
        where("siteId", "==", siteSnap.id),
        orderBy("date", "asc"),
        orderBy("order", "asc")
      );

      unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as SiteCalendarItemDoc);
        setItems(data);
        setLoading(false);
      });
    }

    loadSite();
    return () => unsubscribe?.();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA]">
        <Loader2 className="h-10 w-10 animate-spin text-[#005A9C]" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA]">
        <p className="text-muted-foreground">Site not found.</p>
      </div>
    );
  }

  // Build rolling 7-day view
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const itemsByDay = days.map((day) => ({
    day,
    items: items.filter((item) => isSameDay(item.date.toDate(), day)),
  }));

  return (
    <div className="min-h-screen bg-[#F4F7FA] p-6 md:p-10">
      {/* Admin link */}
      <div className="mb-4">
        <a href="/calendar-admin/login" className="text-sm text-[#005A9C] hover:underline">
          Calendar Admin
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-6 mb-8">
          <Image
            src="/images/adamselectric_logo.png"
            alt="Adams Electric"
            width={180}
            height={90}
            className="object-contain"
            priority
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#003A65]">{site.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" /> Safety Office Calendar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {itemsByDay.map(({ day, items: dayItems }, idx) => (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-[#005A9C] text-white p-4 text-center">
                <div className="text-sm uppercase tracking-wide">{format(day, "EEE")}</div>
                <div className="text-2xl font-bold">{format(day, "d")}</div>
                <div className="text-xs opacity-90">{format(day, "MMM")}</div>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {dayItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No events</p>
                ) : (
                  dayItems.map((item) => (
                    <div key={item.id} className="bg-[#F4F7FA] rounded-lg p-3">
                      <div className="font-semibold text-sm text-[#003A65]">{item.title}</div>
                      {item.time && (
                        <div className="text-xs text-[#005A9C] font-medium mt-1 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {item.time}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
