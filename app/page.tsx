import ExploteBtn from "@/components/ExploteBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');

const Page = async () => {
    const response = await fetch(`${BASE_URL}/api/events`);

    // Check if the response was successful
    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const { events } = await response.json();

    return (
        <section>
            <h1 className="text-center">The Hub For Every Dev <br /> Event You Cannot Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one Place</p>
            <ExploteBtn />
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={String(event._id)}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    );
};

export default Page;