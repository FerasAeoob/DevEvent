import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // 1. Await the params to get the slug from the URL (required in Next.js 15+)
    const { slug } = await params;

    // 2. Query MongoDB for ONLY the event that matches this exact slug
    const event = await Event.findOne({ slug });

    // 3. If no event matches the slug, return a proper 404 error
    if (!event) {
      return NextResponse.json(
          { message: "Event not found" },
          { status: 404 }
      );
    }

    // 4. Return the single event wrapped in an "event" property
    // (This perfectly matches your original page.tsx setup!)
    return NextResponse.json({ event }, { status: 200 });

  } catch (error) {
    console.error("Error fetching single event:", error);
    return NextResponse.json(
        { message: "Failed to fetch event" },
        { status: 500 }
    );  }
}