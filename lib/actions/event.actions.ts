'use server';
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({slug});
        if(!event) return [];
        const similarEvents = await Event.find
        ({_id: {$ne: event._id.toString()}, tags: {$in: event.tags }} ).lean().limit(3);
        return similarEvents;
    }catch{
        return[]
    }

}
