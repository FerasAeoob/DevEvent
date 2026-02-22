import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const contentType = req.headers.get("content-type") || "";
        let event;
        let file;
        if (contentType.includes("application/json")) {
            event = await req.json();
            file = event.image;
        } else if (
            contentType.includes("multipart/form-data") ||
            contentType.includes("application/x-www-form-urlencoded")
        ) {
            const formData = await req.formData();
            event = Object.fromEntries(formData.entries());
            file = formData.get("image");
        } else {
            return NextResponse.json(
                { message: 'Unsupported Content-Type', error: `Content-Type "${contentType}" is not supported.` },
                { status: 400 }
            );
        }

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;




        const createdEvent = await Event.create(event);
        return NextResponse.json(createdEvent, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: 'Event Creating Failed', error: e instanceof Error ? e.message : 'Unknown Error' },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({events});

    }catch (e) {
        return NextResponse.json({message: "event fetching failed",error: e}, {status: 500});
    }
}