
import {notFound} from "next/navigation";

const BASR_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const { slug } = await params;
    const request = await fetch(`${BASR_URL}/api/events/${slug}`);
    const {event} = await request.json();
    console.log(event);
    if(!event) return notFound();

    return (
        <section id="event">
            <h1>Event details: <br/>{slug}</h1>
        </section>
    );
};

export default EventDetailsPage;