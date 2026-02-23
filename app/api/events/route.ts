import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400 })
        }

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })

        const tagsValue = formData.get('tags') as string;
        const agendaValue = formData.get('agenda') as string;

        console.log('Raw tags value:', tagsValue);
        console.log('Raw agenda value:', agendaValue);

        let tags = [];
        let agenda = [];

        try {
            tags = tagsValue ? JSON.parse(tagsValue) : [];
        } catch (e) {
            console.error('Error parsing tags:', e);
            // Fallback if tagsValue is not valid JSON but might be a simple string or comma-separated
            if (tagsValue && typeof tagsValue === 'string') {
                tags = tagsValue.split(',').map(t => t.trim());
            }
        }

        try {
            agenda = agendaValue ? JSON.parse(agendaValue) : [];
        } catch (e) {
            console.error('Error parsing agenda:', e);
            if (agendaValue && typeof agendaValue === 'string') {
                agenda = agendaValue.split('\n').map(a => a.trim());
            }
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}