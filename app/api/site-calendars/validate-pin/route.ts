/**
 * Validate site calendar PIN
 * POST /api/site-calendars/validate-pin
 * Body: { slug, pin }
 */

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

const validateSchema = z.object({
  slug: z.string().min(1),
  pin: z.string().min(4).max(4),
});

function getAdminDb() {
  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccount) {
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
        projectId,
      });
    } else {
      initializeApp({ projectId });
    }
  }
  return getFirestore();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, pin } = validateSchema.parse(body);

    const db = getAdminDb();
    const calendarSnap = await db.collection("siteCalendars").where("slug", "==", slug).limit(1).get();

    if (calendarSnap.empty) {
      return NextResponse.json({ valid: false, error: "Site not found" }, { status: 404 });
    }

    const calendar = calendarSnap.docs[0].data();

    if (calendar.pin !== pin) {
      return NextResponse.json({ valid: false, error: "Invalid PIN" }, { status: 401 });
    }

    return NextResponse.json({ valid: true, siteId: calendarSnap.docs[0].id });
  } catch (error) {
    console.error("Error validating PIN:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
