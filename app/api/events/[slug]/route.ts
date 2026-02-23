import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

/**
 * GET /api/events/[slug]
 * Retrieves a single event by its slug.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    // 1. Validate slug: Exists, non-empty string, properly trimmed
    if (!slug ||  slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    const trimmedSlug = slug.trim().toLowerCase();

    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Query the Event mongoose model to find one event by slug
    const event: IEvent | null = await Event.findOne({ slug: trimmedSlug }).lean();

    // 4. If not found -> return 404
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // 5. On success -> return 200 with the event JSON
    return NextResponse.json({event}, { status: 200 });
  } catch (error: unknown) {
    // 6. Proper error handling: Catch server errors
    console.error('Error fetching event by slug:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
