"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { COLLECTIONS, type SiteCalendarDoc, type SiteCalendarItemDoc } from "@/lib/schema";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";
import { format, addDays, startOfDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, LogOut, Trash2, Plus, Save } from "lucide-react";

export default function CalendarAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [sites, setSites] = useState<SiteCalendarDoc[]>([]);
  const [items, setItems] = useState<SiteCalendarItemDoc[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newItem, setNewItem] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "08:00",
    description: "",
  });
  const [newSite, setNewSite] = useState({ name: "", slug: "", pin: "0000" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/calendar-admin/login");
      } else {
        setUser(u);
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!db || checking) return;
    const sitesQuery = query(collection(db, COLLECTIONS.SITECALENDARS), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(sitesQuery, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as SiteCalendarDoc);
      setSites(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [checking]);

  useEffect(() => {
    if (!db || !selectedSiteId) {
      setItems([]);
      return;
    }
    const itemsQuery = query(
      collection(db, COLLECTIONS.SITECALENDARITEMS),
      orderBy("date", "asc"),
      orderBy("order", "asc")
    );
    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }) as SiteCalendarItemDoc)
        .filter((item) => item.siteId === selectedSiteId);
      setItems(data);
    });
    return () => unsubscribe();
  }, [selectedSiteId]);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!db || !selectedSiteId || !newItem.title) return;
    setSaving(true);
    try {
      await addDoc(collection(db, COLLECTIONS.SITECALENDARITEMS), {
        siteId: selectedSiteId,
        title: newItem.title,
        description: newItem.description,
        date: Timestamp.fromDate(startOfDay(parseISO(newItem.date))),
        time: newItem.time,
        order: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      toast.success("Item added");
      setNewItem({ title: "", date: format(new Date(), "yyyy-MM-dd"), time: "08:00", description: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(itemId: string) {
    if (!db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.SITECALENDARITEMS, itemId));
      toast.success("Item deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    }
  }

  async function handleAddSite(e: React.FormEvent) {
    e.preventDefault();
    if (!db || !newSite.name || !newSite.slug) return;
    try {
      await addDoc(collection(db, COLLECTIONS.SITECALENDARS), {
        name: newSite.name,
        slug: newSite.slug,
        pin: newSite.pin,
        logoUrl: "/images/adamselectric_logo.png",
        primaryColor: "#005A9C",
        defaultLayout: "vertical",
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      toast.success("Site added");
      setNewSite({ name: "", slug: "", pin: "0000" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add site");
    }
  }

  async function handleLogout() {
    if (!auth) return;
    await signOut(auth);
    router.replace("/calendar-admin/login");
  }

  if (checking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA]">
        <Loader2 className="h-8 w-8 animate-spin text-[#005A9C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/images/adamselectric_logo.png"
            alt="Adams Electric"
            width={120}
            height={60}
            className="object-contain"
            priority
          />
          <h1 className="text-xl font-bold text-[#003A65]">Calendar Admin</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Sites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Select value={selectedSiteId || ""} onValueChange={setSelectedSiteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name} (PIN: {site.pin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <form onSubmit={handleAddSite} className="space-y-3 pt-4 border-t">
                  <h3 className="font-medium text-sm">Add New Site</h3>
                  <Input
                    placeholder="Site name"
                    value={newSite.name}
                    onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  />
                  <Input
                    placeholder="slug"
                    value={newSite.slug}
                    onChange={(e) => setNewSite({ ...newSite, slug: e.target.value })}
                  />
                  <Input
                    placeholder="PIN"
                    maxLength={4}
                    value={newSite.pin}
                    onChange={(e) => setNewSite({ ...newSite, pin: e.target.value })}
                  />
                  <Button type="submit" size="sm" className="w-full bg-[#005A9C] hover:bg-[#003A65]">
                    <Plus className="h-4 w-4 mr-1" /> Add Site
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedSiteId ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Add Calendar Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Title</Label>
                        <Input
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          placeholder="e.g., Safety Stand-Down"
                          required
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={newItem.date}
                          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={newItem.time}
                          onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Optional details..."
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit" disabled={saving} className="bg-[#005A9C] hover:bg-[#003A65]">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                          Save Item
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No items for this site.</p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between p-3 bg-white border rounded-lg">
                            <div>
                              <div className="font-semibold text-[#003A65]">{item.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(item.date.toDate(), "MMM d, yyyy")} at {item.time}
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Select a site from the left panel to manage its calendar items.
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
